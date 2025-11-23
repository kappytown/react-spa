import Content from '@/components/Content';
import { Button } from '@/components/ui';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import appService from '@/services/appService';
import { useEffect, useRef } from 'react';

import './Maintenance.scss';

const TITLE = 'We\'ll be back soon';
let maintenanceInterval;

const Maintenance = () => {
	const navigate 		= useNavigate();
	const messageRef 	= useRef();

	/**
	 * Checks if we are still in maintenance mode and if not, redirects to the home page
	 */
	const maintenanceCheck = async () => {
		const response = await appService.maintenanceCheck();

		if (response.status === 200) {
			clearInterval(maintenanceInterval);
			navigate('/home');
			setTimeout(function() {
				window.location.reload(true);
			}, 500);

		} else {
			if (response.message) {
				messageRef.current.textContent = response.message;
			}
		}
	}

	/**
	 * 
	 * @param {Event} e 
	 */
	const onTryAgain = (e) => {
		maintenanceCheck();
	}

	/**
	 * Sets the interval used to make a request every 10 minutes to check if we are still in maintenance mode
	 */
	useEffect(() => {
		maintenanceInterval = setInterval(maintenanceCheck, 10*60*1000);	// 10 minutes
		
		// cleanup
		return () => {
			clearInterval(maintenanceInterval);
		}
	}, []);

	return (
		<Content id='maintenance'>
			{/* Header Section */}
			<Header title={TITLE} />
			<img src='assets/img/cleaning.gif' alt='Cleaning house'/>
			<p ref={messageRef} className='message'>Sorry for the inconvenience but we are currently working on some website upgrades to improve your experience. We should be back up shortly. Thank you for your patience.</p>
			<p>- The SimpleApp Team</p>
		
			<p><Button className='btn-action' onClick={onTryAgain}>Tired of waiting? Try again</Button></p>
		</Content>
	)
}

export default Maintenance;