import { BASE_URL, createService } from './helpers';

const USER_URL = `${BASE_URL}/products`;

const productService = createService({
	products: 			{ url: `${USER_URL}`,method: 'GET' },
	productsByCategory: { url: `${USER_URL}/category/{{category}}`, method: 'GET' },
	product: 			{ url: `${USER_URL}/{{id}}`, method: 'GET' },
	productCategories: 	{ url: `${USER_URL}/categories`, method: 'GET',  },
});

export default productService;