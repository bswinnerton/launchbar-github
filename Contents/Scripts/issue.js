class Issue {
  constructor(repository, number) {
    this.repository = repository;
    this.number = number;
  }

  get url() {
    return 'https://github.com/' + this.repository.nameWithOwner + '/issues/' + this.number;
  }
}

module.exports.Issue = Issue;
