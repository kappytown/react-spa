import useNavigate from '@/hooks/useNavigate';
import authService from '@/services/authService';
import cache from '@/utils/cache';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useLocation } from 'react-router';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
	const navigate 		= useNavigate();
	const location 		= useLocation();
	const { dispatch } 	= useAuthContext();

	/**
	 * 
	 */
	const logout = () => {
		eventEmitter.emit(EVENTS.LOGGED_OUT);
		eventEmitter.emit(EVENTS.LOADER_HIDE);
		authService.logout();

		dispatch({ type: 'LOGOUT' });
		cache.clear();
		
		navigate('/login', { state: { from: location.pathname } });
	};

	return { logout };
};