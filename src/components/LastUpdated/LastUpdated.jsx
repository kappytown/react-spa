import logger from '@/utils/logger';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { getLastUpdated } from '@/utils/utils';
import { memo, useCallback, useEffect, useState } from 'react';

import './LastUpdated.scss';

const INITIAL_STATE = { 
	show: false, 
	location: null 
};

const LastUpdated = () => {
	const [ updated, setUpdated ] 		= useState('about 10 minutes ago');
	const [ backButton, setBackButton ] = useState(INITIAL_STATE);
	
	/**
	 * 
	 * @param {string} value 
	 */
	const onLastUpdatedEvent = (value) => {
		const lastUpdated = getLastUpdated(value);
		setUpdated(getLastUpdated(value));
	};

	/**
	 * 
	 * @param {string} location 
	 */
	const onBackButtonShowEvent = (location) => {
		setBackButton({ show: true, location });
	};

	/**
	 * 
	 */
	const onBackButtonHideEvent = () => {
		setBackButton(INITIAL_STATE);
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	const onBackButtonClick = useCallback((e) => {
		e.preventDefault();
		
		const location = backButton.location || '/';
		eventEmitter.emit(EVENTS.NAVIGATE, location);
		setBackButton(INITIAL_STATE);
	},[backButton.location])

	// Should only subscribe to events once!
	useEffect(() => {
		eventEmitter.on('LastUpdated', EVENTS.LAST_UPDATED, onLastUpdatedEvent);
		eventEmitter.on('LastUpdated', EVENTS.BACK_BUTTON_SHOW, onBackButtonShowEvent);
		eventEmitter.on('LastUpdated', EVENTS.BACK_BUTTON_HIDE, onBackButtonHideEvent);

		// cleanup
		return () => {
			eventEmitter.off('LastUpdated');
		}
	}, []);
	
	
	logger.log('LastUpdated.js - component loaded');

	return (
		<div className='row date-last-updated'>
			<>
			{backButton.show && (
				<div className='col-12 nav-back'>
					<a href='/' onClick={onBackButtonClick}><span className='bi bi-chevron-left'></span> Back</a>
				</div>
			)}
				
			<div className='col-3'>
				Updated:
			</div>
			<div className='col-9 text-right'>
				<span className='date'>{updated}</span>
			</div>
			</>
		</div>
	);
};

export default memo(LastUpdated);