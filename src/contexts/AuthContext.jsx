import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { createContext, useEffect, useMemo, useReducer } from 'react';

const INITIAL_STATE = {
	user: null
};

export const AuthContext = createContext();

export const authReducer = (state, action) => {
	switch(action.type) {
		case 'SESSION':
		case 'LOGIN': {
			const data = action.payload && Object.keys(action.payload).length === 0 ? null : action.payload;

			return { user: data };
		}

		case 'UPDATE': {
			return { user: { ...state.user, ...action.payload }};
		}

		case 'LOGOUT':
			return INITIAL_STATE;

		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(authReducer, INITIAL_STATE);

	const onLoggedOutEvent = () => {
		dispatch({ type: 'LOGOUT' });
	}

	// Get the user session when the app initially loads
	useEffect(() => {
		// Captures unauthorized events so we can logout the user out
		eventEmitter.on('AuthContext', EVENTS.UNAUTHORIZED_401, onLoggedOutEvent);
		eventEmitter.on('AuthContext', EVENTS.LOGGED_OUT, onLoggedOutEvent);

		// cleanup
		return () => {
			eventEmitter.off('AuthContext');
		}
	}, []);

	// -----------------------------------------------------
	// TODO: UPDATE NATIVE APPS SO WE CAN REMOVE THIS
	// This will be removed in future releases once both native apps can retrieve the user data from the server.
	
	// Both Android and iOS require the user object to extract the memberid in order to save the push notification token
	if (window['App']) window['App'].user = state.user || {};
	// -----------------------------------------------------

	const value = useMemo(() => ({ ...state, dispatch }), [ state.user ]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
};