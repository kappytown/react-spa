import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useEffect, useRef, useState } from 'react';

import './Loader.scss';

/*
	Usage: 
		show: eventEmitter.emit('SHOW_LOADER', 'Loading...') - message is optional
		hide: eventEmitter.emit('HIDE_LOADER');

		show: eventEmitter.emit('SHOW_PROGRESS_BAR', 'Loading...', 10, 100) - params are optional
		hide: eventEmitter.emit('HIDE_PROGRESS_BAR');
		update: eventEmitter.emit('UPDATE_PROGRESS_BAR', 13, 100); - sets progress bar to 13%
*/
const Loader = () => {
	const [ loader, setLoader ] = useState({ show: false, message: '' });
	const [ progress, setProgress ] = useState({ show: false, message: '', percent: 0 });
	const progressBarRef = useRef();
	//const timeoutRef = useRef();

	/**
	 * Shows the loader
	 * 
	 * @param {string} message 
	 */
	const onLoaderShowEvent = (message = '') => {
		setLoader(prevLoader => ({ ...prevLoader, message, show: true }));
	}

	/**
	 * Hides the loader
	 */
	const onLoaderHideEvent = () => {
		setLoader(prevLoader => ({ ...prevLoader, show: false }));
	}

	/**
	 * Shows the progress bar with message and percent loaded if present
	 * 
	 * @param {string} message 
	 * @param {number} min 
	 * @param {number} max 
	 */
	const onLoaderProgressShowEvent = (message = '', min = 0, max = 0) => {
		const percent = Math.round((min / max) * 100);

		setProgress(prevProgress => ({ ...prevProgress, message, show: true, percent }));
	}

	/**
	 * Hides the progress bar
	 */
	const onLoaderProgressHideEvent = () => {
		setProgress(prevProgress => ({ ...prevProgress, show: false }));
	}

	/**
	 * Updates the percent loaded of the progress bar
	 * 
	 * @param {number} min 
	 * @param {number} max 
	 */
	const onLoaderProgressUpdateEvent = (min = 0, max = 0) => {
		const percent = Math.round((min / max) * 100);

		// Need to use state callback function to retain previous state
		setProgress(prevProgress => ({ ...prevProgress, percent }));
	}

	useEffect(() => {
		eventEmitter.on('Loader', EVENTS.LOADER_SHOW, onLoaderShowEvent);
		eventEmitter.on('Loader', EVENTS.LOADER_HIDE, onLoaderHideEvent);
		eventEmitter.on('Loader', EVENTS.LOADER_PROGRESS_SHOW, onLoaderProgressShowEvent);
		eventEmitter.on('Loader', EVENTS.LOADER_PROGRESS_HIDE, onLoaderProgressHideEvent);
		eventEmitter.on('Loader', EVENTS.LOADER_PROGRESS_UPDATE, onLoaderProgressUpdateEvent);
		
		// cleanup
		return () => {
			eventEmitter.off('Loader');
		}
	}, []);

	useEffect(() => {
		// Using ref to update the progress bar width instead of inline style attribute
		if (progress.show) {
			progressBarRef.current.style.width = `${progress.percent}%`;
		}
	}, [progress.percent]);

	/**
	 * This will prevent the loader and progress bar from showing longer than 5 seconds
	useEffect(() => {
		if (loader.show || progress.show) {
			timeoutRef.current = setTimeout(() => {
				onLoaderHideEvent();
				onLoaderProgressHideEvent();
			}, 5000);
		}

		if (!loader.show && !progress.show) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		}
	}, [loader, progress]);
	*/

	return (
		(loader.show || progress.show) && (
			<div className='loading-outer'>
				<>
					{loader.show && (
						<div className='wrapper'>
							<div className="message">{loader.message}</div>
							<div className="spinner-border text-primary" role="status"></div>
						</div>
					)}

					{progress.show && (
						<div className='wrapper with-bar'>
							<div className='message'>{progress.message}</div>
							<div className='progressbar'>
								<div ref={progressBarRef} className='bar'></div>
							</div>
						</div>
					)}
				</>
			</div>
		)
	)
};

export default Loader;
