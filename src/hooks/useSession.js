import authService from '@/services/authService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';

const INITIAL_STATE = { 
	data: null, 
	error: null, 
	status: 'idle' 
};

export const useSession = () => {
	const [ state, setState ] 	= useState(INITIAL_STATE);
	const { dispatch } 			= useAuthContext();

	/**
	 * 
	 */
	const session = async () => {
		setState({ ...INITIAL_STATE, status: 'fetching' });

		const response = await authService.getSession();

		if (response.status === 200) {
			if (response.message) {
				setState(prevState => ({ ...prevState, error: response.message, status: 'error' }));
			} else {
				// Update auth context
				dispatch({ type: 'SESSION', payload: response.data });

				setState(prevState => ({ ...prevState, data: response, status: 'complete' }));

				eventEmitter.emit(EVENTS.SESSION_ACTIVE);
			}
		} else {
			setState(prevState => ({ ...prevState, error: response.message, status: 'error' }));
		}
	};

	useEffect(() => {
		// cleanup
		return () => {
			setState(INITIAL_STATE);
		}
	}, []);

	return { session, sessionData: state.data, sessionStatus: state.status, sessionError: state.error };
};