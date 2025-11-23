import { Button } from '@/components/ui';
import userService from '@/services/userService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useEffect, useState } from 'react';

import './CookieBanner.scss';

const uuidv4 = () => {
	// Replace each character in the template string with a random hex digit.
	// The 'x' characters are replaced with truly random digits.
	// The 'y' characters (specifically the one representing the variant) are replaced
	// with digits 8, 9, A, or B to adhere to UUID v4 standards.
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
		// Generate a random 4-bit number (0-15) - | 0 will turn a decimal into a whole number
		var randomNumber = Math.random() * 16 | 0;

		// Determine the digit based on the character from the template:
		// If the template character is 'x', use the random number as is.
		// If the template character is 'y', apply specific bitwise operations
		// to ensure the digit falls within the range 8-11 (hex 8-B).
		// (randomNumber & 0x3) ensures the last two bits are 00, 01, 10, or 11 (0-3 decimal).
		// | 0x8 then forces the most significant bit to 1, resulting in 1000, 1001, 1010, 1011 (8-11 decimal).
		var digit = char === 'x' ? randomNumber : (randomNumber & 0x3 | 0x8);

		// Convert the resulting digit to its hexadecimal string representation
		return digit.toString(16);
	});
}

const CookieBanner = (props) => {
	const [hasAccepted, setHasAccepted] = useState(false);

	let userId = localStorage.getItem('userConsentId');

	useEffect(() => {
		eventEmitter.on('CookieBanner', EVENTS.COOKIE_PREFERENCES_CHANGE, onChangeEvent);

		// If userId is not set, generate one
		if (!userId) {
			userId = uuidv4();
			localStorage.setItem('userConsentId', userId);
		}
		
		checkCookieConsent();
		
		// cleanup
		return () => {
			eventEmitter.off('CookieBanner');
		}
	}, []);

	/**
	 * Check if the user has already accepted cookies
	 * If not, show the cookie consent banner.
	 */
	const checkCookieConsent = () => {
		const consent = localStorage.getItem('cookieConsent');
		setHasAccepted(consent === 'accepted');
	};

	/**
	 * Handle the acceptance of cookies
	 * @param {Event} e 
	 */
	const handleAcceptCookies = (e) => {
		e.preventDefault();
		localStorage.setItem('cookieConsent', 'accepted');

		// this is just a stub, API not set
		// this should store the user's consent
		userService.cookieConsent({
			user_id: 		userId,
			consent_status: 'accepted_essential',
			consent_method: 'banner_click',
			policy_version: '1.0',
			timestamp: 		(new Date()).toISOString()
		});

		setHasAccepted(true);
	};

	/**
	 * Handle the viewing of the full cookie policy
	 * @param {Event} e 
	 */
	const handleViewFullPolicy = (e) => {
		e.preventDefault();
		eventEmitter.emit(EVENTS.POLICY_MODAL_SHOW, 'cookies');
	};

	/**
	 * Handle the change event for cookie preferences
	 * This will remove the cookie consent and reset the state
	 */
	const onChangeEvent = () => {
		localStorage.removeItem('cookieConsent');
		setHasAccepted(false);
	}

	return (
		<div id='cookieConsentBanner' className={`${hasAccepted ? 'hidden' : ''}`}>
			This website uses only **essential cookies** to ensure its proper functioning and to provide you with the best user experience. These cookies are strictly necessary. 
			<div>
				<Button type='button' className='btn-action btn-sm me-3' id='acceptCookiesBtn' onClick={handleAcceptCookies}>Accept Cookies</Button>
				<Button className='btn-default btn-sm' id='viewFullPolicyLink' onClick={handleViewFullPolicy}>View Full Policy</Button>
			</div>
		</div>
	);
}

export default CookieBanner;