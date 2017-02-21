class PullRequest {
  constructor(number, repository, title) {
    this.number     = number;
    this.repository = repository;
    this.title      = title;
  }

  get url() {
    return this.repository.url + '/pull/' + this.number;
  }

  get shortURL() {
    return this.repository.nameWithOwner + '#' + this.number;
  }

  toMenuItem() {
    return {
      title: this.title,
      subtitle: this.shortURL,
      alwaysShowsSubtitle: true,
      icon: 'pull-request.png',
      url: this.url,
    };
  }
}

module.exports.PullRequest = PullRequest;
