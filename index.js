//var request = require('request-promise');
var Promise = require('bluebird');
var request = require('request');
var limiter = require('limiter');
var timeout = 60000;
var mag3llanURI;
var api_key;

var rateLimiter = Promise.promisifyAll(new limiter.RateLimiter(1000, 'second'));

function Mag3llan(uri, key) {
	api_key = key;
	mag3llanURI = uri;
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

Mag3llan.prototype.similarity = function(userId, otherUserId) {
	return get('similarity/' + userId + '/' + otherUserId);
}

function get(resourceURI, key) {
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
		.then(function(results) {
			return JSON.parse(results.body);
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

	return execute(delOpts);
}

function put(resourceURI, resource) {
	var putOpts = {
		uri: encodeURI(mag3llanURI + resourceURI),
		method: 'PUT',
		timeout: timeout,
		json: true,
		body: resource,
		resolveWithFullResponse: true,
		headers: {
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
				request(options, function(error, response, body) {
					if (error) {
						console.log('A major failure occurred... ');
						console.dir(error);
						reject(error);
					} else {
						if (response.statusCode >= 200 && response.statusCode < 300) {
							resolve({
								body: body,
								statusCode: response.statusCode
							});
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