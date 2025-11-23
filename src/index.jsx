import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthContextProvider } from '@/contexts/AuthContext';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App';

// -----------------------------------------------------
// TODO: UPDATE NATIVE APPS SO WE CAN REMOVE THIS
// Perhaps just expose a handlePushNotifcation function and make a service
// call to get the memberid from the token. window['App'] = {handlePushNotifcation:notification.getById}

// Both Android and iOS required the user and notification objects in order to
// save new push notification tokens as well as respond to received push notifications.
window['App'] = { user: {}, notification: {} };
// -----------------------------------------------------

//https://blog.logrocket.com/react-error-handling-react-error-boundary/
const root = ReactDOM.createRoot(document.getElementById('root'));
// If using non hash-based routing, use BrowserRouter: <BrowserRouter basename={getEnvVar('ENV_BASE_NAME')}>
// Also, update all link in NavMenuLink to use <NavLink to={path} and not <a href='#/{path}'
root.render(
	<HashRouter>
		<ErrorBoundary>
			<AuthContextProvider>
				<App />
			</AuthContextProvider>
		</ErrorBoundary>
	</HashRouter>
);