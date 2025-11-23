import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const Unknown 			= lazy(() => import('@/pages/Unknown'));
const MyAccount 		= lazy(() => import('@/pages/account/MyAccount'));
const EditProfile 		= lazy(() => import('@/pages/account/EditProfile'));
const ChangePassword 	= lazy(() => import('@/pages/account/ChangePassword'));

const AccountRoutes = () => {
	return (
		<Routes>
			<Route index element={<Unknown />} />

			<Route path='my-account'>
				<Route index element={<MyAccount />} />
				<Route path='edit-profile' element={<EditProfile />} />
				<Route path='change-password' element={<ChangePassword />} />
			</Route>
		</Routes>
	)
};

export default AccountRoutes;