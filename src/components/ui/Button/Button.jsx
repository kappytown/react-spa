import { forwardRef } from 'react';

const Button = forwardRef((props, ref) => {
	const className = ['btn', props.className].join(' ');
	const type = props.type || 'button';
	
	return (
		<button ref={ref} {...props} type={type} className={className}>{props.children}</button>
	);
});

export default Button;