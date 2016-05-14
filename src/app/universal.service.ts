

export class Service {
  _cache: any = {};
  set(prop, value) {
    this._cache[prop] = value;
  }
  get(prop) {
    return this._cache[prop];
  }
  asyncPrefetch() {
    return new Promise(resolve => {
      setTimeout(() => {
        this._cache.prefetch = true;
        resolve();
      }, 1000);
    });
  }
}
