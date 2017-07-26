const assert = require('assert');

const Gist = require('../Contents/Scripts/gist.js').Gist;

describe('Gist', function() {
  let name        = Math.random().toString(36).substr(2, 10);;
  let description = 'The gist of: ' + name;
  let gist        = new Gist(name, description);

  describe('#url', function() {
    it('returns the URL of an issue', function() {
      assert.equal('https://gist.github.com/' + name, gist.url);
    });
  });

  describe('#toMenuItem()', function() {
    it("returns an object formatted to be displayed in LaunchBar", function() {
      assert.deepEqual({
        title: gist.name,
        url: 'https://gist.github.com/' + gist.name,
        icon: 'gistTemplate.png',
        subtitle: gist.description,
        alwaysShowsSubtitle: true
      }, gist.toMenuItem());
    });
  });
});
