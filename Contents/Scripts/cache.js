class Cache {
  fetch(key, ttl, func) {
    let results = this.read(key);

    if (results) {
      return results;
    } else {
      return this.write(key, ttl, func);
    }
  }

  read(key) {
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

  write(key, ttl, func) {
    let path      = this._path(key);
    let expiresAt = this._currentTime() + ttl;
    let results   = func();
    let cacheData = { expiresAt: expiresAt, results: results };

    File.writeJSON(cacheData, path, {'prettyPrint' : Action.debugLogEnabled});

    return results;
  }

  _currentTime() {
    return Math.floor(new Date() / 1000);
  }

  _path(key) {
    return Action.cachePath + '/' + 'v1-' + key + '.json';
  }
}
