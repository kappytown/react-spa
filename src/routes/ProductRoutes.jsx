import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const Unknown 	= lazy(() => import('@/pages/Unknown'));
const Products 	= lazy(() => import('@/pages/products/Products'));
const Product 	= lazy(() => import('@/pages/products/Product'));

const ProductRoutes = () => {
	return (
		<Routes>
			<Route index element={<Products />} />
			<Route path=':cat' element={<Products />} />
			<Route path='product/:id' element={<Product />} />
		</Routes>
	)
};

export default ProductRoutes;