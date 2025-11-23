import Content from '@/components/Content';
import ModalDialog from '@/components/ModalDialog';
import { Button } from '@/components/ui';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useLogout } from '@/hooks/useLogout';
import Header from '@/pages/components/Header';
import userService from '@/services/userService';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import './MyAccount.scss';

const TITLE = 'My Account';
const INITIAL_STATE = { id: 'modal_delete_user', title: 'Are You Sure?', show: false, params: [] };

const MyAccount = () => {
	const { user } 				= useAuthContext();
	const { logout } 			= useLogout();
	const navigate 				= useNavigate();
	const [ modal, setModal ] 	= useState(INITIAL_STATE);
	const errorRef 				= useRef(null);
	let isProcessing 			= false;

	const handleEditProfileClick = (e) => {
		e.preventDefault();

		navigate('/account/my-account/edit-profile');
	}

	const handleChangePasswordClick = (e) => {
		e.preventDefault();

		navigate('/account/my-account/change-password');
	}

	const handleDeleteAccountClick = (e) => {
		e.preventDefault();

		if (isProcessing) return;
		isProcessing = true;

		// Are you sure modal
		setModal(prevState => (
			{ 
				...prevState, 
				show: true, 
				buttonTitle: 'Delete My Account', 
				body: <><p>Deleting your account cannot be undone and you will no longer be able to log back in.</p><p><strong>Are you sure you wish to continue?</strong></p></> 
			}
		));
	}

	const handleModalClose = (e) => {
		setModal(INITIAL_STATE);

		isProcessing = false;
	}

	const handleModalClick = async(e) => {
		e.preventDefault();

		const result 	= await userService.delete({ id: user.id });
		let message 	= '';
		
		if (result?.success === true) {
			logout();
		} else {
			errorRef.current.classList.remove('hidden');
			errorRef.current.textContent = 'Unable to delete account, please try again shortly.';
			isProcessing = false
		}

		setModal(INITIAL_STATE);
	}

	return (
		<Content id='my_account'>
			{/* Header Section */}
			<Header title={TITLE} />

			<div ref={errorRef} className='error mb-3 hidden'></div>

			<div className='account-details'>
				<p className='text-capitalize'>
					<strong>Name:</strong><br />
					{user?.name || ''}
				</p>
				<p>
					<strong>Email:</strong><br />
					{user?.email || ''}
				</p>
				<Button className='btn-sm btn-default' onClick={handleEditProfileClick}>Edit Profile</Button> 
				<Button className='btn-sm btn-default' onClick={handleChangePasswordClick}>Change Password</Button>
				<Button className='btn-sm btn-danger mt-3 d-block' onClick={handleDeleteAccountClick}>Delete Account</Button>
			</div>

			{modal.show && (
				<ModalDialog {...modal} onClose={handleModalClose} onClick={handleModalClick} />
			)}
		</Content>
	)
}

export default MyAccount;