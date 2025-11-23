import ErrorAPI from './ErrorAPI';

class ErrorAPI503 extends ErrorAPI {
	constructor(message, response, data) {
		message = message || 'Service unavailable, please try again later';
		super(message, response, data);
	}
}

export default ErrorAPI503;