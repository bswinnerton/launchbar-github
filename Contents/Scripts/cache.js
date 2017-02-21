const Cache = {};

Cache.fetch = function(key, ttl, func) {
  let results = this.read(key);

  if (results) {
    return results;
  } else {
    return this.write(key, ttl, func);
  }
}

Cache.read = function(key) {
  let path = this._path(key);

  if (File.exists(path)) {
    let cacheData   = File.readJSON(path);
    let currentTime = this._currentTime();

    if (currentTime < cacheData.expiresAt) {
      LaunchBar.debugLog('Cache hit: ' + path);
      return cacheData.results;
    } else {
      LaunchBar.debugLog('Cache stale: expiresAt=' + cacheData.expiresAt + ' currentTime=' + currentTime);
      return false;
    }
  } else {
    LaunchBar.debugLog('Cache miss');
    return false;
  }
}

Cache.write = function(key, ttl, func) {
  let path      = this._path(key);
  let expiresAt = this._currentTime() + ttl;
  let results   = func();
  let cacheData = { expiresAt: expiresAt, results: results };

  File.writeJSON(cacheData, path, {'prettyPrint' : Action.debugLogEnabled});

  return results;
}

Cache._currentTime = function() {
  return Math.floor(new Date() / 1000);
}

Cache._path = function(key) {
  return Action.cachePath + '/' + 'v1-' + key + '.json';
}
