import { Button, Modal } from 'react-bootstrap';
// Advanced modal... https://codeburst.io/create-reusable-modals-in-react-js-4922135fb964
// https://react-bootstrap.github.io/components/modal/

const ModalDialog = (props) => {
	const { id, size, show, title, noHeader, onClose, onClick, closeTitle='Close', hasCloseButton=true, buttonTitle, className } = props;
	const body = props.body || props.children;
	
	/**
	 * Close/Cancel button click handler
	 */
	const handleClose = (e) => {
		if (hasCloseButton === false) return;

		if (onClose) onClose(e);
	}

	/**
	 * Secondary button click handlers
	 */
	const handleClick = (e) => {
		if (onClick) onClick(e);
	}

	return (
		<Modal id={id} size={size} show={show} onClose={onClose} onHide={onClose} className={className} backdrop='static' animation={false} centered>
			{!noHeader && (
				<Modal.Header closeButton={hasCloseButton !== false} onClick={handleClose}>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
			)}
			<Modal.Body>{body}</Modal.Body>
			<Modal.Footer>
				{hasCloseButton !== false && <Button variant='secondary' onClick={handleClose}>{closeTitle}</Button>}
				{buttonTitle && <Button variant='primary' onClick={handleClick}>{buttonTitle}</Button>}
			</Modal.Footer>
		</Modal>
	)
};

export default ModalDialog;