import ErrorAPI from './ErrorAPI';

class ErrorAPIResponseNotOk extends ErrorAPI {
	constructor(message, response, data) {
		message = message || 'The request failed, please try again.';
		super(message, response, data);
	}
}

export default ErrorAPIResponseNotOk;