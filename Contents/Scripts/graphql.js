let GraphQL = {};

GraphQL.execute = function(query, variables) {
  if (!Action.preferences.token) {
    LaunchBar.openURL('https://github.com/settings/tokens');
    LaunchBar.alert("It looks like this is the first time you're using " +
      "this action.\n\nPlease go to https://github.com/settings/tokens " +
      "and create token with 'repo' scope and set it by invoking the " +
      "github action and typing !set-token <token>");
    return;
  }

  let result = HTTP.post('https://api.github.com/graphql', {
    headerFields: { authorization: 'token ' + Action.preferences.token },
    body: JSON.stringify({ query: query, variables: variables })
  });

  LaunchBar.debugLog(JSON.stringify(result));

  if (result.data) {
    return JSON.parse(result.data);
  }
}
