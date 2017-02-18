// LaunchBar Action Script

function run(argument) {
  runWithString(argument);
}

function runWithString(string) {
  // Matching:
  // rails/rails#123
  // rails/rails/issues/123
  // rails/rails/pull/123
  if (match = string.match(/^([^\/]+\/[^\/#]+)(?:\/pull\/|\/issues\/|#)(\d+)$/)) {
    var nwo     = match[1],
        number  = match[2];

    return openIssue(nwo, number);

  // Matching:
  // rails/rails
  } else if (match = string.match(/^^([^\/]+)\/([^\/#]+)$/)) {
    var name  = match[1],
        owner = match[2];

    return openRepository(name, owner);

  // Matching:
  // rails
  } else {
    return openUser(string);
  }
}

function openIssue(nameWithOwner, number) {
  LaunchBar.openURL('https://github.com/' + nameWithOwner + '/issues/' + number);
}

function openRepository(name, owner) {
  return [
    {
      title: 'View Issues',
      icon: 'issue.png',
      url: 'https://github.com/' + owner + '/' + name + '/issues/',
    },
    {
      title: 'View Pull Requests',
      icon: 'pull-request.png',
      url: 'https://github.com/' + owner + '/' + name + '/pulls/',
    }
  ]
}

function openUser(user) {
  return [
    {
      title: 'View Profile',
      icon: 'person.png',
      url: 'https://github.com/' + user
    },
    {
      title: 'View Repositories',
      icon: 'repo.png',
      url: 'https://github.com/' + user + '?tab=repositories'
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
