import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const Unknown 		= lazy(() => import('@/pages/Unknown'));
const ContactUs 	= lazy(() => import('@/pages/support/ContactUs'));

const SupportRoutes = () => {
	return (
		<Routes>
			<Route index element={<Unknown />} />\
			<Route path='contact-us' element={<ContactUs />} />
		</Routes>
	)
};

export default SupportRoutes;