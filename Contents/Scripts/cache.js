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
      LaunchBar.debugLog('action=launchbar-github cache=hit cachePath=' + path);
      return cacheData.results;
    } else {
      LaunchBar.debugLog('action=launchbar-github cache=stale expiresAt=' + cacheData.expiresAt + ' currentTime=' + currentTime);
      return false;
    }
  } else {
    LaunchBar.debugLog('action=launchbar-github cache=miss');
    return false;
  }
};

Cache.write = function(key, ttl, func) {
  let path        = Cache.filePath(key);
  let currentTime = Math.floor(new Date() / 1000);
  let expiresAt   = currentTime + ttl;
  let results     = func();

  function writeFile() {
    let cacheData = { expiresAt: expiresAt, results: results };
    File.writeJSON(cacheData, path, {'prettyPrint' : Action.debugLogEnabled});
  }

  // Only write to the file if the array or object is not empty
  if (results instanceof Array && results.length > 0) {
    writeFile.call(this);
  } else if (Object.keys(results).length > 0 && results.constructor === Object) {
    writeFile.call(this);
  }

  return results;
};

Cache.filePath = function(key) {
  return Action.cachePath + '/' + Action.version + '-' + key + '.json';
};

if (typeof module !== 'undefined') { module.exports.Cache = Cache; }
