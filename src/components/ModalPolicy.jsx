import ModalDialog from '@/components/ModalDialog';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import lazyload from '@/utils/lazyload';
import parse from 'html-react-parser';
import { useCallback, useEffect, useRef, useState } from 'react';

export const POLICIES = {
	TERMS: 'terms',
	PRIVACY: 'privacy',
	COOKIES: 'cookies'
}

const INITIAL_STATE = { 
	status: 'idle', 
	policy: null, 
	show: false 
};

const ModalPolicy = () => {
	// Use state so we can store the results of each policy to prevent reloading
	const [ state, setState ] = useState(INITIAL_STATE);

	// Keep the loaded content in state so we don't refetch it on every request
	const [ loaded, setLoaded ] = useState({});

	const policyRef = useRef();

	/**
	 * 
	 * @param {Event} e 
	 * @param {string} href 
	 */
	const jumpToEl = (e) => {
		e.preventDefault();

		const href = e.currentTarget.getAttribute('href');

		policyRef.current.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
	}

	/**
	 * Get the associated policy file name
	 * 
	 * @returns {string} the file name associated with the policy
	 */
	const getPolicyFileName = () => {
		switch(state.policy) {
			case 'terms':
				return 'termly_terms';
			case 'privacy':
				return 'termly_privacy';
			case 'cookies':
				return 'termly_cookies';
			default:
				return '';
		}
	}

	/**
	 * Gets the associated policy title
	 * 
	 * @returns {string} the title associated with the policy
	 */
	const getTitle = () => {
		switch(state.policy) {
			case 'terms':
				return 'Terms and Conditions';
			case 'privacy':
				return 'Privacy Policy';
			case 'cookies':
				return 'Cookie Policy';
			default:
				return '';
		}
	}

	/**
	 * Loads the policy, if not already loaded, then updates state to trigger a render of the modal
	 */
	const showPolicy = useCallback(() => {
		setState(prevState => ({ ...prevState, status: 'loading' }));

		const policyFileName = getPolicyFileName();

		if (policyFileName) {
			if (loaded[state.policy]) {
				setState(prevState => ({ ...prevState, show: true, status: 'complete' }));
				return;
			}
			
			// Load the policy html file from the public folder
			lazyload.get(`assets/templates/policies/${policyFileName}.html`, (body) => {
				setState(prevState => ({ ...prevState, show: true, status: 'complete' }));
				setLoaded(prevLoaded => ({ ...prevLoaded, [state.policy]: body }));
			});
		}
	}, [setState, setLoaded, loaded, state.policy]);

	/**
	 * Called when the POLICY_MODAL_SHOW event is emitted
	 * 
	 * @param {string} policy - the policy to show
	 */
	const onShowModalEvent = (policy) => {
		setState(prevState => ({...prevState, policy: policy }));
	}

	/**
	 * 
	 */
	const onClose = () => {
		setState(INITIAL_STATE);
	}

	// Register the event listener on initial load
	useEffect(() => {
		eventEmitter.on('ModalPolicy', EVENTS.POLICY_MODAL_SHOW, onShowModalEvent);
		
		// cleanup
		return () => {
			eventEmitter.off('ModalPolicy');

			// Cleanup event listeners
			if (policyRef.current) {
				policyRef.current.querySelectorAll('a').forEach(element => {
					const href = element.getAttribute('href');
					if (href && href.indexOf('#') === 0) {
						element.removeEventListener('click', jumpToEl);
					}
				});
			}
		}
	}, []);

	// Loads the policy then updates state to show it
	useEffect(() => {
		if (state.policy) {
			showPolicy();
		}

	}, [state.policy, showPolicy]);

	// Updates all the navigation links in the body once the content has loaded
	useEffect(() => {
		// Only update if the modal is show an we have loaded content
		if (state.show && state.policy && state.status === 'complete') {
			if (loaded.terms || loaded.privacy || loaded.cookies) {
				// Once a policy is loaded for the first time...
				// Make all anchor links work by removing the hash tags
				setTimeout(() => {
					policyRef.current.querySelectorAll('a').forEach(element => {
						const href = element.getAttribute('href');
						if (href && href.indexOf('#') === 0) {
							// Remove before adding
							element.removeEventListener('click', jumpToEl);
							element.addEventListener('click', jumpToEl);
						}
					});
				}, 500);
			}
		}
	}, [state, loaded]);

	return (
		<ModalDialog id='modal_policy' title={`${getTitle()}`} show={state.show} onClose={onClose}>
			{state.policy && loaded[state.policy] && <div ref={policyRef} id='policy'>{parse(loaded[state.policy])}</div>}
		</ModalDialog>
	)
}

export default ModalPolicy;