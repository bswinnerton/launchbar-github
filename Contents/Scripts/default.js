let module = {exports: {}};

include('account.js');
include('issue.js');
include('link-shortener.js');
include('repository.js');

class GitHubLB {
  run(input, options) {
    const GITHUB_LINK_FORMAT  = /^https?:\/\/((www|gist|raw)\.)?github\.(io|com)/;
    const SET_TOKEN_FORMAT    = /^!set-token (.*)$/;
    const ISSUE_OR_PR_FORMAT  = /^([^\/]+)\/([^\/#]+)(?:\/pull\/|\/issues\/|#)(\d+)$/;
    const REPOSITORY_FORMAT   = /^([^\/]+)\/([^\/#]+)$/;
    const ACCOUNT_FORMAT      = /^(\w+)$/;

    let match;

    // Matching:
    // https://github.com/bswinnerton/dotfiles/blob/master/ack/ackrc.symlink#L6
    if (input.match(GITHUB_LINK_FORMAT)) {
      return this.openLinkShortner(input);
    }

    // Matching:
    // set-token <token>
    if (match = input.match(SET_TOKEN_FORMAT)) {
      return this.setToken(match[1]);
    }

    // Matching:
    // rails/rails#123
    // rails/rails/issues/123
    // rails/rails/pull/123
    else if (match = input.match(ISSUE_OR_PR_FORMAT)) {
      let owner       = new Account(match[1]);
      let repository  = new Repository(owner, match[2]);
      let issue       = new Issue(repository, match[3]);
      return this.openIssue(issue);
    }

    // Matching:
    // rails/rails
    else if (match = input.match(REPOSITORY_FORMAT)) {
      let owner       = new Account(match[1]);
      let repository  = new Repository(owner, match[2]);
      return this.openRepository(repository);
    }

    // Matching:
    // rails
    else if (match = input.match(ACCOUNT_FORMAT)) {
      let account = new Account(match[1]);
      return this.openAccount(account);
    }

    // Matching everything else:
    // rails/rails/tree/master/Gemfile
    else {
      LaunchBar.openURL('https://github.com/' + input);
    }
  }

  openLinkShortner(link, options) {
    return [
      {
        title: 'Shorten link',
        icon: 'link.png',
        action: 'shortenLink',
        actionArgument: link,
      },
    ];
  }

  shortenLink(link) {
    let linkShortener = new LinkShortner(link);
    let shortLink     = linkShortener.run();

    LaunchBar.setClipboardString(shortLink);
    LaunchBar.displayNotification({
      title: 'Copied ' + shortLink + ' to your clipboard',
    });
  }

  setToken(token) {
    Action.preferences.token = token;
    LaunchBar.displayNotification({
      title: 'GitHub access token set successfully',
    });
  }

  openIssue(issue) {
    LaunchBar.openURL(issue.url);
  }

  openRepository(repository) {
    if (LaunchBar.options.commandKey == 1) {
      LaunchBar.openURL(repository.url);
    } else {
      return [
        {
          title: 'View Repository',
          subtitle: repository.nameWithOwner,
          alwaysShowsSubtitle: true,
          icon: 'repo.png',
          url: repository.url,
        },
        {
          title: 'View Issues',
          icon: 'issue.png',
          url: repository.issuesURL,
        },
        {
          title: 'View Pull Requests',
          icon: 'pull-request.png',
          url: repository.pullRequestsURL,
        }
      ];
    }
  }

  openAccount(account) {
    if (LaunchBar.options.commandKey == 1) {
      LaunchBar.openURL(account.profileURL);
    } else {
      return [
        {
          title: 'View Profile',
          subtitle: account.handle,
          alwaysShowsSubtitle: true,
          icon: 'person.png',
          url: account.profileURL,
        },
        {
          title: 'View Repositories',
          icon: 'repo.png',
          action: 'openAccountRepositories',
          actionArgument: account.login,
          actionReturnsItems: true,
        },
        {
          title: 'View Issues',
          icon: 'issue.png',
          url: account.issuesURL,
        },
        {
          title: 'View Pull Requests',
          icon: 'pull-request.png',
          url: account.pullRequestsURL,
        },
        {
          title: 'View Gists',
          icon: 'gist.png',
          url: account.gistsURL,
        }
      ];
    }
  }

  openAccountRepositories(login) {
    let account = new Account(login);

    if (LaunchBar.options.commandKey == 1) {
      LaunchBar.openURL(account.repositoriesURL);
    } else {
      return [
        {
          title: 'View All Repositories',
          icon: 'repos.png',
          url: account.repositoriesURL,
        }
      ].concat(account.repositories().map(function(repository) {
        return repository.toMenuItem();
      }));
    }
  }
}

let app = new GitHubLB();

function run(argument) {
  return app.run(argument);
}

function runWithString(string) {
  return app.run(string);
}

function runWithURL(url, details) {
  return app.run(url, details);
}

// Unfortunately when the script output uses an action argument (like
// openAccount does), it needs to be able to find the function from the global
// scope. The following functions are workarounds to the appropriate actions.
//
// https://developer.obdev.at/launchbar-developer-documentation/#/script-output.
function openAccountRepositories(string) {
  return app.openAccountRepositories(string);
}

function shortenLink(link, details) {
  return app.shortenLink(link);
}
