import { forwardRef } from 'react';

const Radio = forwardRef((props, ref) => {
	const className = ['form-check-input', props.className].join(' ');

	return <input ref={ref} type='radio' {...props} className={className} />
});

export default Radio;