const StaticCache = require('./cache-static');
const LRUCache = require('./cache-lru');
const PersistedCache = require('./cache-persist');
const commons = require('happn-commons');
module.exports = class CacheService extends require('events').EventEmitter {
  #caches;
  #config;
  constructor(opts) {
    super();
    this.initialize = commons.utils.maybePromisify(this.initialize);
    this.stop = commons.utils.maybePromisify(this.stop);
    let Logger;

    if (opts && opts.logger) {
      Logger = opts.logger.createLogger('Cache');
    } else {
      Logger = require('happn-logger');
      Logger.configure({
        logLevel: 'info',
      });
    }

    this.log = Logger.createLogger('Cache');
    this.log.$$TRACE('construct(%j)', opts);

    this.#caches = {};
  }

  initialize(config, callback) {
    try {
      if (typeof config === 'function') {
        callback = config;
        config = {};
      }

      if (!config) config = {};
      if (!config.defaultTTL) config.defaultTTL = 0; //one minute
      if (!config.defaultCacheName) config.defaultCacheName = 'default'; //one minute

      if (!config.defaultCacheOpts) {
        config.defaultCacheOpts = {
          type: 'static',
          cache: {},
        };
      }

      this.#config = config;
      this.#caches = {};
      callback();
    } catch (e) {
      callback(e);
    }
  }

  create(name, opts) {
    opts = opts || this.#config.defaultCacheOpts;
    opts.cache = opts.cache || {};
    opts.type = opts.type || commons.constants.CACHE_TYPES.STATIC;
    if (this.#caches[name] && !opts.overwrite) {
      throw new Error('a cache by this name already exists');
    }
    const type = opts.type.toLowerCase();
    if (Object.values(commons.constants.CACHE_TYPES).indexOf(type) === -1) {
      throw new Error(`unknown cache type: ${type}`);
    }

    this.#caches[name] = { type };
    let instance;

    if (type === commons.constants.CACHE_TYPES.LRU) {
      instance = new LRUCache(name, opts.cache);
    } else if (type === commons.constants.CACHE_TYPES.PERSIST) {
      opts.cache.key_prefix = name;
      instance = new PersistedCache(name, opts.cache);
    } else {
      instance = new StaticCache(name, opts.cache);
    }
    this.#caches[name] = { type, instance };
    Object.defineProperty(this.#caches[name], 'utilities', {
      value: this.happn.services.utils,
    });
    return this.#caches[name].instance;
  }

  async clearAll(deleteOnClear) {
    for (const name of Object.keys(this.#caches)) {
      await this.clear(name, deleteOnClear);
    }
  }

  async clear(name, deleteOnClear = false) {
    let found = this.#caches[name];
    if (!found) return;
    await found.instance.clear();
    this.emit('cache-cleared', name);
    if (deleteOnClear) {
      // dont clear again, so clearOnDelete false
      this.delete(name, false);
    }
  }

  delete(name, clearOnDelete = true) {
    const toDelete = this.#caches[name];
    if (!toDelete) return;
    delete this.#caches[name];
    if (clearOnDelete) {
      toDelete.clear();
    }
    this.emit('cache-deleted', name);
  }

  stopAll() {
    Object.values(this.#caches).forEach((cache) => cache.instance.stop());
  }

  stop(options, callback) {
    if (typeof options === 'function') {
      callback = options;
    }
    this.stopAll();
    if (typeof callback === 'function') {
      callback();
    }
  }

  getStats() {
    return Object.values(this.#caches).reduce((stats, cache) => {
      const cacheStats = commons._.merge(cache.instance.stats(), { type: cache.type });
      stats[cache.instance.name] = cacheStats;
      return stats;
    }, {});
  }

  getCache(name) {
    return this.#caches[name];
  }

  getOrCreate(name, opts) {
    const found = this.getCache(name);
    if (found) return found.instance;
    return this.create(name, opts);
  }
};
