import logger from './logger';

/**
 * A utility class for interacting with web storage (localStorage or sessionStorage).
 */
class Storage {
	/**
	 * Creates an instance of Storage.
	 * 
	 * @param {string} [storageType='local'] - The type of storage to use ('local' or 'session').
	 */
	constructor(storageType = 'local') {
		// Determine which storage to use based on the input parameter
		this.switchStorageType(storageType);
	}

	/**
	 * Retrieves an item from the storage.
	 * 
	 * @param {string} key - The key of the item to retrieve.
     * @returns {any} The parsed value from the storage, or null if not found or parsing fails.
	 */
	getItem(key) {
		// Get the JSON string from storage and parse it back to its original form
		try {
			const value = this.storage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			logger.error(`Error parsing JSON from storage for key "${key}":`, error);
            return null;
		}
	}

	/**
	 * Stores an item in the storage.
	 * 
	 * @param {string} key - The key of the item to store.
     * @param {any} value - The value to store.
	 */
	setItem(key, value) {
		// Convert the value to a JSON string and store it
        try {
            this.storage.setItem(key, JSON.stringify(value));
        } catch (error) {
            logger.error(`Error setting item in storage for key "${key}":`, error);
        }
	}

	/**
	 * Removes an item from the storage.
	 * 
	 * @param {string} key - The key of the item to remove.
	 */
	removeItem(key) {
		this.storage.removeItem(key);
	}

	/**
	 * Clears all items from the storage.
	 */
	clear() {
		this.storage.clear();
	}

	/**
     * Returns all of the keys for all items stored.
     * 
     * @returns {string[]} An array of all keys in the storage.
     */
	keys() {
		return Object.keys(this.storage);
	}

	/**
	 * Switches the storage type (localStorage or sessionStorage).
	 * 
	 * @param {string} storageType - The type of storage to switch to ('local' or 'session').
     * @throws {Error} Throws an error if the storage type is invalid.
	 */
	switchStorageType(storageType) {
		// Update the storage property to the desired type
        if (storageType === 'session') {
            this.storage = sessionStorage;
        } else if (storageType === 'local') {
            this.storage = localStorage;
        } else {
            throw new Error(`Invalid storage type "${storageType}". Use 'local' or 'session'.`);
        }
	}

	/**
	 * Cleanup
	 */
	dispose() {
		this.storage = null;
	}
}

export default Storage;
