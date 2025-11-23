import { deepClone } from '@/utils/utils';
import logger from './logger';

/**
 * Singleton class used to stored cached items.
 * This is the preferred method over using context as adding/updating/removing cached items 
 * does not require a state update.
 * 
 * If there is a need to update state when a cached item has been updated, then create
 * a new context for that item and do not use this class.
 * 
 * This is great for storing cached API results but not user related data
 */
class Cache {
	static #instance;

	#cacheStorage 	= {};				// cache storage
	#DEFAULT_TTL 	= 3600000;			// time to live = 1 hour
	#MAX_CACHE_SIZE = 2 * 1024 * 1024 	// max cache size = 2MB

	/**
	 * Class constructor
	 */
	constructor() {
		// Prevent multiple instances
		if (Cache.#instance) {
			return Cache.#instance;
		}

		Cache.#instance = this;
	}

	/**
	 * 
	 * @returns {number} - the total size of cache
	 * @private
	 */
	#getCurrentCacheSize = () => {
		let size = 0;
		for (const key in this.#cacheStorage) {
			size += this.#cacheStorage[key].size;
		}
		return size;
	}

	/**
	 * 
	 * @param {object} cachedItem 
	 * @returns {boolean} - true if expired
	 * @private
	 */
	#isExpired = (cachedItem) => {
		return Date.now() > cachedItem.expiry;
	}

	/**
	 * Removes the oldest item from the cacheStorage
	 * @private
	 */
	#removeOldestItem = () => {
		let oldestKey = null;
		let oldestExpiry = Infinity;

		for (const key in this.#cacheStorage) {
			if (this.#cacheStorage[key].expiry < oldestExpiry) {
				oldestExpiry = this.#cacheStorage[key].expiry;
				oldestKey = key;
			}
		}
		if (oldestKey) {
			logger.log(`CACHE ${oldestKey} REDUCED`);
			delete this.#cacheStorage[oldestKey];
		}
	}

	/**
	 * Removes all items that have expired from the cacheStorage
	 * @private
	 */
	#clearOutdatedItems = () => {
		for (const key in this.#cacheStorage) {
			if (this.#isExpired(this.#cacheStorage[key])) {
				logger.log(`CACHE ${key} EXPIRED`);

				delete this.#cacheStorage[key];
			}
		}
	}

	/**
	 * Calculates the size of the specified value
	 * 
	 * @param {any} value 
	 * @returns {number} - size of the value
	 * @private
	 */
	#calculateSize = (value) => {
		try {
			const str = JSON.stringify(value);
			return new TextEncoder().encode(str).length;
		} catch (error) {
			logger.error('Error calculating size:', error);
			return 0;
		}
	}

	/**
	 * Returns the stored cached value
	 * 
	 * @param {string} key - identifier
	 * @returns {object} - the stored value for the key
	 */
	get = (key) => {
		const cachedItem = this.#cacheStorage[key];
		if (cachedItem) {
			if (this.#isExpired(cachedItem)) {
				delete this.#cacheStorage[key];
				return null;
			}

			try {
				// Return a deep clone to prevent mofidfying original
				return deepClone(cachedItem.value);
			} catch (error) {
				logger.error('Error cloning cached value:', error);
				return { ...cachedItem.value };
			}
		}
		return null;
	}

	/**
	 * 
	 * @returns {object} - the entire cacheStorage object
	 */
	getAll = () => {
		try {
			return deepClone(this.#cacheStorage);
		} catch (error) {
			logger.error('Error cloning cached value:', error);
			return { ...this.#cacheStorage };
		}
	}

	/**
	 * Adds the new item to cache
	 * 
	 * @param {string} key - identifier
	 * @param {any} value - value to store
	 * @param {number} ttl - time to live
	 */
	set = (key, value, ttl = this.#DEFAULT_TTL) => {
		logger.log(`CACHE ${key} ADDED`);

		// Remove outdated items before adding
		this.#clearOutdatedItems();

		const newItemSize = this.#calculateSize(value);

		// Check cache size and remove oldest if necessary
		while (this.#getCurrentCacheSize() + newItemSize > this.#MAX_CACHE_SIZE) {
			this.#removeOldestItem();
		}

		this.#cacheStorage[key] = { value, expiry: Date.now() + ttl, size: newItemSize };
	}

	/**
	 * Finds all objects where the key includes the prefix and deletes them
	 * before adding the new item to cache
	 * 
	 * @param {string} key - identifier
	 * @param {string} prefix - used to atch all keys that start with the prefix
	 * @param {any} value - the value to store
	 * @param {number} ttl - time to live
	 */
	replace = (key, prefix, value, ttl) => {
		// Deletes all items that key starts with the prefix
		if (prefix) {
			for (const cacheKey in this.#cacheStorage) {
				if (cacheKey.includes(prefix)) {
					logger.log(`CACHE ${cacheKey} REPLACE (REMOVED)`);

					delete this.#cacheStorage[cacheKey];
				}
			}
		} else {
			delete this.#cacheStorage[key];
		}
		this.set(key, value, ttl);
	}

	/**
	 * Updates the cached item if found otherwise adds it
	 * 
	 * @param {string} key - identifier
	 * @param {any} value - the updated value
	 * @param {number} ttl - the updated time to live
	 */
	update = (key, value, ttl) => {
		const cachedItem = this.#cacheStorage[key];
		if (cachedItem) {
			logger.log(`CACHE ${key} UPDATED`);

			const updatedValue = { ...cachedItem.value, ...value };
			const newItemSize = this.#calculateSize(updatedValue);

			// Check if the updated item exceeds the cache size
			while(this.#getCurrentCacheSize() - cachedItem.size + newItemSize > this.#MAX_CACHE_SIZE) {
				this.#removeOldestItem();
			}

			const newExpiry = ttl ? Date.now() + ttl : cachedItem.expiry;
			this.#cacheStorage[key] = { value: updatedValue, expiry: newExpiry, size: newItemSize };
		} else {
			this.set(key, value, ttl);
		}
	}

	/**
	 * Removes the item from cache, if found
	 * 
	 * @param {string} key - identifier
	 */
	remove = (key) => {
		logger.log(`CACHE ${key} REMOVED`);

		delete this.#cacheStorage[key];
	}

	/**
	 * Clears the cacheStorage
	 */
	clear = () => {
		for (const key in this.#cacheStorage) {
			delete this.#cacheStorage[key];
		}
	}

	/**
	 * Cleanup
	 */
	dispose() {
		this.clear();
		//Cache.#instance = null;
	}
}

const cache = new Cache();
Object.freeze(cache);

export default cache;