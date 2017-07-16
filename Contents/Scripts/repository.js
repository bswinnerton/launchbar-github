class Repository {
  constructor(owner, name, description, parent) {
    this.owner = owner;
    this.name = name;
    this.description = description;
    this.parent = parent;
  }

  get nameWithOwner() {
    return this.owner.login + '/' + this.name;
  }

  get url() {
    return 'https://github.com/' + this.nameWithOwner;
  }

  get issuesURL() {
    return this.url + '/issues';
  }

  get pullRequestsURL() {
    return this.url + '/pulls';
  }

  get isFork() {
    if (this.parent) {
      return true;
    } else {
      return false;
    }
  }

  get icon() {
    if (this.isFork) {
      return 'forkTemplate.png';
    } else {
      return 'repoTemplate.png';
    }
  }

  toMenuItem() {
    let menuItem = {
      title: this.nameWithOwner,
      url: this.url,
      icon: this.icon,
    };

    if (this.description) {
      menuItem.subtitle = this.description;
      menuItem.alwaysShowsSubtitle = true;
    }

    return menuItem;
  }

  pullRequests() {
    let cacheKey = 'repository-pull-requests-for-' + this.owner.login + '-' + this.name;

    let pullRequestEdges = Cache.fetch(cacheKey, 3600, () => {
      const query = `
        query($owner: String!, $name: String!) {
          repository(owner: $owner, name: $name) {
            pullRequests(first: 100, states: [OPEN], orderBy: {field: UPDATED_AT, direction: DESC}) {
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

      let variables = {
        owner: this.owner.login,
        name: this.name,
      };

      let result = GraphQL.execute(query, variables);

      if (result) {
        return result.data.repository.pullRequests.edges;
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
}

if (typeof module !== 'undefined') { module.exports.Repository = Repository; }
