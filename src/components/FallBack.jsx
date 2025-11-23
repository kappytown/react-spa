import { useEffect, useRef } from 'react';

/**
 * This will display a loading message after 500ms.
 * The delay is to prevent the loading message from flashing on the screen.
 */
const FallBack = ({message}) => {
	const ref = useRef(null);

	useEffect(() => {
		let timeout = setTimeout(() => {
			ref.current.classList.remove('hidden');
		}, 500);
		
		// cleanup
		return () => {
			clearTimeout(timeout);
		}
	}, []);

	return (
		<div ref={ref} className='fallback hidden'>{message}</div>
	)
}

export default FallBack;