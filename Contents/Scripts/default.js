// LaunchBar Action Script

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
      children: [{
        title: 'View All Repositories',
        icon: 'repos.png',
        url: 'https://github.com/' + user + '?tab=repositories'
      }].concat(fetchRepositories(user))
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

function fetchRepositories(user) {
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
    headerFields: {
      authorization: 'token ' + Action.preferences.token
    },
    body: JSON.stringify({
      query: `
        query($login:String!) {
          repositoryOwner(login:$login) {
            repositories(last:30,orderBy:{field:CREATED_AT,direction:DESC}) {
              edges {
                node {
                  name
                  description
                  url
                }
              }
            }
          }
        }
      `,
      variables: {
        login: user
      }
    })
  });

  parsedResult = JSON.parse(result.data);
  repoEdges = parsedResult.data.repositoryOwner.repositories.edges;

  return repoEdges.map(function(edge) {
    var repository = {
      title: user + '/' + edge.node.name,
      url: edge.node.url,
      icon: 'repo.png',
    }

    if (edge.node.description) {
      repository.subtitle = edge.node.description
      repository.alwaysShowsSubtitle = true
    }

    return repository
  })
}
