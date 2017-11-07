class Resource {
  constructor(url) {
    this.url = url;
  }

  toObject() {
    const query = `
      query($url: URI!) {
        resource(url: $url) {
          __typename
          ... on Issue {
            title
            number
            repository {
              name
              owner {
                login
              }
            }
          }

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
    `;

    let variables = { url: this.url };
    let result    = GraphQL.execute(query, variables);

    if (result) {
      if (result.data && result.data.resource) {
        let issueOrPullRequest = result.data.resource;

        let owner       = new Account(issueOrPullRequest.repository.owner.login);
        let repository  = new Repository(owner, issueOrPullRequest.repository.name);

        switch (issueOrPullRequest.__typename) {
          case 'Issue':
            return new Issue(repository, issueOrPullRequest.number, issueOrPullRequest.title);
          case 'PullRequest':
            return new PullRequest(repository, issueOrPullRequest.number, issueOrPullRequest.title);
        }
      } else {
        return {};
      }
    } else {
      return {};
    }
  }
}

if (typeof module !== 'undefined') { module.exports.Resource = Resource; }
