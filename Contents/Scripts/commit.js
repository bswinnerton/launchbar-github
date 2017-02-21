class Commit {
  constructor(sha) {
    this.sha = sha;
  }

  pullRequests() {
    let cacheKey = 'commit-pull-requests-for-' + this.sha;

    let pullRequestEdges = cache.fetch(cacheKey, 604800, () => {
      return this._fetchPullRequests();
    });

    return pullRequestEdges.map(function(edge) {
      let pr = edge.node;

      let owner       = new Account(pr.repository.owner.login);
      let repository  = new Repository(owner, pr.repository.name);

      return new PullRequest(pr.number, repository, pr.title);
    }, this);
  }

  _fetchPullRequests() {
    const query = `
      query($sha: String!) {
        search(query:$sha, type:ISSUE, last:30) {
          edges {
            node {
              ... on PullRequest {
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

    let variables = {
      sha: this.sha,
    };

    let result = GraphQL.execute(query, variables);

    return result.data.search.edges;
  }
}

module.exports.Commit = Commit;
