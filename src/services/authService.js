import { BASE_URL, createService } from './helpers';

const CUSTOMER_URL = `${BASE_URL}/customer`;
const AUTH_URL = `${BASE_URL}/auth`;

const authService = createService({
	getSession: { url: `${AUTH_URL}/session`, method: 'GET' },
	login: 		{ url: `${AUTH_URL}/login` },
	logout: 	{ url: `${AUTH_URL}/logout` }
});

export default authService;