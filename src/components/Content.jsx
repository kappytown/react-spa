import { useEffect, useRef } from 'react';
import { backToTop } from '@/utils/domUtils';

const Content = (props) => {
	const { id, children } 	= props;
	const className 		= props.className || '';
	const backToTopRef 		= useRef();

	/**
	 * 
	 * @param {Event} e 
	 */
	const onScrollEvent = (e) => {
		if (window.scrollY > 800) {
			backToTopRef.current?.classList.remove('hidden');
		} else {
			backToTopRef.current?.classList.add('hidden');
		}
	}

	// Our session api is used for a persistent session
	useEffect(() => {
		// Auto show/hide the Back to Top button
		window.addEventListener('scroll', onScrollEvent);
		
		// cleanup
		return () => {
			window.removeEventListener('scroll', onScrollEvent);
		}
	}, []);

	return (
		<>
			<section className={`row ${id}`} id='content'>
				<div className={'active ' + className} id={id}>
					<div className='col-12 col-sm-10 offset-sm-1'>
						{children}
					</div>
				</div>
			</section>
			<div ref={backToTopRef} className='row backToTop hidden' onClick={backToTop}>
				<div className='col-12 col-sm-10 offset-sm-1'><i className='bi bi-arrow-up'></i> Back to Top</div>
			</div>
		</>
	);
};

export default Content;