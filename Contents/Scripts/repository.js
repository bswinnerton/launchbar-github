class Repository {
  constructor(owner, name, description) {
    this.owner = owner;
    this.name = name;
    this.description = description;
  }

  get nameWithOwner() {
    return this.owner.login + '/' + this.name;
  }

  get url() {
    return 'https://github.com/' + this.nameWithOwner;
  }

  get issuesURL() {
    return this.url + '/issues';
  }

  get pullRequestsURL() {
    return this.url + '/pulls';
  }

  toMenuItem() {
    let menuItem = {
      title: this.nameWithOwner,
      url: this.url,
      icon: 'repoTemplate.png',
    };

    if (this.description) {
      menuItem.subtitle = this.description;
      menuItem.alwaysShowsSubtitle = true;
    }

    return menuItem;
  }
}

if (typeof module !== 'undefined') { module.exports.Repository = Repository; }
