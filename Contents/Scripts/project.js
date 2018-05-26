class Project {
  constructor(owner, name, number, body, url) {
    this.owner      = owner;
    this.name       = name;
    this.number     = number;
    this.body       = body;
    this.passedUrl  = url;
  }

  get url() {
    if (this.passedUrl) {
      return this.passedUrl + '?fullscreen=true';
    } else {
      return this.owner.url + '/projects/' + this.number + '?fullscreen=true';
    }
  }

  toMenuItem() {
    return {
      title: this.name,
      subtitle: this.body,
      alwaysShowsSubtitle: true,
      icon: 'projectTemplate.png',
      url: this.url,
    };
  }
}

if (typeof module !== 'undefined') { module.exports.Project = Project; }
