import {
	Button,
	Input,
	TextArea
} from '@/components/ui';
import { useAuthContext } from '@/hooks/useAuthContext';
import userService from '@/services/userService';
import { isValidEmail } from '@/utils/validation';
import { useId, useRef } from 'react';

import './EmailForm.scss';

const EmailForm = (props) => {
	let isProcessing 	= false;
	const { user } 		= useAuthContext();
	const formRef 		= useRef();
	const errorRef 		= useRef();
	const submitRef 	= useRef();
	const formId 		= 'email_form_' + useId();
	const params 		= props.params || {};
	const parent 		= props.parent || 'body';
	const succesMsg 	= props.success || 'Message sent successfully.';
	const errorMsg 		= props.success || 'Unable to send your email. Please try again shortly.';

	/**
	 * 
	 * @param {Event} e 
	 * @returns 
	 */
	const onSubmit = (e) => {
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
		const name 		= data[`${formId}-name`];
		const email 	= data[`${formId}-email`];
		const message 	= data[`${formId}-message`];

		if (!name || !email || !message) {
			error = 'All fields are required';

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

		/**
		 * Sends the email request
		 */
		const sendEmail = async () => {
			const data 		= Object.assign({}, {name, email, message}, params);
			const response 	= await userService.sendMail(data);

			if (response && response.status === 200) {
				formRef.current.reset();
				errorRef.current.textContent = '';
				errorRef.current.classList.add('hidden');

			} else {
				errorRef.current.textContent = errorMsg;
				errorRef.current.classList.remove('hidden');
			}

			submitRef.current.disabled = false;
			isProcessing = false;
		}

		sendEmail();
		return false;
	}

	return (
		<div className='email-form'>
			<div ref={errorRef} className='error mb-3 hidden'></div>

			<form ref={formRef} onSubmit={onSubmit}>
				<fieldset>
					<div className='mb-3'>
						<label className='form-label' htmlFor={`${formId}-name`}>Name</label>
						<Input className='form-control' id={`${formId}-name`} name={`${formId}-name`} type='text' required />
					</div>

					<div className='mb-3'>
						<label className='form-label' htmlFor={`${formId}-email`}>E-mail</label>
						<Input className='form-control' id={`${formId}-email`} name={`${formId}-email`} type='email' defaultValue={user?.email ?? ''} required />
					</div>

					<div className='mb-3'>
						<label className='form-label' htmlFor={`${formId}-message`}>Message</label>
						<TextArea className='form-control' id={`${formId}-message`} name={`${formId}-message`} rows='5' required></TextArea>
					</div>

					<div className='form-group'>
						<div className='col'>
							<Button ref={submitRef} type='submit' className='btn btn-primary'>Submit</Button>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	)
}

export default EmailForm;