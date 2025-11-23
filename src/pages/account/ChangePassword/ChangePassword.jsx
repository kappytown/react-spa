import Content from '@/components/Content';
import {
	Button,
	Input
} from '@/components/ui';
import { useAuthContext } from '@/hooks/useAuthContext';
import Header from '@/pages/components/Header';
import userService from '@/services/userService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { isValidPassword, validatePassword } from '@/utils/validation';
import { useEffect, useRef, useState } from 'react';

import './ChangePassword.scss';

const TITLE = 'Change Password';

const ChangePassword = (props) => {
	const { user } 					= useAuthContext();
	const [ error, setError ] 		= useState('');
	const errorRef 					= useRef(null);
	const formRef 					= useRef(null);
	const submitRef 				= useRef(null);
	let isProcessing 				= false;

	/**
	 * 
	 * @param {object} data 
	 */
	const updateUser = async(data) => {
		const results 	= await userService.update({ ...user, ...data });
		let message 	= '';
		
		if (results?.success === true) {
			message = 'User updated successfully!';
			formRef.current.reset();
		} else {
			message = results?.message || 'Unable to update user, please try again shortly.';
		}

		errorRef.current.classList.remove('hidden');
		errorRef.current.textContent 	= message;
		submitRef.current.disabled 		= false;
		isProcessing 					= false;
	}

	/**
	 * 
	 * @param {Evebt} e
	 */
	const handleSubmit = (e) => {
		e.preventDefault();

		if (isProcessing) return;
		isProcessing = true;

		const formData 	= new FormData(formRef.current);
		const data 		= {};

		for (let [ key, value ] of formData.entries()) {
			data[key] = value.trim();
		}

		errorRef.current.classList.add('hidden');

		let error 				= '';
		const password 			= data['password'].trim();
		const newPassword 		= data['new_password'].trim();
		const confirmPassword 	= data['confirm_password'].trim();

		if (!password || !newPassword || !confirmPassword) {
			error = 'All fields must have a value';

		} else if (!isValidPassword(password)) {
			error = '<strong>Current password is missing the following:</strong>';
			error += validatePassword(password).map(item => `<br />${item}`);

		} else if (!isValidPassword(newPassword)) {
			error = '<strong>New password is missing the following:</strong>';
			error += validatePassword(newPassword).map(item => `<br />${item}`);

		} else if (newPassword !== confirmPassword) {
			error = 'New password and confirm password do not match.';

		} else if (password === newPassword) {
			error = 'Your current password and new password cannot be the same.'
		}

		if (error) {
			errorRef.current.innerHTML = error;
			errorRef.current.classList.remove('hidden');

			isProcessing = false;
			return false;
		} else {
			console.log('SUCCESS')
		}

		submitRef.current.disabled = true;

		updateUser(data);
	}

	/**
	 * 
	 */
	useEffect(() => {
		eventEmitter.emit(EVENTS.BACK_BUTTON_SHOW, '/account/my-account');

		// cleanup
		return () => {
			eventEmitter.emit(EVENTS.BACK_BUTTON_HIDE);
		}
	}, []);

	return (
		<Content id='edit_profile'>
			{/* Header Section */}
			<Header title={TITLE} />

			<div className='signup-form'>
				<div ref={errorRef} className='error mb-3 hidden'></div>

				<form ref={formRef} onSubmit={handleSubmit}>
					<fieldset>
						<div className='mb-3'>
							<label className='form-label' htmlFor='password'>Current Password</label>
							<Input type='password' className='form-control' id='password' name='password' autoComplete='off' required />
						</div>

						<div className='mb-3'>
							<label className='form-label' htmlFor='new_password'>New Password</label>
							<Input type='password' className='form-control' id='new_password' name='new_password' autoComplete='off' required />
						</div>

						<div className='mb-3'>
							<label className='form-label' htmlFor='confirm_password'>Confirm New Password</label>
							<Input type='password' className='form-control' id='confirm_password' name='confirm_password' autoComplete='off' required />
						</div>

						<div className='form-group'>
							<div className='col'>
								<Button ref={submitRef} type='submit' className='btn btn-primary'>Submit</Button>
							</div>
						</div>
					</fieldset>
				</form>
			</div>
		</Content>
	)
}

export default ChangePassword;