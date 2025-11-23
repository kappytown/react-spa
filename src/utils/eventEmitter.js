import logger from './logger';

export const EVENTS = {
	// [Component that emits the event] -> Component that listens to event
	
	// [Login] -> App
	LOGGED_IN: 'logged_in',

	// [useLogout] -> AuthContext
	LOGGED_OUT: 'logged_out',

	// not used
	APP_READY: 'app_ready',
	
	// [apiRequest] -> App/LastUpdated
	LAST_UPDATED: 'last_updated',
	// [Report] -> App/LastUpdated
	BACK_BUTTON_SHOW: 'back_button_show',
	BACK_BUTTON_HIDE: 'back_button_hide',

	// [apiRequest] -> AuthContext
	UNAUTHORIZED_401: 'unauthorized_401',
	ACCOUNT_ACTIVE: 'account_active',

	// [apiRequest 503 response] -> App
	SHOW_MAINTENANCE_PAGE: 'show_maintenance_page',

	// [Report] -> Content/ModalExportDialog
	EXPORT_REPORT: 'export_report',
	
	// [Report] -> App/Loader
	LOADER_SHOW: 'loader_show',
	LOADER_HIDE: 'loader_hide',

	// [notification] -> App
	NAVIGATE: 'navigate',
	
	// not used -> App/Loader
	LOADER_PROGRESS_SHOW: 'loader_progress_show',
	LOADER_PROGRESS_HIDE: 'loader_progress_hide',
	LOADER_PROGRESS_UPDATE: 'loader_progress_update',

	// [Report, NavMenu, notification, versionManager] -> Content/ModalDialog
	MODAL_SHOW: 'modal_show',
	MODAL_HIDE: 'modal_hide',

	// [NavMenu, FAQs, FieldTerms, FieldPrivacy] -> Content/ModalPolicy
	POLICY_MODAL_SHOW: 'policy_modal_show',
	POLICY_MODAL_HIDE: 'policy_modal_hide',
	 
	// [apiRequest] -> no listeners
	API_REQUEST_COMPLETE: 'api_request_complete',

	// [apiRequest] -> App
	API_REQUEST_ERROR: 'api_request_error',

	COOKIE_PREFERENCES_CHANGE: 'cookie_preferences_change',
}

/**
 * Event Emitter pattern used to subscribe to and publish events
 * Note: 
 * 		A subscriber can subscribe to multiple events
 * 		A subscriber can subscribe to a single event with multiple functions (callbacks)
 * 		A subscriber can unsubscribe to a single event as long as the id and function matches
 * 		A publisher can pass multiple arguments that gets sent to all subscribers
 * 		Multiple subscribers with exact same callback can subscribe
 */
class EventEmitter {
	static #instance;

	#events = {};

	/**
	 * Class constructor to prevent multiple instances
	 */
	constructor() {
        if (EventEmitter.#instance) {
            return EventEmitter.#instance;
        }

        EventEmitter.#instance = this;
	}

	/**
	 * Checks if the event has already been registered to prevent duplicates
	 * 
	 * @param {string} id 
	 * @param {string} eventName 
	 * @param {function} callback 
	 * @returns {number} - 0-n if this event has already been subscribed to with the same id and function
	 * @private
	 */
	#alreadyRegistered = (id, eventName, callback) => {
		let subscribers = this.#events[eventName] || [];

		return subscribers.findIndex(subscriber => {
			return id === subscriber.id && callback.toString() === subscriber.callback.toString();
		});
	}

	/**
	 * This will update the list of subscribers to the specified event and remove if empty
	 * 
	 * @param {string} eventName - name of the event
	 * @param {array} subscribers - array of subscribers
	 * @private
	 */
	#updateEvent = (eventName, subscribers) => {
		// Remove from list of events if there are no more subscribers
		if (!subscribers.length) {
			delete this.#events[eventName];
		} else {
			this.#events[eventName] = subscribers;
		}
	}

	/**
	 * Subscribes to the specified event by id if it hasn't already been subscribed to
	 * 
	 * @param {string} id - identifier of the subscriber
	 * @param {string} eventName - event to subscribe to
	 * @param {function} callback - function to execute when event has been published
	 */
	on = (id, eventName, callback = () => {}) => {
		if (eventName === '') {
			throw new Error('In order to subscribe to an event, you must supply the name of the event.');
		}
		
		const eventNames = Array.isArray(eventName) ? eventName : [eventName];

		eventNames.forEach(name => {
			let subscribers = this.#events[name] || [];
			const obj = { id, callback };
			const index = this.#alreadyRegistered(id, name, callback);

			// index > -1 only if the callback has changed
			if (index === -1) {
				subscribers.push(obj);
				this.#events[name] = subscribers;
			}
		});
	}

	/**
	 * Unsubscribes to an event that has the same id, event, and function
	 * Unsubscribes to all events that has the same id and eventName is empty
	 * 
	 * @param {string} id - identifier of the unsubscriber
	 * @param {string} eventName - event to unsubscribe to
	 * @param {function} callback - function to be removed
	 */
	off = (id, eventName, callback = () => {}) => {
		if (eventName) {
			let subscribers = this.#events[eventName] || [];

			// Filter out the subscriber who wishes to unsubscribe
			subscribers = subscribers.filter(subscriber => {
				return id !== subscriber.id || callback.toString() !== subscriber.callback.toString();
			});

			// Remove from list of events if there are no more subscribers
			this.#updateEvent(eventName, subscribers);
			
		} else {
			// Loop over all the events
			for (const event in this.#events) {
				// Filter out the subsribers with the specified id
				let subscribers = this.#events[event].filter(subscriber => {
					return id !== subscriber.id;
				});

				// Remove from list of events if there are no more subscribers
				this.#updateEvent(event, subscribers);
			}
		}
	}

	/**
	 * Publishes the event to all subscribers passing all arguments
	 * 
	 * @param {string} eventName - the event to publish
	 */
	emit = (eventName, ...params) => {
		if (eventName === '') {
			throw new Error('In order to publish an event, you must supply the name of the event.');
		}

		let subscribers = this.#events[eventName];
		
		if (subscribers) {
			// Loop over all of the subscribers for this event and execute the callback
			subscribers.forEach(subscriber => {
				subscriber.callback(...params);
			});
		} else {
			logger.warn(`No subscribers for the published event "${eventName}".`);
		}
	}

	/**
	 * Cleanup
	 */
	dispose() {
		this.#events = {};
		//EventEmitter.#instance = null;
	}
}

const eventEmitter = new EventEmitter();
Object.freeze(eventEmitter);

export default eventEmitter;