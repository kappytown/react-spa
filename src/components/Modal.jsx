import ModalDialog from '@/components/ModalDialog';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useEffect, useState } from 'react';

const INITIAL_STATE = { 
	id: 'modal', 
	show: false, 
	title: '', 
	body: '', 
	buttonTitle: '', 
	onClose: null, 
	onClick: null
};

const Modal = () => {
	const [ modal, setModal ] = useState(INITIAL_STATE);

	/**
	 * Shows the modal dialog
	 * 
	 * @param {object} data 
	 */
	const onModalShowEvent = (data) => {
		const onClose = (e) => {
			if (data.onClose) data.onClose(e);
			setModal(INITIAL_STATE);
		}
		setModal({ ...INITIAL_STATE, ...data, onClose, show: true });
	}
	
	/**
	 * Hides the modal dialog
	 */
	const onModalHideEvent = () => {
		setModal(INITIAL_STATE);
	}

	useEffect(() => {
		eventEmitter.on('Modal', EVENTS.MODAL_SHOW, onModalShowEvent);
		eventEmitter.on('Modal', EVENTS.MODAL_HIDE, onModalHideEvent);
		
		// cleanup
		return () => {
			eventEmitter.off('Modal');
		}
	}, []);

	return (
		<ModalDialog {...modal} />
	)
};

export default Modal;