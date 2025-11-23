import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const Unknown 			= lazy(() => import('@/pages/Unknown'));
const Maintenance 		= lazy(() => import('@/pages/Maintenance'));

const MaintenanceRoutes = () => {
	return (
		<Routes>
			<Route index element={<Maintenance />} />
		</Routes>
	)
};

export default MaintenanceRoutes;