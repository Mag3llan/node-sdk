//var request = require('request-promise');
var Promise = require('bluebird');
var request = require('request');
var limiter = require('limiter');
var debug = require('debug')('node-sdk');
var Agent = require('agentkeepalive');

var keepaliveAgent = new Agent({
  maxSockets: 100,
  maxFreeSockets: 10,
  timeout: 60000,
  keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
});
    
var timeout = 60000;
var mag3llanURI;
var api_key;

var rate = 300;

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

if (process.env.MAG3LLAN_RATE_LIMIT) {
	rate = parseInt(process.env.MAG3LLAN_RATE_LIMIT);
}

var rateLimiter = Promise.promisifyAll(new limiter.RateLimiter(rate, 'second'));

function Mag3llan(uri, key) {
	if (!isURL(uri))
		throw new Error('Invalid Mag3llan host URI');
	if (!key)
		throw new Error('Mag3llan API key is required');

	api_key = key;
	mag3llanURI = uri + '/api/';

	debug(mag3llanURI)
}

Mag3llan.prototype.setPreference = function(userId, itemId, score) {
	var preference = {
		uid: parseInt(userId),
		iid: parseInt(itemId),
		value: parseFloat(score)
	};

	return put('preference/' + userId + '/' + itemId, preference);
}

Mag3llan.prototype.delPreference = function(userId, itemId) {
	return del('preference/' + userId + '/' + itemId);
}

Mag3llan.prototype.deleteUser = function(userId) {
	return del('user/' + userId);
}

Mag3llan.prototype.plu = function(userId, threshold) {
	var params = threshold ? '?threshold=' + threshold : '';
	return get('plu/' + userId + params);
}

Mag3llan.prototype.pluItemRating = function(userId, itemId, threshold) {
	var params = threshold ? '?threshold=' + threshold : '';
	return get('plu/' + userId + '/rating/' + itemId + params);
}

Mag3llan.prototype.overlaps = function(userId, otherUserId) {

	return get('overlaps/' + userId + '/' + otherUserId);
}

Mag3llan.prototype.recommendations = function(userId) {
	return get('recommendation/' + userId);
}

Mag3llan.prototype.groupRecommendations = function(userId, otherUserId) {
	return get('recommendation/' + userId + '/' + otherUserId);
}

Mag3llan.prototype.similarity = function(userId, otherUserId) {
	return get('similarity/' + userId + '/' + otherUserId);
}

function get(resourceURI) {
	var getOpts = {

		uri: encodeURI(mag3llanURI + resourceURI),
		timeout: timeout,
		resolveWithFullResponse: true,
		headers: {
			'Accept': 'application/json',
			'Access_Token': api_key
		}
	};

	return execute(getOpts)
		.then(function(response) {
			return JSON.parse(response.body);
		})
}

function post(resourceURI, resource) {
	var postOpts = {
		uri: encodeURI(mag3llanURI + resourceURI),
		method: 'POST',
		timeout: timeout,
		json: true,
		body: resource,
		resolveWithFullResponse: true,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access_Token': api_key
		}
	};

	return execute(postOpts);
}

function del(resourceURI) {
	var delOpts = {
		uri: encodeURI(mag3llanURI + resourceURI),
		method: 'DELETE',
		timeout: timeout,
		resolveWithFullResponse: true,
		headers: {
			'Accept': 'application/json',
			'Access_Token': api_key
		}
	};

	return execute(delOpts)
		.then(function(response) {
			if (response.statusCode != 204)
				return Promise.reject('Unable to delete: ' + resourceURI);

			return response.body;
		});
}

function put(resourceURI, resource) {
	var putOpts = {
		uri: encodeURI(mag3llanURI + resourceURI),
		method: 'PUT',
		agent: keepaliveAgent,
		timeout: timeout,
		json: true,
		body: resource,
		resolveWithFullResponse: true,
		headers: {
			'Connection': 'keep-alive',
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Access_Token': api_key
		}
	}

	return execute(putOpts);
}

function execute(options) {
	return rateLimiter.removeTokensAsync(1)
		.then(function() {
			return new Promise(function(resolve, reject) {
				debug(options);
				request(options, function(error, response, body) {
					if (error) {
						debug(err)
						reject(error);
					} else {
						if (response.statusCode >= 200 && response.statusCode < 300) {
							var result = {
								body: body,
								statusCode: response.statusCode
							};
							console.log(result)
							resolve(result);
						} else {
							var customError = new Error(body);
							customError.statusCode = response.statusCode;
							reject(customError);
						}
					}

				});
			});
		});
}

exports = module.exports = Mag3llan;