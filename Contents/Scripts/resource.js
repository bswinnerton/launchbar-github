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
              ...RepositoryData
            }
          }

          ... on PullRequest {
            title
            number
            repository {
              ...RepositoryData
            }
          }

          ... on TeamDiscussion {
            title
            url
          }
        }
      }

      fragment RepositoryData on Repository {
        name
        owner {
          login
        }
      }
    `;

    let variables = { url: this.url };
    let headers   = {"Accept": "application/vnd.github.echo-preview+json"};
    let result    = GraphQL.execute(query, variables, headers);

    if (result) {
      if (result.data && result.data.resource) {
        let resource = result.data.resource;
        let owner, repository;

        switch (resource.__typename) {
          case 'Issue':
            owner       = new Account(resource.repository.owner.login);
            repository  = new Repository(owner, resource.repository.name);
            return new Issue(repository, resource.number, resource.title, this.url);
          case 'PullRequest':
            owner       = new Account(resource.repository.owner.login);
            repository  = new Repository(owner, resource.repository.name);
            return new PullRequest(repository, resource.number, resource.title, this.url);
          case 'TeamDiscussion':
            return resource;
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
