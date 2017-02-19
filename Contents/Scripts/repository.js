class Repository {
  constructor(owner, name, url, description) {
    this.owner = owner,
    this.name = name,
    this.description = description,
    this.url = url
  }

  get nameWithOwner() {
    return this.owner.login + '/' + this.name;
  }

  toMenuItem() {
    let menuItem = {
      title: this.nameWithOwner,
      url: this.url,
      icon: 'repo.png',
    }

    if (this.description) {
      menuItem.subtitle = this.description;
      menuItem.alwaysShowsSubtitle = true;
    }

    return menuItem;
  }
}
