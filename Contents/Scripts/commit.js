class Commit {
  constructor(sha) {
    this.sha = sha;
  }

  pullRequests() {
    const query = `
      query($sha: String!) {
        search(query:$sha, type:ISSUE, last:30) {
          edges {
            node {
              ... on PullRequest {
                title
                number
                url
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
    return result.data.search.edges.map(function(edge) { return edge.node });
  }
}

module.exports.Commit = Commit;
