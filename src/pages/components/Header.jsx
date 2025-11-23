import { isValidElement } from 'react';

const Header = ({ title, className, description, note, children }) => {
	let defaultDescription 	= description ? <p>{description}</p> : '';
	let defaultNote 		= note ? <p className='small'><strong>Note:</strong> {note}</p> : '';

	return (
		<>
			<h1 className={className}>{title}</h1>
			{isValidElement(description) ? (description) : (defaultDescription)}
			{isValidElement(note) ? (note) : (defaultNote)}
			{children}
		</>
	);
};

export default Header;