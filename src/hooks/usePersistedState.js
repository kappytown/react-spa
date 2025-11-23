import logger from '@/utils/logger';
import Storage from '@/utils/storage';
import { useEffect, useState } from 'react';

const storage = new Storage('session');

/**
 * This hook is used to persist the state of a component in the session storage since the state is lost when the component is unmounted.
 * Note: storage is cleared in App.jsx
 * 
 * @param {string} key 
 * @param {object} defaultValue 
 * @returns {array} an array containing the state and setState
 */
const usePersistedState = (key, defaultValue) => {
	console.log('USE PERSISTED STATE:', key, defaultValue);
	// Key must contain a value
	if (typeof key !== 'string' || key.trim() === '') {
		throw new Error('The key is a required parameter.');
	}

	// Lets prefix the key so they are easier to manage
	key = `state.${key}`;

	const [ state, setState ] = useState(() => {
		try {
			const sessionState = storage.getItem(key);
			return sessionState ? JSON.parse(sessionState) : defaultValue;
		} catch (error) {
			logger.error('Error reading from storage:', error);
			return defaultValue;
		}
	});

	useEffect(() => {
		// cleanup
		return () => {
			setState(defaultValue);
		}
	}, []);

	useEffect(() => {
		try {
			storage.setItem(key, JSON.stringify(state));
		} catch (error) {
			logger.error('Error writing to storage:', error);
		}
	}, [key, state]);

	return [state, setState];
};

export default usePersistedState;