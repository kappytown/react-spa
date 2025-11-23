import ErrorAPI from './ErrorAPI';

class ErrorAPIInactive extends ErrorAPI {
	constructor(message, response, data) {
		message = message || 'SimpleApp account in not active.';
		super(message, response, data);
	}
}

export default ErrorAPIInactive;