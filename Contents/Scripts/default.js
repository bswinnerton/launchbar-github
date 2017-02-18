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

    openIssue(nwo, number)
  } else {
    openUser(string);
  }
}

function openIssue(nameWithOwner, number) {
  LaunchBar.openURL('https://github.com/' + nameWithOwner + '/issues/' + number);
}

function openUser(user) {
  LaunchBar.openURL('https://github.com/' + user);
}
