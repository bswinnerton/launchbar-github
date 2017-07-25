const assert = require('assert');

const Account = require('../Contents/Scripts/account.js').Account;

describe('Account', function() {
  let user = new Account('obama');

  describe('#handle', function() {
    it('returns the login of a user with an @ sign', function() {
      assert.equal('@obama', user.handle);
    });
  });

  describe('#profileURL', function() {
    it('returns the URL of the user', function() {
      assert.equal('https://github.com/obama', user.profileURL);
    });
  });

  describe('#repositoriesURL', function() {
    it("returns the URL of the user's repositories", function() {
      assert.equal('https://github.com/obama?tab=repositories', user.repositoriesURL);
    });
  });

  describe('#issuesURL', function() {
    it("returns the URL of the user's issues", function() {
      assert.equal('https://github.com/search?utf8=%E2%9C%93&q=author%3Aobama+is%3Aissue&ref=simplesearch', user.issuesURL);
    });
  });

  describe('#pullRequestsURL', function() {
    it("returns the URL of the user's pull requests", function() {
      assert.equal('https://github.com/search?utf8=%E2%9C%93&q=author%3Aobama+is%3Apr&ref=simplesearch', user.pullRequestsURL);
    });
  });

  describe('#gistsURL', function() {
    it("returns the URL of the user's gists", function() {
      assert.equal('https://gist.github.com/obama', user.gistsURL);
    });
  });

  describe('#repositories()', function() {
    it("returns the user's repositories");
  });

  describe('#pullRequests()', function() {
    it("returns the user's pull requests");
  });

  describe('#issues()', function() {
    it("returns the user's issues");
  });

  describe('#gists()', function() {
    it("returns the user's gists");
  });
});
