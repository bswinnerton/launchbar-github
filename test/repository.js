const assert = require('assert');

const Account     = require('../Contents/Scripts/account.js').Account;
const Repository  = require('../Contents/Scripts/repository.js').Repository;

describe('Repository', function() {
  let org   = new Account('rails');
  let repo  = new Repository(org, 'rails', 'A Ruby web framework');

  describe('#nameWithOwner', function() {
    it('returns a formatted string of the account login and name', function() {
      assert.equal('rails/rails', repo.nameWithOwner);
    });
  });

  describe('#url', function() {
    it('returns the full URL of the repository', function() {
      assert.equal('https://github.com/rails/rails', repo.url);
    });
  });

  describe('#issuesURL', function() {
    it("returns the full URL of the repository's issues", function() {
      assert.equal('https://github.com/rails/rails/issues', repo.issuesURL);
    });
  });

  describe('#pullRequestsURL', function() {
    it("returns the full URL of the repository's pull requests", function() {
      assert.equal('https://github.com/rails/rails/pulls', repo.pullRequestsURL);
    });
  });

  describe('#toMenuItem()', function() {
    it("returns an object formatted to be displayed in LaunchBar", function() {
      assert.deepEqual({
        title: 'rails/rails',
        url: 'https://github.com/rails/rails',
        icon: 'repoTemplate.png',
        subtitle: 'A Ruby web framework',
        alwaysShowsSubtitle: true
      }, repo.toMenuItem());
    });
  });
});
