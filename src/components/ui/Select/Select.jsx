import { forwardRef } from 'react';

const Select = forwardRef((props, ref) => {
	const className = ['form-select', props.className].join(' ');

	return <select ref={ref} {...props} className={className}>{props.children}</select>
});

export default Select;