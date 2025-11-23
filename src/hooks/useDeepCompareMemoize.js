import { useRef } from 'react';

/**
 * 
 * @param {object} obj1 
 * @param {object} obj2 
 * @returns {boolean}
 */
const deepEqual = (obj1, obj2) => {
	if (obj1 === obj2) return true;

	if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
		return false;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) return false;

	for (const key of keys1) {
		if (!keys2.includes(key)) return false;
		if (!deepEqual(obj1[key], obj2[key])) return false;
	}

	return true;
};

/**
 * 
 * @param {object} value 
 * @returns {object}
 */
const useDeepCompareMemoize = (value) => {
	const ref = useRef();

	if (!deepEqual(value, ref.current)) {
		ref.current = value;
	}

	return ref.current;
};

export default useDeepCompareMemoize;