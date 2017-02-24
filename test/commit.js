const assert = require('assert');

const Commit = require('../Contents/Scripts/commit.js').Commit;

describe('commit', function() {
  let sha = 'e6557a15';
  let commit = new Commit(sha);

  describe('#searchURL', function() {
    it('returns the URL that can be used to search for the commit', function() {
      assert.equal('https://github.com/search?q=e6557a15&type=Commits&utf8=%E2%9C%93', commit.searchURL);
    });
  });

  describe('#pullRequests()', function() {
    it('returns the pull requests where the commit was introduced');
  });
});
