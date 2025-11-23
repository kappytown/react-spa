import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
	const className = ['form-control', props.className].join(' ');

	return <input ref={ref} {...props} className={className} />
});

export default Input;