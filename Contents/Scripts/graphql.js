let GraphQL = {};

GraphQL.execute = function(query, variables) {
  if (!Action.preferences.token) {
    LaunchBar.alert("It looks like this is the first time you're using " +
      "this action.\n\nPlease go to https://github.com/settings/tokens " +
      "and create token with 'repo' and 'user' scope and set it by invoking " +
      "the github action and going to settings.");
  }

  let requestHeaders = {
    'Authorization':  'token ' + Action.preferences.token,
    'User-Agent':     'github-launchbar-v' + Action.version,
  };

  let requestBody     = { query: query, variables: variables };

  let result = HTTP.post('https://api.github.com/graphql', {
    headerFields: requestHeaders,
    body: JSON.stringify(requestBody)
  });

  LaunchBar.debugLog('action=launchbar-github request=' + JSON.stringify(requestBody));
  LaunchBar.debugLog('action=launchbar-github response=' + JSON.stringify(result));

  if (result.data) {
    let body = JSON.parse(result.data);

    if (body.data) {
      return body;
    } else {
      if (body.message) {
        LaunchBar.displayNotification({
          title: "Couldn't access the GitHub API",
          string: body.message,
        });
      } else {
        LaunchBar.displayNotification({title: "Couldn't access the GitHub API"});
      }
      return [];
    }
  }
};

if (typeof module !== 'undefined') { module.exports.GraphQL = GraphQL; }
