class Organization {
  constructor(login) {
    this.login = login;
  }

  get url() {
    return 'https://github.com/orgs/' + this.login;
  }

  get projectsURL() {
    return 'https://github.com/orgs/' + this.login + '/projects?fullscreen=true';
  }

  projects() {
    let cacheKey = 'organization-projects-for-' + this.login;

    let projectEdges = Cache.fetch(cacheKey, 3600, () => {
      return this._fetchProjects();
    });

    return projectEdges.map(function(edge) {
      let project = edge.node;
      let name    = project.name;
      let number  = project.number;
      let body    = project.body;
      let url     = project.url;

      return new Project(this, name, number, body, url);
    });
  }

  _fetchProjects(cursor, allEdges) {
    allEdges = allEdges || [];

    const query = `
      query($login: String!, $cursor: String) {
        organization(login: $login) {
          projects(first: 100, after: $cursor, orderBy: {field:CREATED_AT, direction:DESC}) {
            edges {
              cursor
              node {
                name
                number
                body
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
      if (result.data && result.data.organization) {
        let projectEdges = result.data.organization.projects.edges;

        if (projectEdges.length > 0) {
          allEdges = allEdges.concat(projectEdges);

          let lastEdge = projectEdges[projectEdges.length - 1];
          return this._fetchProjects(lastEdge.cursor, allEdges);
        }
      } else {
        return [];
      }
    } else {
      return [];
    }

    return allEdges;
  }
}

if (typeof module !== 'undefined') { module.exports.Organization = Organization; }
