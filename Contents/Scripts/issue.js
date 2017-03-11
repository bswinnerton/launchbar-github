class Issue {
  constructor(repository, number, title) {
    this.repository = repository;
    this.number = parseInt(number);
    this.title = title;
  }

  get url() {
    return 'https://github.com/' + this.repository.nameWithOwner + '/issues/' + this.number;
  }

  toMenuItem() {
    let menuItem = {
      url: this.url,
      icon: 'issueTemplate.png',
    };

    if (this.title) {
      menuItem.title = this.title;
      menuItem.subtitle = 'View Issue: ' + this.repository.nameWithOwner + '#' + this.number;
      menuItem.alwaysShowsSubtitle = true;
    } else {
      menuItem.title = 'View Issue: ' + this.repository.nameWithOwner + '#' + this.number;
    }

    return menuItem;
  }
}

Issue.fetch = function(repository, number) {
  let login     = repository.owner.login;
  let name      = repository.name;
  let cacheKey  = 'issue-' + number + '-for-' + login + '-' + name;

  let issueish = Cache.fetch(cacheKey, 604800, () => {
    const query = `
      query($login: String!, $name: String!, $number: Int!) {
        repository(owner: $login, name: $name) {
          issueish(number: $number) {
            title
          }
        }
      }
    `;

    let variables = { login: login, name: name, number: number };
    let result    = GraphQL.execute(query, variables);

    if (result.data) {
      return result.data.repository.issueish;
    } else {
      return {};
    }
  });

  if (issueish) {
    return new Issue(repository, number, issueish.title);
  } else {
    return null;
  }

};

if (typeof module !== 'undefined') { module.exports.Issue = Issue; }
