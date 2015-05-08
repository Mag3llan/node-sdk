var sinon = require('sinon'),
	assert = require("assert"),
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	Promise = require('bluebird');

chai.should();
chai.use(chaiAsPromised);
var Mag3llan = require('../index.js');

describe('Mag3llan SDK', function() {
	this.timeout(1000);
	var mag3llan = new Mag3llan('http://localhost:8080/api/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6ImxlbyIsIkVtYWlsIjoibGVvQGZzLmNvbSJ9.x__nBKPF7bEDtOB18RcSe7xGXrxiUHtigycVwGtw8cM');

	describe('Set preference', function() {
		var uid = 666;
		var iid = 333;
		var v = 4;

		it('Should create a preference', function(done) {
			mag3llan.setPreference(uid, iid, v)
				.then(function() {
					done();
				});
		});

		it('Should update the preference', function(done) {
			mag3llan.setPreference(uid, iid, v + 1)
				.then(function() {
					done();
				});
		});

		it('Force should override the existing preference', function(done) {
			mag3llan.setPreference(uid, iid, v, true)
				.then(function() {
					done();
				});
		});

	});

	describe('Get PLU', function() {

		var uid = 100;

		it('Should return 200 OK', function(done) {
			mag3llan.plu(uid)
				.then(function(plu) {
					plu.should.have.property('length').equal(0);
					done();
				});
		});

	});

	describe('Get PLU Item Rating', function() {

		var uid = 100;
		var iid = 603;

		it('Should return 200 OK', function(done) {
			mag3llan.pluItemRating(uid, iid)
				.then(function(rating) {
					rating.pv.should.equal(0);
					done();
				});
		});

	});

	describe('Get overlaps', function() {
		var uid = 666;
		var ouid = 101;
		var iid = 333;
		var v = 4;
		it('Should return 200 OK', function(done) {
			mag3llan.setPreference(ouid, iid, v)
			.then(function() {
				mag3llan.overlaps(uid, ouid)
					.then(function(response) {
						response.overlaps.should.have.property('length').above(0);
						done();
					});
			});
		})
	});

	describe('Delete user', function() {
		var uid = 666;

		it('should return no content', function(done) {
			mag3llan.deleteUser(uid)
				.then(function(response) {
					response.statusCode.should.equal(204);
					done();
				});
		});

	});
	
});