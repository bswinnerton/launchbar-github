const assert = require('assert');

const Commit = require('../Contents/Scripts/commit.js').Commit;

describe('commit', function() {
  let sha = 'e6557a15';
  let commit = new Commit(sha);

  describe('#pullRequests()', function() {
    it('returns the pull requests where the commit was introduced');
  });
});
