import { forwardRef } from 'react';

const Checkbox = forwardRef((props, ref) => {
	const className = ['form-check-input', props.className].join(' ');

	return <input ref={ref} type='checkbox' {...props} className={className} />
});

export default Checkbox;