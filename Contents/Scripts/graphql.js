let GraphQL = {};

GraphQL.execute = function(query, variables) {
  if (!Action.preferences.token) {
    LaunchBar.openURL('https://github.com/settings/tokens');
    LaunchBar.alert("It looks like this is the first time you're using " +
      "this action.\n\nPlease go to https://github.com/settings/tokens " +
      "and create token with 'repo' and 'user' scope and set it by invoking " +
      "the github action and going to settings.");
    return;
  }

  let requestBody = { query: query, variables: variables };

  if (GraphQL._requestIsLocked(requestBody)) {
    LaunchBar.alert('request is locked, aborting');
    return;
  } else {
    GraphQL._createRequestLock(requestBody);

    let result = HTTP.post('https://api.github.com/graphql', {
      headerFields: { authorization: 'token ' + Action.preferences.token },
      body: JSON.stringify(requestBody)
    });

    LaunchBar.debugLog(JSON.stringify(result));

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

    GraphQL._deleteRequestLock(requestBody);
  }
};

GraphQL._requestIsLocked = function(body) {
  let requestLocksFile = Action.supportPath + '/request-locks.json';

  if (!File.exists(requestLocksFile)) {
    LaunchBar.alert("locks file doesn't exist, creating");
    File.writeJSON({}, requestLocksFile);
  }

  if (body in File.readJSON(requestLocksFile)) {
    LaunchBar.alert("request is locked");
    return true;
  } else {
    LaunchBar.alert("request is not locked");
    return false;
  }
};

GraphQL._createRequestLock = function(body) {
  let requestLocksFile  = Action.supportPath + '/request-locks.json';
  let requestLocks      = File.readJSON(requestLocksFile);
  let request           = JSON.stringify(body);

  LaunchBar.alert("creating request lock for: " + body);
  requestLocks[request] = true;
  File.writeJSON(requestLocks, requestLocksFile);
};

GraphQL._deleteRequestLock = function(body) {
  let requestLocksFile  = Action.supportPath + '/request-locks.json';
  let requestLocks      = File.readJSON(requestLocksFile);
  let request           = JSON.stringify(body);

  LaunchBar.alert("deleting request lock for: " + body);
  delete requestLocks[request];
  File.writeJSON(requestLocks, requestLocksFile);
};

if (typeof module !== 'undefined') { module.exports.GraphQL = GraphQL; }
