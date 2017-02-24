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
    let cacheKey = 'account-repositories-for-' + this.login;

    let repositoryEdges = Cache.fetch(cacheKey, 3600, () => {
      return this._fetchRepositories();
    });

    return repositoryEdges.map(function(edge) {
      let repo = edge.node;
      return new Repository(this, repo.name, repo.description);
    }, this);
  }

  _fetchRepositories(cursor, allEdges) {
    allEdges = allEdges || [];

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

    let result = GraphQL.execute(query, variables);

    if (result) {
      let repositoryEdges = result.data.repositoryOwner.repositories.edges;

      if (repositoryEdges.length > 0) {
        allEdges = allEdges.concat(repositoryEdges);

        let lastEdge = repositoryEdges[repositoryEdges.length - 1];
        return this._fetchRepositories(lastEdge.cursor, allEdges);
      }
    } else {
      return [];
    }

    return allEdges;
  }
}

if (typeof module !== 'undefined') { module.exports.Account = Account; }
