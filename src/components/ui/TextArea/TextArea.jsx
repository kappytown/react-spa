import { forwardRef } from 'react';

const TextArea = forwardRef((props, ref) => {
	const className = ['form-control', props.className].join(' ');

	return <textarea ref={ref} {...props} className={className}>{props.children}</textarea>
});

export default TextArea;