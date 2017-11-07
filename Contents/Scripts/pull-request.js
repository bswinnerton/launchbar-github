class PullRequest {
  constructor(repository, number, title, url) {
    this.repository = repository;
    this.number     = number;
    this.title      = title;
    this.passedUrl  = url;
  }

  get url() {
    if (this.passedUrl) {
      return this.passedUrl;
    } else {
      return this.repository.url + '/pull/' + this.number;
    }
  }

  get shortURL() {
    return this.repository.nameWithOwner + '#' + this.number;
  }

  toMenuItem() {
    return {
      title: this.title,
      subtitle: this.shortURL,
      alwaysShowsSubtitle: true,
      icon: 'pullRequestTemplate.png',
      url: this.url,
    };
  }
}

if (typeof module !== 'undefined') { module.exports.PullRequest = PullRequest; }
