Services are used to communicate to our server and should be used only if you do NOT want to cache the response.

**No cache/state example:**
```JavaScript
import reportService from '@/services/reportService';

const myComponent = (props) => {
	const getTopEnrollers = async () => {
		const data = await reportService.TopEnrollers({ periodid: 525 });
		// parse data
	}

	useEffect(() => {
		getTopEnrollers();
	}, []);
}
```

**Cache example using the useCacheService hook:**

```JavaScript
import useCacheService from '@/hooks/useCacheService';
import reportService from '@/services/reportService';

const myComponent = (props) => {
	const [ request ] = useCacheService();

	const getTopEnrollers = async () => {
		// This will look in the cache for the key topEnrollers{525} (uses the name of the method and the parameter values)
		// and return it if found, otherwise make the request and cache the response
		const data = await request(reportService.TopEnrollers, { periodid: 525 });
		// parse data
	}

	useEffect(() => {
		getTopEnrollers();
	}, []);
}
```

**NO cache example using the useCacheService hook:**
```JavaScript
import useCacheService from '@/hooks/useCacheService';
import reportService from '@/services/reportService';

const myComponent = (props) => {
	// This prevents caching on ALL requests
	// Note: the first parameter sets state to false to prevent state updates
	const [ request ] = useCacheService(false, { useCache: false });	// useCache is true by default

	const getTopEnrollers = async () => {
		const data = await request(reportService.TopEnrollers, { periodid: 525 });
		// parse data

		// If you want a single request to use cache:
		const data = await request(reportService.TopEnrollers, { periodid: 525 }, { useCache: true });
	}

	useEffect(() => {
		getTopEnrollers();
	}, []);
}
```

**Cache example using state:**
```JavaScript
import useCacheService from '@/hooks/useCacheService';
import reportService from '@/services/reportService';

const myComponent = (props) => {
	// Specify true in the initializer if you want state updates
	const [ request,  status, data, error ] = useCacheService(true);

	const getTopEnrollers = async () => {
		// This will look in the cache for the key topEnrollers{525} (uses the name of the method and the parameter values)
		// and return it if found, otherwise make the request and cache the response
		const data = await request(reportService.TopEnrollers, { periodid: 525 });
		// parse data
	}

	useEffect(() => {
		getTopEnrollers();
	}, []);

	useEffect(() => {
		console.log(status, data, error);
	}, [ status, data, error ])
}
```

**Cache example using a prefix for all requests:**
```JavaScript
import useCacheService from '@/hooks/useCacheService';
import reportService from '@/services/reportService';

const myComponent = (props) => {
	const [ request ] = useCacheService(false, { cachePrefix: 'some_custom_prefix_' });

	const getTopEnrollers = async () => {
		// The data will be stored in cache as some_custom_prefix_topEnrollers{525}
		const data = await request(reportService.TopEnrollers, { periodid: 525 });
		// parse data

		// or use a different prefix for the request:
		// The data will be stored in cache as a_different_prefix_topEnrollers{525}
		const data = await request(reportService.TopEnrollers, { periodid: 525 }, { cachePrefix: 'a_different_prefix_' });
	}

	useEffect(() => {
		getTopEnrollers();
	}, []);

	useEffect(() => {
		console.log(status, data, error);
	}, [ status, data, error ])
}
```