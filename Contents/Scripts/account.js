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
      let repo  = edge.node;
      let owner = new Account(repo.owner.login);

      return new Repository(owner, repo.name, repo.description);
    });
  }

  pullRequests() {
    let cacheKey = 'account-pull-requests-for-' + this.login;

    let pullRequestEdges = Cache.fetch(cacheKey, 3600, () => {
      const query = `
        query {
          viewer {
            pullRequests(first:100,states:[OPEN],orderBy:{field:UPDATED_AT,direction:DESC}) {
              edges {
                node {
                  title
                  number
                  repository {
                    name
                    owner {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      `;

      let variables = {};
      let result    = GraphQL.execute(query, variables);

      if (result) {
        return result.data.viewer.pullRequests.edges;
      } else {
        return [];
      }
    });

    return pullRequestEdges.map(function(edge) {
      let pullRequest = edge.node;
      let number      = pullRequest.number;
      let title       = pullRequest.title;

      let owner = new Account(pullRequest.repository.owner.login);
      let repo  = new Repository(owner, pullRequest.repository.name);

      return new PullRequest(repo, number, title);
    });
  }

  issues() {
    let cacheKey = 'account-issues-for-' + this.login;

    let issueEdges = Cache.fetch(cacheKey, 3600, () => {
      const query = `
        query {
          viewer {
            issues(first:3,states:[OPEN],orderBy:{field:UPDATED_AT,direction:DESC}) {
              edges {
                node {
                  title
                  number
                  repository {
                    name
                    owner {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      `;

      let variables = {};
      let result    = GraphQL.execute(query, variables);

      if (result) {
        return result.data.viewer.issues.edges;
      } else {
        return [];
      }
    });

    return issueEdges.map(function(edge) {
      let issue = edge.node;
      let number      = issue.number;
      let title       = issue.title;

      let owner = new Account(issue.repository.owner.login);
      let repo  = new Repository(owner, issue.repository.name);

      return new Issue(repo, number, title);
    });
  }

  _fetchRepositories(cursor, allEdges) {
    allEdges = allEdges || [];

    const query = `
      query($login: String!, $cursor: String) {
        repositoryOwner(login: $login) {
          repositories(first: 100, after: $cursor, affiliations:[OWNER], orderBy: {field: PUSHED_AT, direction: DESC}) {
            edges {
              cursor
              node {
                name
                description
                owner {
                  login
                }
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
