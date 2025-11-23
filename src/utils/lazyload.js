import { getAppVersion } from './utils';

/**
 * Lazy load assets, call callback fn after all assets have loaded.
 *
 * Usage:
 * lazyload.load({
 * 		'js': ['js/file.js'],
 * 		'tmpl': [{'src': 'tpl/event.tpl', 'id': 'event-view'}],
 *  	'css': ['css/file.css']
 *  });
 *
 * lazyload.load({'js': ['js/file.js']});
 */
class LazyLoad {
	static #instance;

	#loaded = { 'js': [], 'tmpl': [], 'css': [] };

	/**
	 * Class constructor to prevent multiple instances
	 */
	constructor() {
		if (LazyLoad.#instance) {
			return LazyLoad.#instance;
		}

		LazyLoad.#instance = this;
	}

	/**
	 * 
	 * @param {string} type 
	 * @param {object} asset 
	 * @private
	 */
	#addLoaded = (type, asset) => {
		if (!type || !asset) return;
		this.#loaded[type].push(asset);
	}

	/**
	 * 
	 * @param {string} type 
	 * @param {object} asset 
	 * @returns {boolean}
	 * @private
	 */
	#isLoaded = (type, asset) => {
		// If tmpl, check the src since that is what we store
		if (type === 'tmpl') {
			asset = asset.src;
		}
		return this.#loaded[type].indexOf(asset) > -1;
	}

	/**
	 * 
	 * @param {object} asset 
	 * @returns {string}
	 * @private
	 */
	#appendVersion = (asset) => {
		return asset + `?${getAppVersion()}`;
	}

	/**
	 * 
	 * @param {array} assets 
	 * @param {function} fn 
	 */
	load = (assets, fn) => {
		let assetsLoaded = 0;
		let assetCount = 0;

		const onLoad = (assetType, asset) => {
			assetsLoaded++;

			// Only add the src if tmpl
			if (assetType === 'tmpl') {
				this.#addLoaded(assetType, asset.src);
			} else {
				this.#addLoaded(assetType, asset);
			}

			if (assetsLoaded === assetCount) {
				if (fn) fn();
			}
		}

		const onError = (assetType, asset) => {
			console.error(`Failed to load ${assetType}: ${asset}`);
			assetsLoaded++;
			if (assetsLoaded === assetCount) {
				if (fn) fn();
			}
		}

		const onLoadDelegate = function(assetType, asset) {
			return function() {
				onLoad(assetType, asset);
			};
		};

		const onErrorDelegate = function(assetType, asset) {
			return function() {
				onError(assetType, asset);
			};
		};

		for (const type in assets) {
			const len = assets[type]?.length || 0;
			assetCount += len;
		}

		for (const type in assets) {
			switch (type) {
				case 'js':
					for (let i = 0, al = assets[type].length; i < al; i++) {
						const asset = this.#appendVersion(assets[type][i]);
						// Only load once!
						if (this.#isLoaded(type, asset)) {
							onLoad();
							continue;
						}

						const script = document.createElement('script');
						script.async = true;
						script.src = asset;
						script.onload = onLoadDelegate(type, asset);
						script.onerror = onErrorDelegate(type, asset);
						document.head.appendChild(script);
					}
					break;

				case 'tmpl':
					for (let i = 0, al = assets[type].length; i < al; i++) {
						const asset = assets[type][i];
						asset.src = this.#appendVersion(asset.src);
						// Only load once!
						if (this.#isLoaded(type, asset)) {
							onLoad();
							continue;
						}

						const script = document.createElement('script');
						script.type = 'text/html';
						script.id = asset.id;
						script.src = asset.src;
						script.onload = onLoadDelegate(type, asset);
						script.onerror = onErrorDelegate(type, asset);
						document.body.appendChild(script);
					}
					break;

				case 'css':
					for (let i = 0, al = assets[type].length; i < al; i++) {
						const asset = this.#appendVersion(assets[type][i]);
						// Only load once!
						if (this.#isLoaded(type, asset)) {
							onLoad();
							continue;
						}

						const link = document.createElement('link');
						link.rel = 'stylesheet';
						link.href = asset;
						link.onload = onLoadDelegate(type, asset);
						link.onerror = onErrorDelegate(type, asset);
						document.head.appendChild(link);
					}
					break;

				default:
					continue;
			}
		}
	}

	/**
	 * Example: 
	 * lazyload.get(`assets/templates/policies/termly_cookies.html`, (body) => {
	 *		console.log(body);
	 * });
	 * 
	 * @param {object} asset 
	 * @param {function} callback 
	 */
	get = (asset, callback) => {
		fetch(asset, { method: 'GET', headers: { 'Content-Type': 'text/html' } })
			.then(response => response.text())
			.then(body => callback(body))
			.catch(error => callback(error));
	}

	/**
	 * Cleanup
	 */
	dispose() {
		this.#loaded = { 'js': [], 'tmpl': [], 'css': [] };
		//LazyLoad.#instance = null;
	}
};

const lazyload = new LazyLoad();
Object.freeze(lazyload);

export default lazyload;