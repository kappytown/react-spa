import cache from '@/utils/cache';
import logger from '@/utils/logger';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const SERVICE_STATUS = {
	IDLE: 'idle',
	LOADING: 'loading',
	COMPLETE: 'complete',
	ERROR: 'error'
}

const DEFAULT_CONFIG = {
	//hasState: false,	// updates the state
	useCache: true, 	// caches the response
	cachePrefix: '', 	 // Sets the cache prefix if desired
	reload: false, 		// Replaces all cached items with the same prefix
	clear: false, 		// Removes the key from cache. Note: useCache must be false to work
	testData: null,		// To use your own test data without hitting the server
	processData: data => data
}

const INITIAL_STATE = {
	status: SERVICE_STATUS.IDLE, 
	data: null, 
	error: null
};

/**
 * This allows caching on the specified service as well as provides state updates if desired
 * 
 * Usage:
 * 		import useCacheService from '@/hooks/useCacheService';
 * 		import reportService from '@/services/reportService';
 * 
 * 		const [ request ] = useCacheService();
 * 		OR with state updates
 * 		const [ request, status, data, error ] = useCacheService(true);
 * 		
 * 		const getData = async () => {
 * 			// cache response
 * 			return await request(reportService.dashboardVO, { periodid: 525 });
 * 			// don't cache response
 * 			return await request(reportService.dashboardVO, { periodid: 525 }, { useCache: false });
 * 			// clear cache
 * 			return await request(reportService.dashboardVO, { periodid: 525 }, { useCache: false, clear: true });
 * 			// turn off state for this request
 * 			return await request(reportService.dashboardVO, { periodid: 525 }, { hasState: false });
 * 		}
 * 
 * 
 * @param {bool} hasState - true to enable state updates
 * @param {object} config - overwrites the default settings
 * @returns {object} - request method and state values
 */
const useCacheService = (hasState=false, config={}) => {
	// Used to prevent state update if the component is unmounted
	const cancelRequest = useRef(false);

	// Default state values
	const [ state, setState ] = useState(INITIAL_STATE);

	// Memoize since it is a dependency of the request method
	// Since config is a prop and an object, it will be recreated on every render. To prevent this, we stringify it for a better comparison
	// for even more accuracy, we can do a deep comparison... const memoizedConfig = useDeepCompareMemoize(config);
	const defaults = useMemo(() => Object.assign({ hasState }, DEFAULT_CONFIG, config), [ hasState, DEFAULT_CONFIG, JSON.stringify(config) ]);

	/**
	 * 
	 * @param {Function} serviceMethod - the service method to get the data from
	 * @param {object} params - the parameters to pass along with the request
	 * @param {object} config - overrides the defaults
	 * @returns {object} - API response data
	 */
	const request = useCallback(async (serviceMethod, params, config={}) => {
		let data = {};

		const options = Object.assign({}, defaults, config);

		// Don't cancel current request
		cancelRequest.current = false;

		try {
			if (!serviceMethod) {
				throw new Error('Service method not found.');
			}

			// ---------------------------------------
			// STATE UPDATE: LOADING
			// ---------------------------------------
			if (options.hasState) {
				setState({ status: SERVICE_STATUS.LOADING, data: [], error: null });
			}

			// generate cachePrefix ...
			options.cachePrefix += serviceMethod.name;
			let cacheId = options.cachePrefix;
			for (const key in params) {
				// exclude 'hidden' params
				if (!key.startsWith('_')) cacheId += `{${params[key]}}`;
			}

			// ---------------------------------------
			// TEST DATA
			// ---------------------------------------
			if (options.testData) {
				if (options.hasState) {
					setState({ status: SERVICE_STATUS.COMPLETE, data: options.testData, error: null });
				}
				return options.processData(options.testData);
			}

			if (options.useCache && !options.reload) {
				// ---------------------------------------
				// CACHE: GET
				// ---------------------------------------
				const cachedData = cache.get(cacheId);
				console.log('Cache:', cacheId, cachedData);
				if (cachedData) {
					// ---------------------------------------
					// STATE UPDATE: COMPLETE
					// ---------------------------------------
					if (options.hasState) {
						setState({ status: SERVICE_STATUS.COMPLETE, data: cachedData, error: null });
					}
					return options.processData(cachedData);
				}
			}

			// Use the service method to get the data;
			data = await serviceMethod(params, config.signal);
			data = options.processData(data);
			
			if (options.useCache) {
				const keys = Object.keys(data?.data || {});

				// Only cache if we have data
				if (data.status === 200 && keys.length > 0 || (data.length > 0 || keys.length > 0)) {
					if (options.reload) {
						// ---------------------------------------
						// CACHE: REPLACE
						// ---------------------------------------
						cache.replace(cacheId, options.cachePrefix, data);
					} else {
						// ---------------------------------------
						// CACHE: ADD
						// ---------------------------------------
						cache.set(cacheId, data);
					}
				}
			} else if (options.clear) {
				// ---------------------------------------
				// CACHE: REMOVE
				// ---------------------------------------
				cache.remove(cacheId);
			}

			// ---------------------------------------
			// STATE UPDATE: COMPLETE
			// ---------------------------------------
			if (options.hasState) {
				setState({ status: SERVICE_STATUS.COMPLETE, data, error: null });
			}

		} catch (error) {
			logger.error(`useCacheService Error - ${error.message}`);
			if (cancelRequest.current) {
				// ---------------------------------------
				// STATE UPDATE: COMPLETE
				// ---------------------------------------
				if (options.hasState) {
					setState({ status: SERVICE_STATUS.COMPLETE, data, error: null });	
				}
			} else {
				// ---------------------------------------
				// STATE UPDATE: ERROR
				// ---------------------------------------
				if (options.hasState) {
					setState({ status: SERVICE_STATUS.ERROR, data, error: error.message });
				}
			}
		} finally {
			cancelRequest.current = false;
		}

		return data;
	}, [defaults]);

	useEffect(() => {
		// cleanup
		return () => {
			cancelRequest.current = true;
			setState(INITIAL_STATE);
		}
	}, []);

	return [ request, state.status, state.data, state.error ];
	//return [ request, state, setState ];
}

export default useCacheService;