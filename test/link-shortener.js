const assert = require('assert');

const LinkShortener = require('../Contents/Scripts/link-shortener.js').LinkShortener;

describe('LinkShortener', function() {
  let linkShortener = new LinkShortener('rails');
  let link = 'https://github.com/bswinnerton/launchbar-github/blob/master/README.md';

  describe('#run', function() {
    it('returns the shortened version of a GitHub link');
    it('does not shorten non-GitHub links');
  });
});
