import { BASE_URL, createService } from './helpers';

const REPORT_URL = `${BASE_URL}/report`;

const reportService = createService({
	orderStats: 	{ url: `${REPORT_URL}/orderStats`, method: 'GET' },
	topProducts: 	{ url: `${REPORT_URL}/topProducts`, method: 'GET' },
	recentOrders: 	{ url: `${REPORT_URL}/recentOrders`, method: 'GET' }
});

export default reportService;