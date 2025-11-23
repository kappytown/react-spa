import { BASE_URL, createService } from './helpers';

const USER_URL = `${BASE_URL}/user`;

const userService = createService({
	create: 		{ url: `${USER_URL}`, method: 'POST'},
	read: 			{ url: `${USER_URL}/{{id}}`, method: 'GET'},
	update: 		{ url: `${USER_URL}/{{id}}`, method: 'PUT'},
	delete: 		{ url: `${USER_URL}/{{id}}`, method: 'DELETE'},
	cookieConsent: 	{ url: `${USER_URL}/cookieConsent`},
	sendMail: 		{ url: `${USER_URL}/sendMail` },
});

export default userService;