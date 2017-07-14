class Repository {
  constructor(owner, name, description, parent) {
    this.owner = owner;
    this.name = name;
    this.description = description;
    this.parent = parent;
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

  get isFork() {
    if (this.parent) {
      return true;
    } else {
      return false;
    }
  }

  get icon() {
    if (this.isFork) {
      return 'forkTemplate.png';
    } else {
      return 'repoTemplate.png';
    }
  }

  toMenuItem() {
    let menuItem = {
      title: this.nameWithOwner,
      url: this.url,
      icon: this.icon,
    };

    if (this.description) {
      menuItem.subtitle = this.description;
      menuItem.alwaysShowsSubtitle = true;
    }

    return menuItem;
  }
}

if (typeof module !== 'undefined') { module.exports.Repository = Repository; }
