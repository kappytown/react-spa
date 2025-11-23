import useNavigate from '@/hooks/useNavigate';
import { useEffect } from 'react';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';

const NavigationTrigger = () => {
	const navigate = useNavigate();

	/**
	 * 
	 * @param {string} path 
	 */
	const onNavigateEvent = (path = '/', options) => {
		navigate(path, options);
	}

	useEffect(() => {
		eventEmitter.on('Navigate', EVENTS.NAVIGATE, onNavigateEvent);
		
		// cleanup
		return () => {
			eventEmitter.off('Navigate');
		}
	}, []);

	return null;
}

export default NavigationTrigger;