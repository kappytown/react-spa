import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const Unknown 	= lazy(() => import('@/pages/Unknown'));
const Orders 	= lazy(() => import('@/pages/orders/Orders'));
const Order 	= lazy(() => import('@/pages/orders/Order'));

const OrderRoutes = () => {
	return (
		<Routes>
			<Route index element={<Orders />} />
			<Route path=':cat' element={<Orders />} />
			<Route path='order/:id' element={<Order />} />
		</Routes>
	)
};

export default OrderRoutes;