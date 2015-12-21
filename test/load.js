var sinon = require('sinon'),
	assert = require("assert"),
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	Promise = require('bluebird');

chai.should();
chai.use(chaiAsPromised);
var Mag3llan = require('../index.js');

var ids = new Array(10000);
for (var i = 0; i < ids.length; i++) {
    ids[i] = i
}

var mag3llanHost = process.env.MAG3LLAN_HOST || 'http://localhost:8080';
var mag3llanKey = process.env.MAG3LLAN_KEY;

describe('Mag3llan SDK', function() {
	this.timeout(100000);
	var mag3llan = new Mag3llan(mag3llanHost, mag3llanKey);

	describe('Set 10,000 preferences on single user (zero co-occurrences)', function() {
		var uid = 667;
		var v = 4;

		it('Call set preference api without recieving any errors', function(done) {
			Promise.map(ids, function(iid) {
				return mag3llan.setPreference(uid, iid, v);
			}).all().then(function() {
				done()
			});		   	
	    });
		
	});

	// describe('Set preference on 10,000 users (max co-occurrences)', function() {
	// 	var iid = 1;
	// 	var v = 4;
		
	// 	it('Call set preference api without recieving any errors', function(done) {
	// 		Promise.map(ids, function(uid) {
	// 			return mag3llan.setPreference(uid, iid, v);
	// 		}).all().then(function() {
	// 			done()
	// 		});		   	
	//     });
		
	// });
});