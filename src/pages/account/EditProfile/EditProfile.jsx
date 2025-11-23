import Content from '@/components/Content';
import {
	Button,
	Input
} from '@/components/ui';
import { useAuthContext } from '@/hooks/useAuthContext';
import Header from '@/pages/components/Header';
import userService from '@/services/userService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { isValidEmail } from '@/utils/validation';
import { useEffect, useRef, useState } from 'react';

import './EditProfile.scss';

const TITLE = 'Edit Profile';

const EditProfile = (props) => {
	const { user, dispatch } 		= useAuthContext();
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
		const results 	= await userService.update({ id: user.id, ...data });
		let message 	= '';
		
		if (results?.success === true) {
			message = 'User updated successfully!';

			// Update the user in AuthContext
			dispatch({ type: 'UPDATE', payload: data });
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

		let error 		= '';
		const name 		= data['name'];
		const email 	= data['email'];

		if (!name || !email) {
			error = 'All fields must have a value';

		} else if (!isValidEmail(email)) {
			error = 'Email is invalid';
		}

		if (error) {
			errorRef.current.textContent = error;
			errorRef.current.classList.remove('hidden');

			isProcessing = false;
			return false;
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

			<div>
				<div ref={errorRef} className='error mb-3 hidden'></div>

				<form ref={formRef} onSubmit={handleSubmit}>
					<fieldset>
						<div className='mb-3'>
							<label className='form-label' htmlFor='name'>Name</label>
							<Input type='text' className='form-control' id='name' name='name' defaultValue={user.name} required />
						</div>

						<div className='mb-3'>
							<label className='form-label' htmlFor='email'>E-mail</label>
							<Input type='email' className='form-control' id='email' name='email' defaultValue={user.email} autoComplete='off' required />
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

export default EditProfile;