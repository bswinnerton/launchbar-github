class Cache {}

Cache.fetch = function(key, ttl, func) {
  let results = Cache.read(key);

  if (results) {
    return results;
  } else {
    return Cache.write(key, ttl, func);
  }
};

Cache.read = function(key) {
  let path = Cache.filePath(key);

  if (File.exists(path)) {
    let cacheData   = File.readJSON(path);
    let currentTime = Math.floor(new Date() / 1000);

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
};

Cache.write = function(key, ttl, func) {
  let path        = Cache.filePath(key);
  let currentTime = Math.floor(new Date() / 1000);
  let expiresAt   = currentTime + ttl;
  let results     = func();

  if (results.length > 0) {
    let cacheData = { expiresAt: expiresAt, results: results };
    File.writeJSON(cacheData, path, {'prettyPrint' : Action.debugLogEnabled});
  }

  return results;
};

Cache.filePath = function(key) {
  return Action.cachePath + '/' + 'v1-' + key + '.json';
};

if (typeof module !== 'undefined') { module.exports.Cache = Cache; }
