// LaunchBar Action Script

// FIXME: Instead of having global state, it'd be better to maintain a cache
var repositoryMenuItems = [];

function run(argument) {
  runWithString(argument);
}

function runWithString(string) {
  if (match = string.match(/^!set-token (.*)$/)) {
    return setToken(match[1])
  }

  // Matching:
  // rails/rails#123
  // rails/rails/issues/123
  // rails/rails/pull/123
  else if (match = string.match(/^([^\/]+\/[^\/#]+)(?:\/pull\/|\/issues\/|#)(\d+)$/)) {
    var nwo     = match[1],
        number  = match[2];

    return openIssue(nwo, number);
  }

  // Matching:
  // rails/rails
  else if (match = string.match(/^^([^\/]+)\/([^\/#]+)$/)) {
    var owner = match[1],
        name  = match[2];

    return openRepository(name, owner);
  }

  // Matching:
  // rails
  else {
    return openUser(string);
  }
}

function setToken(token) {
  Action.preferences.token = token;
  LaunchBar.displayNotification({
    title: 'GitHub access token set successfully'
  });
}

function openIssue(nameWithOwner, number) {
  LaunchBar.openURL('https://github.com/' + nameWithOwner + '/issues/' + number);
}

function openRepository(name, owner) {
  return [
    {
      title: 'View Repository',
      subtitle: '@' + owner + '/' + name,
      alwaysShowsSubtitle: true,
      icon: 'repo.png',
      url: 'https://github.com/' + owner + '/' + name
    },
    {
      title: 'View Issues',
      icon: 'issue.png',
      url: 'https://github.com/' + owner + '/' + name + '/issues/'
    },
    {
      title: 'View Pull Requests',
      icon: 'pull-request.png',
      url: 'https://github.com/' + owner + '/' + name + '/pulls/'
    }
  ]
}

function openUser(user) {
  return [
    {
      title: 'View Profile',
      subtitle: '@' + user,
      alwaysShowsSubtitle: true,
      icon: 'person.png',
      url: 'https://github.com/' + user
    },
    {
      title: 'View Repositories',
      icon: 'repo.png',
      action: 'openUserRepositories',
      actionArgument: user,
      actionReturnsItems: true
    },
    {
      title: 'View Issues',
      icon: 'issue.png',
      url: 'https://github.com/search?utf8=%E2%9C%93&q=author%3A' + user + '+is%3Aissue&ref=simplesearch'
    },
    {
      title: 'View Pull Requests',
      icon: 'pull-request.png',
      url: 'https://github.com/search?utf8=%E2%9C%93&q=author%3A' + user + '+is%3Apr&ref=simplesearch'
    }
  ]
}


function openUserRepositories(user) {
  return [
    {
      title: 'View All Repositories',
      icon: 'repos.png',
      url: 'https://github.com/' + user + '?tab=repositories'
    }
  ].concat(fetchRepositories(user))
}

function fetchRepositories(user, cursor) {
  var query, variables, result, lastCursor, menuItems;

  query = `
    query($login: String!, $cursor: String) {
      repositoryOwner(login: $login) {
        repositories(first: 30, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            cursor
            node {
              owner { login }
              name
              description
              url
            }
          }
        }
      }
    }
  `;

  variables = {
    login: user,
    cursor: cursor || null
  };

  result = executeQuery(query, variables);
  repositoryEdges = result.data.repositoryOwner.repositories.edges;

  menuItems = repositoryEdges.map(repositoryMenuItemFromEdge);

  repositoryMenuItems = repositoryMenuItems.concat(menuItems);

  while (repositoryEdges.length == 30) {
    lastCusor = repositoryEdges[repositoryEdges.length - 1].cursor;
    fetchRepositories(user, lastCusor);
  }

  return repositoryMenuItems
}

function repositoryMenuItemFromEdge(edge) {
  var menuItem = {
    title: edge.node.owner.login + '/' + edge.node.name,
    url: edge.node.url,
    icon: 'repo.png',
  };

  if (edge.node.description) {
    menuItem.subtitle = edge.node.description;
    menuItem.alwaysShowsSubtitle = true;
  }

  return menuItem
}

function executeQuery(query, variables) {
  if (!Action.preferences.token) {
    LaunchBar.openURL('https://github.com/prerelease/agreement');
    LaunchBar.openURL('https://github.com/settings/tokens');
    LaunchBar.alert("It looks like this is the first time you're using this " +
      "action.\n\nPlease go to https://github.com/prerelease/agreement and " +
      "accept the agreement.\n\nOnce signed, go to " +
      "https://github.com/settings/tokens and create token with 'repo' scope " +
      "and set it by invoking this action and typing !set-token <token>");
    return
  }

  result = HTTP.post('https://api.github.com/graphql', {
    headerFields: { authorization: 'token ' + Action.preferences.token },
    body: JSON.stringify({ query: query, variables: variables })
  });

  return JSON.parse(result.data);
}
