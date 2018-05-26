const assert = require('assert');

const Organization = require('../Contents/Scripts/organization.js').Organization;

describe('Organization', function() {
  let org = new Organization('rails');

  describe('#url', function() {
    it("returns the URL of the organization", function() {
      assert.equal('https://github.com/orgs/rails', org.url);
    });
  });

  describe('#projectsURL', function() {
    it("returns the URL of the organization's projects", function() {
      assert.equal('https://github.com/orgs/rails/projects?fullscreen=true', org.projectsURL);
    });
  });

  describe('#projects()', function() {
    it("returns the organization's projects");
  });
});
