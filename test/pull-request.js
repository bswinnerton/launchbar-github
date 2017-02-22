const assert = require('assert');

const Account     = require('../Contents/Scripts/account.js').Account;
const PullRequest = require('../Contents/Scripts/pull-request.js').PullRequest;
const Repository  = require('../Contents/Scripts/repository.js').Repository;

describe('PullRequest', function() {
  let number = '42';
  let title  = 'Fix off by one bug';

  let owner       = new Account('obama');
  let repo        = new Repository(owner, 'whitehouse.gov', 'My blog.');
  let pullRequest = new PullRequest(number, repo, title);

  describe('#url', function() {
    it('returns the URL of the pull request', function() {
      assert.equal('https://github.com/obama/whitehouse.gov/pull/42', pullRequest.url);
    });
  });

  describe('#shortURL', function() {
    it('returns the short URL of the pull request', function() {
      assert.equal('obama/whitehouse.gov#42', pullRequest.shortURL);
    });
  });

  describe('#toMenuItem()', function() {
    it('returns a JSON formatted menu item for LaunchBar', function() {
      assert.deepEqual({
        title: 'Fix off by one bug',
        subtitle: 'obama/whitehouse.gov#42',
        alwaysShowsSubtitle: true,
        icon: 'pull-request.png',
        url: 'https://github.com/obama/whitehouse.gov/pull/42',
      }, pullRequest.toMenuItem());
    });
  });
});
