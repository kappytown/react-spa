import CustomError from './CustomError';

class ErrorAPI extends CustomError {
	constructor(message, response, data) {
		message = message || 'Unable to fullfill this request, please try again.';
		super(message);
		this.response = response;
		this.data = data;
	}
}

export default ErrorAPI;