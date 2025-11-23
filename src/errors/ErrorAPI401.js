import ErrorAPI from './ErrorAPI';

class ErrorAPI401 extends ErrorAPI {
	constructor(message, response, data) {
		message = message || 'Unauthorized request';
		super(message, response, data);
	}
}

export default ErrorAPI401;