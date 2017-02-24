class GitHubLB {
  constructor() {
    this.defaultMenuItems = [
      {
        title: 'My Repositories',
        url: 'https://github.com/' + Action.preferences.viewerHandle,
        icon: 'repoTemplate.png',
      },
      {
        title: 'My Issues',
        url: 'https://github.com/issues',
        icon: 'issueTemplate.png',
      },
      {
        title: 'My Pull Requests',
        url: 'https://github.com/pulls',
        icon: 'pullRequestTemplate.png',
      },
      {
        title: 'My Gists',
        url: 'https://gist.github.com/',
        icon: 'gistTemplate.png',
      },
    ];
  }

  run(input, options) {
    if (input.length > 0) {
      let matchedDefaultMenuItems = this.matchingDefaultMenuItems(input);

      if (matchedDefaultMenuItems.length > 0) {
        return matchedDefaultMenuItems.concat(this.conflictingHandleMenuItem(input));
      } else {
        return this.displayMenuItemFor(input);
      }
    } else {
      return this.defaultMenuItems;
    }
  }

  matchingDefaultMenuItems(input) {
    return this.defaultMenuItems.filter(function(item) {
      let regex = new RegExp(input, 'i');
      return item.title.match(regex);
    });
  }

  conflictingHandleMenuItem(handle) {
    return [{
      title: '@' + handle,
      subtitle: 'Looking for the user @' + handle + '?',
      alwaysShowsSubtitle: true,
      icon: 'personTemplate.png',
      action: 'openAccountMenu',
      actionArgument: handle,
    }];
  }

  displayMenuItemFor(input) {
    const SET_TOKEN_FORMAT    = /^!([set\-token]*)(.*)$/;
    const GITHUB_LINK_FORMAT  = /^https?:\/\/((www|gist|raw)\.)?github\.(io|com)/;
    const ISSUE_OR_PR_FORMAT  = /^([^\/]+)\/([^\/#]+)(?:\/pull\/|\/issues\/|#)(\d+)$/;
    const REPOSITORY_FORMAT   = /^([^\/]+)\/([^\/#]+)?$/;
    const COMMIT_SHA_FORMAT   = /^\b[0-9a-f]{5,40}\b$/;
    const ACCOUNT_FORMAT      = /^(\w+)$/;

    let match;

    // Matching:
    // set-token <token>
    if (match = input.match(SET_TOKEN_FORMAT)) {
      if (match[1] === 'set-token' && (match[2] !== '' && match[2] !== ' ')) {
        return this.setToken(match[2].replace(/^\s+/, ''));
      } else {
        return [];
      }
    }

    // Matching:
    // https://github.com/bswinnerton/dotfiles/blob/master/ack/ackrc.symlink#L6
    if (input.match(GITHUB_LINK_FORMAT)) {
      return this.openLinkShortnerMenu(input);
    }

    // Matching:
    // rails/rails#123
    // rails/rails/issues/123
    // rails/rails/pull/123
    else if (match = input.match(ISSUE_OR_PR_FORMAT)) {
      let owner       = new Account(match[1]);
      let repository  = new Repository(owner, match[2]);
      let issue       = new Issue(repository, match[3]);
      return LaunchBar.openURL(issue.url);
    }

    // Matching:
    // rails/rails
    else if (match = input.match(REPOSITORY_FORMAT)) {
      let owner       = new Account(match[1]);
      let repository  = new Repository(owner, (match[2] || '<repo>'));
      return this.openRepositoryMenu(repository);
    }

    // Matching:
    // 911a93ac
    // 911a93ac26c4f5919d1ebdf67a9e3db31c5b9dce
    else if (match = input.match(COMMIT_SHA_FORMAT)) {
      let commit = new Commit(match[0]);
      return this.openCommitPullRequestsMenu(commit);
    }

    // Matching:
    // rails
    else if (match = input.match(ACCOUNT_FORMAT)) {
      let account = new Account(match[1]);
      return this.openAccountMenu(account);
    }

    // Matching everything else:
    // rails/rails/tree/master/Gemfile
    else {
      return LaunchBar.openURL('https://github.com/' + input);
    }
  }

  openLinkShortnerMenu(link, options) {
    if (LaunchBar.options.commandKey == 1) {
      this.shortenLink(link);
    } else {
      return [
        {
          title: 'Shorten link',
          icon: 'linkTemplate.png',
          action: 'shortenLink',
          actionArgument: link,
        },
      ];
    }
  }

  openRepositoryMenu(repository) {
    if (LaunchBar.options.commandKey == 1) {
      LaunchBar.openURL(repository.url);
    } else {
      return [
        {
          title: 'View Repository',
          subtitle: repository.nameWithOwner,
          alwaysShowsSubtitle: true,
          icon: 'repoTemplate.png',
          url: repository.url,
        },
        {
          title: 'View Issues',
          icon: 'issueTemplate.png',
          url: repository.issuesURL,
        },
        {
          title: 'View Pull Requests',
          icon: 'pullRequestTemplate.png',
          url: repository.pullRequestsURL,
        }
      ];
    }
  }

  openCommitPullRequestsMenu(commit) {
    let pullRequests = commit.pullRequests();

    if (pullRequests.length > 1) {
      return pullRequests.map(function(pr) { return pr.toMenuItem(); });
    } else if (pullRequests.length === 1) {
      LaunchBar.openURL(pullRequests[0].url);
    } else {
      LaunchBar.openURL('https://github.com/search?q=' + commit.sha +'&type=Commits&utf8=%E2%9C%93');
    }

    //LaunchBar.executeAppleScript('tell application "LaunchBar" to hide');
  }

  openAccountMenu(account) {
    if (LaunchBar.options.commandKey == 1) {
      LaunchBar.openURL(account.profileURL);
    } else {
      return [
        {
          title: 'View Profile',
          subtitle: account.handle,
          alwaysShowsSubtitle: true,
          icon: 'personTemplate.png',
          url: account.profileURL,
        },
        {
          title: 'View Repositories',
          icon: 'repoTemplate.png',
          action: 'openAccountRepositories',
          actionArgument: account.login,
          actionReturnsItems: true,
        },
        {
          title: 'View Issues',
          icon: 'issueTemplate.png',
          url: account.issuesURL,
        },
        {
          title: 'View Pull Requests',
          icon: 'pullRequestTemplate.png',
          url: account.pullRequestsURL,
        },
        {
          title: 'View Gists',
          icon: 'gistTemplate.png',
          url: account.gistsURL,
        }
      ];
    }
  }

  openAccountRepositoriesMenu(login) {
    let account = new Account(login);

    if (LaunchBar.options.commandKey == 1) {
      LaunchBar.openURL(account.repositoriesURL);
    } else {
      return [
        {
          title: 'View All Repositories',
          icon: 'reposTemplate.png',
          url: account.repositoriesURL,
        }
      ].concat(account.repositories().map(function(repository) {
        return repository.toMenuItem();
      }));
    }
  }

  shortenLink(link) {
    let linkShortener = new LinkShortener(link);
    let shortLink     = linkShortener.run();

    LaunchBar.setClipboardString(shortLink);
    LaunchBar.displayNotification({
      title: 'Copied ' + shortLink + ' to your clipboard',
    });

    LaunchBar.executeAppleScript('tell application "LaunchBar" to hide');
  }

  setToken(token) {
    Action.preferences.token = token;

    let results = GraphQL.execute(`query { viewer { login } }`);

    if (results.data) {
      let handle = results.data.viewer.login;

      Action.preferences.viewerHandle = handle;

      LaunchBar.displayNotification({
        title: '👋 Hi @' + handle,
        string: 'Your access token was set successfully.',
      });

      //LaunchBar.executeAppleScript('tell application "LaunchBar" to hide');
    } else {
      LaunchBar.displayNotification({
        title: 'That looks like an invalid token',
        string: 'Please try again.',
      });
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
  return app.openAccountRepositoriesMenu(string);
}

function openAccountMenu(string) {
  return app.openAccountMenu(string);
}

function shortenLink(link, details) {
  return app.shortenLink(link);
}
