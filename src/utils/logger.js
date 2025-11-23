import { getEnvVar } from './utils';

/**
 * Logger which outputs to the browser console
 */
class Logger {
	static #instance;

	#isLoggingEnabled = process.env.NODE_ENV !== 'production';
	#timeZone;
	#locale;

	// For logging to the server
	#serverLogAPI = `${getEnvVar('ENV_SERVER_API')}/logs`;

	/**
	 * Binds our methods to the browser console
	 */
	constructor() {
		if (Logger.#instance) {
			return Logger.#instance;
		}

		Logger.#instance = this;

		// Dynamically set the user's time zone and locale
		this.#updateTimeSettings();
	}

	/**
	 * This will update the time zone and locale variables
	 * @private
	 */
	#updateTimeSettings = () => {
		const options = Intl.DateTimeFormat().resolvedOptions();
		this.#timeZone = options.timeZone || 'America/Los_Angeles';
		this.#locale = options.locale || 'en-US';
	}

	/**
	 * 
	 * @returns {string} - formatted timestamp
	 * @private
	 */
	#getTimestamp = () => {
		return new Intl.DateTimeFormat(this.#locale, {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZone: this.#timeZone,
		  }).format(new Date());
	}

	/**
	 * Enables logging
	 */
	enableLogging = () => {
		this.#isLoggingEnabled = true;
	}

	/**
	 * Disables logging
	 */
	disableLogging = () => {
		this.#isLoggingEnabled = false;
	}

	/**
	 * Sets the time zone for the timestamp
	 * 
	 * @param {string} timeZone - time zone identifier
	 */
	setTimeZone = (timeZone = 'America/Los_Angeles') => {
		this.#timeZone = timeZone;
	}

	/**
	 * Sets the locale for the timestamp formatting
	 * 
	 * @param {string} locale - locale identifer
	 */
	setLocale = (locale = 'en-US') => {
		this.#locale = locale;
	}

	/**
	 * Logs to the server
	 * 
	 * @param {string} level 
	 * @param {string} message 
	 */
	post = (level, message) => {
		fetch(this.#serverLogAPI, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ level, message })
		});
	}

	/**
	 * 
	 * @param  {...any} args - list of arguments passed
	 */
	log = (...args) => {
		if (!this.#isLoggingEnabled) return;
		  console.log.apply(console, [this.#getTimestamp(), ...args]);
	}
	
	/**
	 * 
	 * @param  {...any} args - list of arguments passed
	 */
	debug = (...args) => {
		if (!this.#isLoggingEnabled) return;
		console.debug.apply(console, [this.#getTimestamp(), ...args]);
  	}

	/**
	 * 
	 * @param  {...any} args - list of arguments passed
	 */
	warn = (...args) => {
		if (!this.#isLoggingEnabled) return;
		console.warn.apply(console, [this.#getTimestamp(), ...args]);
  	}

	/**
	 * 
	 * @param  {...any} args - list of arguments passed
	 */
	error = (...args) => {
		if (!this.#isLoggingEnabled) return;
		console.error.apply(console, [this.#getTimestamp(), ...args]);
  	}

	/**
	 * Cleanup
	 */
	dispose() {
		//Logger.#instance = null;
	}
}

const logger = new Logger();
Object.freeze(logger);

export default logger;