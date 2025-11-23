import { BASE_URL, createService } from './helpers';

const USER_URL = `${BASE_URL}/orders`;

const orderService = createService({
	orders: 			{ url: `${USER_URL}`, method: 'GET' },
	ordersByStatus: 	{ url: `${USER_URL}/status/{{status}}`, method: 'GET' },
	order: 				{ url: `${USER_URL}/{{id}}`, method: 'GET' },
	orderStatuses: 		{ url: `${USER_URL}/statuses`, method: 'GET'  },
});

export default orderService;