var sinon = require('sinon'),
	assert = require("assert"),
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	Promise = require('bluebird');

chai.should();
chai.use(chaiAsPromised);
var Mag3llan = require('../index.js');

var itemIds = new Array(10000);
for (var i = 0; i < itemIds.length; i++) {
    itemIds[i] = i
}

describe('Mag3llan SDK', function() {
	this.timeout(10000);
	var mag3llan = new Mag3llan('http://localhost:8080/api/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6ImxlbyIsIkVtYWlsIjoibGVvQGZzLmNvbSJ9.x__nBKPF7bEDtOB18RcSe7xGXrxiUHtigycVwGtw8cM');

	describe('Set 10,000 preferences on single user', function() {
		var uid = 666;
		var v = 4;

		//console.log(itemIds);
		
		it('Call set preference api without recieving any errors', function(done) {
			Promise.map(itemIds, function(iid) {
				return mag3llan.setPreference(uid, iid, v);
			}).all().then(function() {
				done()
			});		   	
	    });
		
	});
});