class Account {
  constructor(login) {
    this.login = login;
  }

  get handle() {
    return '@' + this.login;
  }

  get profileURL() {
    return 'https://github.com/' + this.login;
  }

  get repositoriesURL() {
    return 'https://github.com/' + this.login + '?tab=repositories';
  }

  get issuesURL() {
    return 'https://github.com/search?utf8=%E2%9C%93&q=author%3A' + this.login + '+is%3Aissue&ref=simplesearch';
  }

  get pullRequestsURL() {
    return 'https://github.com/search?utf8=%E2%9C%93&q=author%3A' + this.login + '+is%3Apr&ref=simplesearch';
  }

  get gistsURL() {
    return 'https://gist.github.com/' + this.login;
  }

  repositories() {
    let cache = new Cache();
    let cacheKey = this.login + '-repositories';

    let repositoryEdges = cache.fetch(cacheKey, 3600, () => {
      return this._fetchRepositories();
    });

    return repositoryEdges.map(function(edge) {
      let repo = edge.node;
      return new Repository(this, repo.name, repo.description);
    }, this);
  }

  _fetchRepositories(cursor, allEdges = []) {
    const query = `
      query($login: String!, $cursor: String) {
        repositoryOwner(login: $login) {
          repositories(first: 30, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
            edges {
              cursor
              node {
                name
                description
                url
              }
            }
          }
        }
      }
    `;

    let variables = {
      login: this.login,
      cursor: cursor,
    };

    let result = this._executeQuery(query, variables);
    let repositoryEdges = result.data.repositoryOwner.repositories.edges;

    if (repositoryEdges.length > 0) {
      allEdges = allEdges.concat(repositoryEdges);

      let lastEdge = repositoryEdges[repositoryEdges.length - 1];
      return this._fetchRepositories(lastEdge.cursor, allEdges);
    }

    return allEdges;
  }

  _executeQuery(query, variables) {
    let result;

    if (!Action.preferences.token) {
      LaunchBar.openURL('https://github.com/settings/tokens');
      LaunchBar.alert("It looks like this is the first time you're using " +
        "this action.\n\nPlease go to https://github.com/settings/tokens " +
        "and create token with 'repo' scope and set it by invoking the " +
        "github action and typing !set-token <token>");
      return;
    }

    result = HTTP.post('https://api.github.com/graphql', {
      headerFields: { authorization: 'token ' + Action.preferences.token },
      body: JSON.stringify({ query: query, variables: variables })
    });

    LaunchBar.debugLog(JSON.stringify(result));

    if (result.data) {
      return JSON.parse(result.data);
    }
  }
}

module.exports.Account = Account;
