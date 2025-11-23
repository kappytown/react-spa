import { Spinner as BootStrapSpinner } from 'react-bootstrap';

import './Spinner.scss';

const Spinner = (props) => {
	return (
		<BootStrapSpinner animation='border' role='status' />
	)
};

export default Spinner;