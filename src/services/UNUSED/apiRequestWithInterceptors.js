import { 
	ErrorAPI, 
	ErrorAPI401, 
	ErrorAPI503, 
	ErrorAPIInactive, 
	ErrorAPIResponseNotOk 
} from '@/errors';
import logger from '@/utils/logger';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { getAppVersion, getPath, isProtectedRoute } from '@/utils/utils';

/**
 * API Request class
 * Provides a wrapper around the fetch API
 */
class ApiRequest {
	#interceptors = {
		request: [],
		response: [],
	};

	constructor() {}

	/**
	 * Adds a request interceptor
	 * 
	 * @param {Function} interceptor - interceptor function
	 */
	addRequestInterceptor = (interceptor) => {
		this.#interceptors.request.push(interceptor);
	}

	/**
	 * Adds a response interceptor
	 * 
	 * @param {Function} interceptor - interceptor function
	 */
	addResponseInterceptor = (interceptor) => {
		this.#interceptors.response.push(interceptor);
	}

	/**
	 * Loops through all the request interceptors and modifies the request one at a time.
	 * 
	 * @param {string} url 
	 * @param {object} options 
	 * @returns {object}
	 */
	#appyRequestInterceptors = async (url, options = {}) => {
		let interceptedRequest = { url, options };
		for (const interceptor of this.#interceptors.request) {
			// Allow interceptor to modify request url and/or options
			interceptedRequest = await interceptor(interceptedRequest) || interceptedRequest;
		}

		return interceptedRequest;
	};

	/**
	 * Loops through all the response interceptors and modifies the response one at a time.
	 * 
	 * @param {object} response 
	 * @returns {object}
	 */
	#appyResponseInterceptors = async (response) => {
		let interceptedResponse = response;//.clone();
		for (const interceptor of this.#interceptors.response) {
			// Allow interceptor to modify options
			interceptedResponse = await interceptor(interceptedResponse) || interceptedResponse;
		}

		return interceptedResponse;
	};

	/**
	 * Makes the request and parses the response
	 * 
	 * @param {object} config - Request configuration
	 * @param {string} config.method - HTTP method
	 * @param {string} config.url - API URL
	 * @param {object} config.params - Request parameters
	 * @param {object} config.headers - Request headers
	 * @param {AbortSignal} config.signal - Abort signal
	 * @returns {object} - API response
	 * @private
	 */
	#makeRequest = async (config) => {
		try {
			const response = await this.#buildRequest(config);

			const data = await this.#parseResponse(config.method, response);
			eventEmitter.emit(EVENTS.API_REQUEST_COMPLETE, { url: config.url, response, data });
			return data;

		} catch (error) {
			const { response, data } = await this.#handleError(error);
			eventEmitter.emit(EVENTS.API_REQUEST_ERROR, { url: config.url, response, data, error });
			throw new ErrorAPI(error.message, response, data);
		}
	}

	/**
	 * Builds the request configuration
	 * 
	 * @param {object} config - Request configuration
	 * @param {string} config.method - HTTP method
	 * @param {string} config.url - API URL
	 * @param {object} config.params - Request parameters
	 * @param {object} config.headers - Request headers
	 * @param {AbortSignal} config.signal - Abort signal
	 * @returns {Promise} - Fetch promise
	 * @private
	 */
	#buildRequest = async (config) => {
		const { method, url, params={}, headers={}, signal } = config;
		// Append the app version to the url
		let requestUrl = `${url}?v=${getAppVersion()}`;

		// Add a timeout signal and abort signal to the request
		const timeoutSignal = AbortSignal.timeout(2 * 60 * 1000);	// 2 minutes
		const signals = signal ? [timeoutSignal, signal] : [timeoutSignal];
		const abortSignal = AbortSignal.any ? AbortSignal.any(signals) : signals[0];

		// Cache busting...
		//requestUrl += `&ts=${(new Date).getTime()}`;

		const defaultHeaders = {
			Accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		};
		
		const options = {
			method,
			mode: 'cors',
			headers: { ...defaultHeaders, ...headers },
			credentials: 'same-origin',
			signal: abortSignal
		};
		
		// Create the request params and update the url by searching for keys to replace
		if (Object.keys(params).length !== 0) {
			const formData = new URLSearchParams();

			Object.entries(params).forEach(([ key, value ]) => {
				// this will turn /report/{{periodid}}/{{memberid}} to /report/525/2282844
				if (requestUrl.includes(`{{${key}}}`)) {
					requestUrl = requestUrl.replaceAll(`{{${key}}}`, value);
				} else {
					formData.append(key, value);
				}
			});

			if (method === 'GET') {
				if (formData.size > 0) {
					requestUrl += `&${formData.toString()}`;
				}
			} else {
				options.body = formData;
			}
		}

		// Apply request interceptors
		const interceptedRequest = await this.#appyRequestInterceptors(requestUrl, options);

		return await fetch(interceptedRequest.url, interceptedRequest.options);
	}

	/**
	 * Parses the response data
	 * @param {string} method - HTTP method
	 * @param {Response} response - Response object
	 * @returns {object} - Response data
	 * @private
	 */
	#parseResponse = async (method, response) => {
		// Apply response interceptors
		const interceptedResponse = await this.#appyResponseInterceptors(response);

		let data = await interceptedResponse.json();

		let canIgnoreResponse = false;	// set to true if unauthorized and url is auth request

		// ---------------------------------------
		// Handle 401 and 403 response codes
		// ---------------------------------------
		if ([401, 403].includes(data.status) || [401, 403].includes(interceptedResponse.status)) {
			// Check if we can ignore this 401 response
			if (!this.#canIgnoreUnauthorizedResponse(getPath(), method)) {
				eventEmitter.emit(EVENTS.UNAUTHORIZED_401, {});
				throw new ErrorAPI401('', interceptedResponse, {});
			} else {
				canIgnoreResponse = true;
			}
		}

		// ---------------------------------------
		// Handle 503 response code
		// ---------------------------------------
		if ([503].includes(data.status) || [503].includes(interceptedResponse.status)) {
			// Notify the app about maintenance mode
			throw new ErrorAPI503('', interceptedResponse, {});
		}

		// ---------------------------------------
		// Handle bad request
		// ---------------------------------------
		if (!interceptedResponse.ok && !canIgnoreResponse) {
			throw new ErrorAPIResponseNotOk('', interceptedResponse, data);
		}

		// ---------------------------------------
		// Sets the date last updated value
		// ---------------------------------------
		if (data?.lastUpdated) {
			eventEmitter.emit(EVENTS.LAST_UPDATED, data.lastUpdated);
		}

		return data;
	}

	/**
	 * Checks if a 410/403 response can be ignored
	 * 
	 * @param {string} url - Request URL
	 * @param {string} method - HTTP method
	 * @returns {bool} - true if the provided url and method can be ignored
	 * @private
	 */
	#canIgnoreUnauthorizedResponse = (url, method) => {
		const ignoreList = { 
			GET: [], 
			POST: ['login', 'logout', 'sign-up', 'dateLastUpdated'], 
			DELETE: [] 
		};
		const items = ignoreList[method] || [];
		return items.some(item => url.indexOf(item) !== -1);
	}

	/**
	 * Handles errors
	 * 
	 * @param {Error} error  - Error object
	 * @returns {object} - Processed error response and data
	 * @private
	 */
	#handleError = async (error) => {
		logger.error(error);
		let { response } = error;
		let data = {};

		if (response) {
			try {
				data = await response.json();
			} catch (error) {
				// do nothing
			}
		}
		if (error instanceof ErrorAPI401 || error instanceof ErrorAPI503 || error instanceof ErrorAPIInactive) {
			data = {};
		} else if (error.name === 'TimeoutError') {
			// this should be logged on the server so we can resolve the issue
			response = { status: 408 , timedout: true };
		} else if (error.name === 'AbortError') {
			response = { status: 299 , aborted: true };
			// do nothing
		}

		return { response, data };
	}

	/**
	 * Makes a request
	 * @param {object} config - Request configuration
	 * @param {string} config.url - API URL
	 * @param {object} config.params - Request parameters
	 * @param {object} config.headers - Request headers
	 * @param {AbortSignal} config.signal - Abort signal
	 * @returns {object} - API response
	 */
	request = async (config) => {
		return await this.#makeRequest({ ...config });
	}

	/**
	 * Makes a GET request
	 * @param {object} config - Request configuration
	 * @param {string} config.url - API URL
	 * @param {object} config.params - Request parameters
	 * @param {object} config.headers - Request headers
	 * @param {AbortSignal} config.signal - Abort signal
	 * @returns {object} - API response
	 */
	get = async (config) => {
		return await this.#makeRequest({ method: 'GET', ...config });
	}

	/**
	 * Makes a PUT request
	 * @param {object} config - Request configuration
	 * @param {string} config.url - API URL
	 * @param {object} config.params - Request parameters
	 * @param {object} config.headers - Request headers
	 * @param {AbortSignal} config.signal - Abort signal
	 * @returns {object} - API response
	 */
	put = async (config) => {
		return await this.#makeRequest({ method: 'PUT', ...config });
	}

	/**
	 * Makes a POST request
	 * @param {object} config - Request configuration
	 * @param {string} config.url - API URL
	 * @param {object} config.params - Request parameters
	 * @param {object} config.headers - Request headers
	 * @param {AbortSignal} config.signal - Abort signal
	 * @returns {object} - API response
	 */
	post = async (config) => {
		return await this.#makeRequest({ method: 'POST', ...config });
	}

	/**
	 * Makes a DELETE request
	 * @param {object} config - Request configuration
	 * @param {string} config.url - API URL
	 * @param {object} config.params - Request parameters
	 * @param {object} config.headers - Request headers
	 * @param {AbortSignal} config.signal - Abort signal
	 * @returns {object} - API response
	 */
	delete = async (config) => {
		return await this.#makeRequest({ method: 'DELETE', url, ...config });
	}
};

export default ApiRequest;

/*
How to use:
const apiRequest = new ApiRequest();

// Add interceptors
// Add a custom header to the request
apiRequest.addRequestInterceptor(async request => {
	request.options.headers = {...request.options.headers, 'X-Custom-Header': 'Custom Header Value'};
	return request;
});

// Add a custom header to the response
apiRequest.addResponseInterceptor(async response => {
	response.headers.set('X-Updated-Header', 'Updated header value');
	return response;
});

// Preprocess the data in the response
apiRequest.addResponseInterceptor(async response => {
	const data = await response.json();

	const updateData = (item) => {
		// replace name 
		if (item.name) item.name = getName(item.name);
	}

	if (data?.data) {
		if (Array.isArray(data.data) || data.data.results) {
			if (data.data.results) {
				data.data.results.forEach(item => {
					updateData(item);
				});
			} else {
				data.data.forEach(item => {
					updateData(item);
				});
			}
		} else {
			updateData(data.data);
		}
	}

	return new Response(JSON.stringify(data), response);
});
const abortSignal = new AbortSignal();
apiRequest.get({ url: 'https://domain.com/api', params: {}, signal: abortSignal.signal });