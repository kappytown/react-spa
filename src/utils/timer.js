
/**
 * Browsers throttle your timers when the tab is inactive which can lead
 * to unexpected behaviour. For instance, I use a 24 hour interval to get notifications
 * and once the app becomes inactive so does the interval and when the app
 * becomes active again, the interval starts where it left off. It is possible
 * that the 24 hour interval never gets executed because of this.
 * 
 * This looks at the current time - time last executed to see if the
 * timer should execute. This way, if you have the app open for 10 minutes then
 * you don't reopen it for 2 days, the 24 hour timer will execute immediately.
 * 
 * Examples:
 * timer.setTimeout('YOUR_ID', 5000, () => {}); 		// Execute once after 5 seconds then remove
 * timer.setInterval('YOUR_ID', 5000, () => {}));		// Execute every 5 seconds forever
 * timer.setInterval('YOUR_ID', 5000, () => {}, 10);	// Execute every 5 seconds for 10 times then remove
 * timer.clearInterval('YOUR_ID');						// Remove the interval
 * 
 * Note: if referencing a class function be sure to use (bind(this)) - someClassFunction.bind(this);
 */
class Timer {
	/**
	 * Singleton instance
	 * @private
	 */
	static #instance;

	/**
	 * Map of timers, where each key is a unique timer ID
	 * and each value is an object containing the timers configuration 
	 * and state.
	 * @private
	 */
	#timers = new Map();

	/**
	 * The interval ID of the internal interval used to poll the timers.
	 * @private
	 */
	#intervalTimer = null;

	/**
	 * Class constructor to prevent multiple instances
	 */
	constructor() {
		if (Timer.#instance) {
			return Timer.#instance;
		}

		Timer.#instance = this;
	}

	/**
	 * Sets a timeout to execute a callback function after a specified delay.
	 * 
	 * @param {string} id - Unique ID for the timer
	 * @param {number} duration - Delay in milliseconds before executing the callback
	 * @param {function} callback - Function to execute when the timer expires
	 * @returns {function} - A function to cancel the timeout
	 * @throws {Error} If the id, duration, and/or callback are not valid
	 */
	setTimeout = (id, duration, callback) => {
		if (!id || typeof id !== 'string') throw new Error('Invalid id');
        if (typeof duration !== 'number' || duration <= 0) throw new Error('Invalid duration');
        if (typeof callback !== 'function') throw new Error('Invalid callback');

		const timer = { id, duration, callback, lastExecutionTime: performance.now(), maxExecutions: 1, numExecutions: 0 };
		this.#timers.set(id, timer);
		this.#startIntervalIfNeeded();

		return () => {
			this.clearTimeout(id);
		};
	}

	/**
	 * Sets an interval to execute a callback function at a specified interval.
	 * 
	 * @param {string} id - Unique ID for the timer
	 * @param {number} duration - Interval in milliseconds between executions
	 * @param {function} callback - Function to execute on each interval
	 * @param {number} [maxExecutions=-1] - Maximum number of executions (default: -1, meaning infinite)
	 * @returns {function} - A function to cancel the interval
	 * @throws {Error} If the id, duration, and/or callback are not valid
	 */
	setInterval = (id, duration, callback, maxExecutions = -1) => {
		if (!id || typeof id !== 'string') throw new Error('Invalid id');
		if (typeof duration !== 'number' || duration <= 0) throw new Error('Invalid duration');
		if (typeof callback !== 'function') throw new Error('Invalid callback');

		const timer = { id, duration, callback, lastExecutionTime: performance.now(), maxExecutions, numExecutions: 0 };
		this.#timers.set(id, timer);
		this.#startIntervalIfNeeded();

		return () => {
			this.clearInterval(id);
		};
	}

	/**
	 * Removes the timeout timer
	 * 
	 * @param {string} id - Unique ID of the timer to remove
	 */
	clearTimeout = (id) => {
		this.#timers.delete(id);
		this.#stopIntervalIfNeeded();
	}

	/**
	 * Removes the interval timer
	 * 
	 * @param {string} id 
	 */
	clearInterval = (id) => {
		this.#timers.delete(id);
		this.#stopIntervalIfNeeded();
	}

	/**
	 * Starts the interval if there are active timers
	 * @private
	 */
	#startIntervalIfNeeded = () => {
		if (this.#timers.size > 0 && !this.#intervalTimer) {
			this.#intervalTimer = setInterval(this.#run, 1000);
		}
	}

	/**
	 * Stops the internal interval used to poll the timers.
	 * @private
	 */
	#stopIntervalIfNeeded = () => {
		if (this.#timers.size === 0 && this.#intervalTimer) {
			clearInterval(this.#intervalTimer);
			this.#intervalTimer = null;
		}
	}

	/**
	 * Runs all the callbacks where the timeout duration has been met.
	 * @private
	 */
	#run = () => {
		const now = performance.now();
		const idsToRemove = [];

		this.#timers.forEach((timer, id) => {
			// If the elapsed time has exceeded, execute the callback
			if (now - timer.lastExecutionTime >= timer.duration) {
				// Execute the callback
				timer.callback();

				// Update the last execution time
				timer.lastExecutionTime = now;

				// Increment the number of executions
				timer.numExecutions += 1;

				// If the maximum number of executions has been reached, mark for removal
				if (timer.maxExecutions !== -1 && timer.numExecutions >= timer.maxExecutions) {
					idsToRemove.push(id);
				}
			}
		});

		// Remove the timers that have reached their maximum number of executions
		idsToRemove.forEach(id => this.#timers.delete(id));

		// Stop the interval if there are no more timers
		this.#stopIntervalIfNeeded();
	}

	/**
	 * Gets the remaining time for a timer.
	 * 
	 * @param {string} id - Unique ID of the timer
	 * @returns {number} - Remaining time in milliseconds
	 */
	getRemainingTime = (id) => {
		const timer = this.#timers.get(id);
		if (!timer) {
			throw new Error(`Timer with ID '${id}' not found`);
		}

		const now = performance.now();
		return Math.max(0, timer.lastExecutionTime + timer.duration - now);
	}

	/**
	 * Cleanup
	 */
	dispose() {
		clearInterval(this.#intervalTimer);
		this.#intervalTimer = null;
		this.#timers.clear();
		//Timer.#instance = null;
	}
};

const timer = new Timer();
Object.freeze(timer);

export default timer;