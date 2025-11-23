import { useAuthContext } from '@/hooks/useAuthContext';
import { Navigate, Outlet, useLocation } from 'react-router';

const AuthRoute = ({ authRequired }) => {
    const location = useLocation();
    const { user } = useAuthContext();

	// Set 'to' to the home page '/' if location.state.from is not set
	// This allows us to navigate back to the page once we log in
    const to = location?.state?.from || '/';

    return (
        authRequired
            ? (user ? <Outlet /> : <Navigate to='/login' state={{ from: location.pathname }} replace />)
            : (!user ? <Outlet /> : <Navigate to={to} state={{ from: location.pathname }} replace />)
    );
};

export default AuthRoute;