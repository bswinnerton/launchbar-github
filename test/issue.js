const assert = require('assert');

const Account     = require('../Contents/Scripts/account.js').Account;
const Issue       = require('../Contents/Scripts/issue.js').Issue;
const Repository  = require('../Contents/Scripts/repository.js').Repository;

describe('Issue', function() {
  let org   = new Account('rails');
  let repo  = new Repository(org, 'rails');
  let issue = new Issue(repo, '123', 'Fix all the things');

  describe('.fetch', function() {
    it('fetches issue data from the GitHub GraphQL API');
  });

  describe('#url', function() {
    it('returns the URL of an issue', function() {
      assert.equal('https://github.com/rails/rails/issues/123', issue.url);
    });
  });

  describe('#toMenuItem()', function() {
    it("returns an object formatted to be displayed in LaunchBar", function() {
      assert.deepEqual({
        title: 'Fix all the things',
        url: 'https://github.com/rails/rails/issues/123',
        icon: 'issueTemplate.png',
        subtitle: 'rails/rails#123',
        alwaysShowsSubtitle: true
      }, issue.toMenuItem());
    });
  });
});
