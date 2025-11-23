import Content from '@/components/Content';
import { Button } from '@/components/ui';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import logger from '@/utils/logger';
import { getPath } from '@/utils/utils';
import React, { useEffect, useRef, useState } from 'react';

const TITLE = 'Page Not Found';

const Unknown = (props) => {
	const [ useContent, setUseContent ] = useState(false);
	const navigate 						= useNavigate();
	const ref 							= useRef();

	/**
	 * 
	 * @param {string} name 
	 * @returns {string} the pretty name (remove dashes and uppercase each word)
	 */
	const prettyName = (name) => {
		const words 	= name.split('-');
		const commons 	= [ 'er', 'lr', 'sts', 'vo' ];
		
		name = words.map(word => {
			if (!word) return;
			if (/^(is|at|or|of|the|on|by|and)$/.test(word)) {
				return word;
			}

			if (commons.includes(word)) {
				return word.replace(/(lr|er|sts)/, 'LR').toUpperCase();
			}
			
			return word[0].toUpperCase() + word.substring(1);
		}).join(' ');
		
		return name;
	}

	/**
	 * 
	 * @param {ReactNode} Component 
	 * @param {ReactNode} children 
	 * @returns {ReactNode} the wrapped component
	 */
	const wrap = (Component, children) => {
		return (
			<Component>{children}</Component>
		)
	}

	// Extract the name after the last slash
	const path = getPath();
	
	// Replace all dashes and capitalizes each word
	const name = prettyName(path);

	useEffect(() => {
		// Should we wrap the content around the Content tag?
		setUseContent(ref.current.closest('#content') === null);
	}, []);

	logger.log('Unknown.js - component loaded');

	return (
		<div ref={ref}>
			{wrap(useContent ? Content : React.Fragment, (
				<>
					{name.toLowerCase() === 'unknown' ? (
						<>
							{/* Header Section */}
							<Header title={TITLE} />

							<p>If you continue to get this erorr, please select another page from the navigation menu.</p>
							<p><Button className='btn-sm btn-primary' onClick={() => {navigate('/home'); window.location.reload(true);}}>Refresh</Button></p>
						</>
					) : (
						<>
							{/* Header Section */}
							<Header title={name} />

							<p><strong>Page not found!</strong></p>
							<p>If you continue to get this erorr, please select another page from the navigation menu.</p>
							
							<div className='d-flex gap-2'>
								<Button className='btn-sm btn-primary' onClick={(e) => {navigate('/home');}}>Home</Button> 
								<Button className='btn-sm btn-secondary' onClick={(e) => {e.preventDefault(); window.location.reload(true);}}>Try again</Button>
							</div>
						</>
					)}
				</>
			))}
		</div>
	)
};

export default Unknown;