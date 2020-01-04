const { isType } = require('../lib/util');

class RegularCache {
  constructor(size) {
    this.data = new Map();
    this.dataSize = size;
  }

  /**
   * Set the regularly cleaned cache
   * @param {any} key The key of cache
   * @param {any} value The value of cache
   * @param {number} minute Set the time for clear up
   * @param {string} [mode='replace'] Added mode
   * @memberof RegularCache
   */
  set(key, value, minute, mode = 'replace') {
    if (!key) {
      return;
    } else if (this.data.size > this.dataSize) {
      this.clear();
      return;
    } else if (!this.data.has(key) || mode == 'replace') {
      this.data.set(key, value)
    } else if (mode == 'add') {
      if (isType(value) == 'Object') {
        // Get the old value
        let oldValue = this.data.get(key);
        // merge the new value
        Object.assign(oldValue, value);
        this.data.set(key, oldValue);
      } else if (isType(value) == 'Array') {
        // Get the old value
        let oldValue = this.data.get(key);
        // push new value
        oldValue.push(value);
        this.data.set(key, oldValue);
      } else return;
    } else return;
    setTimeout(() => {
      this.delete(key);
    }, 60 * 1000 * minute);
  }

  /**
   * Check if the key has in the cache
   * @param {any} key
   * @returns {boolean}
   * @memberof RegularCache
   */
  has(key) {
    return this.data.has(key);
  }

  /**
   * Get the value
   * @param {any} key
   * @returns {any} value
   * @memberof RegularCache
   */
  get(key) {
    return this.data.get(key);
  }

  /**
   * Get the value and delete it
   * @param {any} key
   * @returns {any} value
   * @memberof RegularCache
   */
  getAndDel(key) {
    const value = this.data.get(key);
    this.delete(key);
    return value;
  }

  /**
   * Delete the value
   * @param {any} key
   * @memberof RegularCache
   */
  delete(key) {
    this.data.delete(key);
  }

  /**
   * Clear cache
   * @memberof RegularCache
   */
  clear() {
    this.data.clear();
  }
}

/* Set maximum cache length */
const regularCache = new RegularCache(100000);

/* define express middleware */
function cache(req, res, next) {
  req.cache = regularCache;
  next();
}

module.exports = cache;
