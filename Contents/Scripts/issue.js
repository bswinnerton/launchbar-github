class Issue {
  constructor(repository, number, title) {
    this.repository = repository;
    this.number = parseInt(number);
    this.title = title;
  }

  get url() {
    return 'https://github.com/' + this.repository.nameWithOwner + '/issues/' + this.number;
  }

  get shortURL() {
    return this.repository.nameWithOwner + '#' + this.number;
  }

  toMenuItem() {
    let showMoreText = 'View Issue: ' + this.shortURL;

    let menuItem = {
      url: this.url,
      icon: 'issueTemplate.png',
    };

    if (this.title) {
      menuItem.title = this.title;
      menuItem.subtitle = showMoreText;
      menuItem.alwaysShowsSubtitle = true;
    } else {
      menuItem.title = showMoreText;
    }

    return menuItem;
  }
}

Issue.fetch = function(repository, number) {
  let login     = repository.owner.login;
  let name      = repository.name;
  let cacheKey  = 'issue-' + number + '-for-' + login + '-' + name;

  let issueOrPullRequest = Cache.fetch(cacheKey, 604800, () => {
    const query = `
      query($login: String!, $name: String!, $number: Int!) {
        repository(owner: $login, name: $name) {
          issueOrPullRequest(number: $number) {
            ... on Issue {
              title
            }
            ... on PullRequest {
              title
            }
          }
        }
      }
    `;

    let variables = { login: login, name: name, number: number };
    let result    = GraphQL.execute(query, variables);

    if (result.data) {
      return result.data.repository.issueOrPullRequest;
    } else {
      return {};
    }
  });

  if (issueOrPullRequest) {
    return new Issue(repository, number, issueOrPullRequest.title);
  } else {
    return null;
  }

};

if (typeof module !== 'undefined') { module.exports.Issue = Issue; }
