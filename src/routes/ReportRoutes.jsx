import ErrorBoundary from '@/components/ErrorBoundary';
import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const Unknown 	= lazy(() => import('@/pages/Unknown'));

const ReportRoutes = () => {
	return (
		<Routes>
			<Route index element={<Unknown />} />
			<Route path=':name' element={<ErrorBoundary><Report /></ErrorBoundary>} />
			<Route path=':name/:sub' element={<ErrorBoundary><Report /></ErrorBoundary>} />
		</Routes>
	)
};

export default ReportRoutes;