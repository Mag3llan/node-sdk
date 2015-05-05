var assert = require("assert")
var Mag3llan = require('../index.js');

describe('Mag3llan', function(){                   
  var sdk = new Mag3llan('http://localhost:8080/api/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6ImxlbyIsIkVtYWlsIjoibGVvQGZzLmNvbSJ9.x__nBKPF7bEDtOB18RcSe7xGXrxiUHtigycVwGtw8cM');
    
  describe('preference', function(done){
    sdk.delPreference(2, 2)
      .then(function(result) {
        it('response should be 201', function(done){
          sdk.setPreference(2, 2, 3)
              .then(function(result) {
                assert.equal('The request has been fulfilled and resulted in a new resource being created.', result);
              });
        })
      })
  })
})