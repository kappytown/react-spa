import AuthRoute from '@/components/AuthRoute';
import CookieBanner from '@/components/CookieBanner';
import FallBack from '@/components/FallBack';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LastUpdated from '@/components/LastUpdated';
import Loader from '@/components/Loader';
import Modal from '@/components/Modal';
import ModalExport from '@/components/ModalExport';
import ModalPolicy from '@/components/ModalPolicy';
import NavigationTrigger from '@/components/NavigationTrigger';
import NavMenu from '@/components/NavMenu';
import { useSession } from '@/hooks/useSession';
import cache from '@/utils/cache';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import logger from '@/utils/logger';
import Storage from '@/utils/storage';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router';
import { AccountRoutes, MaintenanceRoutes, OrderRoutes, ProductRoutes, SupportRoutes } from './routes';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.scss';

const Home 				= lazy(() => import('@/pages/Home'));
const Login 			= lazy(() => import('@/pages/Login'));
const SignUp 			= lazy(() => import('@/pages/SignUp'));
const Unknown 			= lazy(() => import('@/pages/Unknown'));

// App uses sessionStorage
const storage = new Storage('session');

const App = () => {
	const menuRef = useRef();
	const { session, sessionStatus } = useSession();

	/**
	 * 
	 * @returns {DOMElement} - the reference to the menu
	 */
	const getMenuRef = () => {
		let menu = menuRef.current.menu;

		// fallback
		if (!menu) {
			logger.error('menu reference is not defined so bypassing it.');
			menu = document.querySelector('#menu');
		}
		return menu;
	}

	/**
	 * Gets the users session which will update the AuthContext user state
	 * 
	 * If an unauthenticated user is redirected to Login from the report page, 
	 * they will be redirected back to that page once logged in.
	 * 
	 * The redirect magic happens in the HiddenRoute and ProtectedRoute components
	 */
	const getSession = async () => {
		eventEmitter.emit(EVENTS.LOADER_SHOW, 'Loading...');

		try {
			const response = await session();
		} catch (error) {
			logger.error('Failed to load user session:', error);
		} finally {
			eventEmitter.emit(EVENTS.LOADER_HIDE);
		}
	}

	/**
	 * Calls the init method to check for new notifications
	 */
	const onSessionActiveEvent = () => {
		// Removed as it is now handled natively in iOS and Android
		//versionManager.init();
		// Checks if the user has the lastest app version
		//versionManager.verifyNativeAppVersion(() => {
			//const _notification = notification();
			//notification.init();
		//});

		//eventEmitter.emit(EVENTS.APP_READY);
	}

	/**
	 * Navigates to the maintenance page - triggered from apiRequest 503 response
	 */
	const onShowMaintenancePageEvent = () => {
		eventEmitter.emit(EVENTS.NAVIGATE, '/maintenance');
	}

	/**
	 * This is used to perform the following operartions on every API response:
	 * 1) Verify the user has the latest web app version
	 * 
	 * @param {string} url
	 * @param {object} response
	 * @param {object} data
	 * @param {string} error 
	 */
	const onAPIRequestCompleteEvent = ({ url, response, data, error }) => {}
	
	/**
	 * 
	 * @param {object} data 
	 */
	const onAPIRequestErrorEvent = (data) => {}

	/**
	 * Clears all the data stored in storage unless prefix is defined
	 * then only the keys that contain the prefix will be removed.
	 * 
	 * @param {string} prefix - the key prefix
	 */
	const clearSessionStorage = (prefix = '') => {
		if (!prefix) storage.clear();

		storage.keys().forEach(key => {
			if (key.startsWith(prefix)) {
				storage.removeItem(key);
			}
		});
	}

	/**
	 * 
	 */
	useEffect(() => {
		// Gets the session when the logged_in event is triggered
		eventEmitter.on('App', EVENTS.LOGGED_IN, 			getSession);
		eventEmitter.on('App', EVENTS.SESSION_ACTIVE, 		onSessionActiveEvent);
		eventEmitter.on('App', EVENTS.API_REQUEST_COMPLETE, onAPIRequestCompleteEvent);
		eventEmitter.on('App', EVENTS.API_REQUEST_ERROR, 	onAPIRequestErrorEvent);

		// Gets the session on initial load
		getSession();

		// This function is used to clear state values from session storage when the window is closed or page is refreshed
		const onBeforeUnloadEvent = () => {
			clearSessionStorage('state.');
		}

		window.addEventListener('beforeunload', onBeforeUnloadEvent);

		// cleanup
		return () => {
			logger.log('App Unmounted');

			eventEmitter.off('App');
			window.removeEventListener('beforeunload', onBeforeUnloadEvent);

			// Class cleanup
			logger.dispose();
			eventEmitter.dispose();
			storage.dispose();
			cache.dispose();
			
			if (typeof timer !== 'undefined') {
				timer.dispose();
			}

			if (window['App']) {
				delete window['App'];
			}
		}
	}, []);

	logger.log('App.js - component loaded');

	return (
		<div className='d-flex flex-column min-vh-100'>
			<Loader />
			
			<Header getMenuRef={getMenuRef} />
			<NavMenu ref={menuRef} />

			<main className="container-fluid">
			{(sessionStatus === 'error' || sessionStatus === 'complete') && (
				<>
					<LastUpdated />
					<Suspense fallback={<FallBack message='Loading...' />} key={window.location.hash}>
						<Routes>
							{/* Redirects to home if user is authenticated */}
							<Route path='/' element={<AuthRoute />}>
								<Route path='login' element={<Login />} />
								<Route path='sign-up' element={<SignUp />} />
							</Route>

							{/* Redirects to login if user is not authenticated */}
							<Route path='/' element={<AuthRoute authRequired />}>
								<Route index element={<Home />} />
								<Route path='home' element={<Home />} />
								<Route path='products/*' element={<ProductRoutes />} />
								<Route path='orders/*' element={<OrderRoutes />} />
								<Route path='account/*' element={<AccountRoutes />} />
							</Route>

							<Route path='/support/*' element={<SupportRoutes />} />
							<Route path='/maintenance/*' element={<MaintenanceRoutes />} />
							<Route path='*' element={<Unknown />} />
						</Routes>
					</Suspense>
				</>
			)}
			</main>

			<Footer />
			<CookieBanner />
			
			{/* MODAL DIALOGS */}
			<Modal />
			<ModalExport />
			<ModalPolicy />

			{/* HANDLES NAVIGATION VIA navigate to prevent rerendering */}
			<NavigationTrigger />
		</div>
	);
};

export default App;