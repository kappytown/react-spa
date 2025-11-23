import { getEnvVar } from '@/utils/utils';
import apiRequest from './apiRequest';

export const BASE_URL = getEnvVar('ENV_SERVER_API');

/**
 * This wraps a try/catch block around all requests, as well as handles errors, to reduce redundancy.
 * 
 * @param {object} config - Request configuration
 * @param {string} config.method - HTTP method
 * @param {string} config.url - API URL
 * @param {object} config.params - Request parameters
 * @param {object} config.headers - Request headers
 * @param {AbortSignal} config.signal - Abort signal
 * @returns {object} - API response data
 */
const makeRequest = async (config) => {
	let response;
	
	try {
		response = await apiRequest[config.method.toLowerCase()](config);

	} catch (error) {
		// The data is passed in the ErrorAPI event
		response = error?.data ?? {};

		// Return an empty object if data is empty to prevent setting the AuthContext user as { status: 401 }
		if (Object.keys(response).length === 0) {
			response = {};
		}
	}
	
	return response;
}

/**
 * Helper method to reduce redundancy by centralizing this API request logic
 * 
 * @param {object} endpoints - all the API endpoints and their configuration
 * @returns {object} all the API endpoints and their request function
 */
export const createService = (endpoints) => {
	const service = {};

	Object.keys(endpoints).forEach(key => {
		const endpoint 	= endpoints[key];

		// This will set the name property of the function to the value of key by using destructuring
		const { [key]: namedFunction } = { [key]: async (params, signal) => {
			const method 		= endpoint.method || 'POST';
			const url 			= endpoint.url;
			const modifiedParams = endpoint.params ? { ...params, ...endpoint.params } : params;
			
			return await makeRequest({ method, url, params: modifiedParams, signal });
		}};

		service[key] = namedFunction;
	});

	return service;
}