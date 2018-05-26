const assert = require('assert');

const Organization  = require('../Contents/Scripts/organization.js').Organization;
const Project       = require('../Contents/Scripts/project.js').Project;

describe('Project', function() {
  let name    = 'API Code Review';
  let number  = '42';
  let body    = 'A project board to track the status of API code review';
  let url     = 'https://github.com/rails/projects/42';
  let owner   = new Organization('rails');
  let project = new Project(owner, name, number, body, url);

  describe('#url', function() {
    it('returns the URL of the project appended with fullscreen if supplied', function() {
      assert.equal('https://github.com/rails/projects/42?fullscreen=true', project.url);
    });

    it('returns the URL of the project appended with fullscreen if not supplied', function() {
      let number  = 1;
      let project = new Project(owner, name, number, body);
      assert.equal('https://github.com/orgs/rails/projects/1?fullscreen=true', project.url);
    });
  });

  describe('#toMenuItem()', function() {
    it('returns a JSON formatted menu item for LaunchBar', function() {
      assert.deepEqual({
        title: 'API Code Review',
        subtitle: 'A project board to track the status of API code review',
        alwaysShowsSubtitle: true,
        icon: 'projectTemplate.png',
        url: 'https://github.com/rails/projects/42?fullscreen=true',
      }, project.toMenuItem());
    });
  });
});
