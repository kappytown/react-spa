import Content from '@/components/Content';
import {
	Button,
	Input
} from '@/components/ui';
import useNavigate from '@/hooks/useNavigate';
import Header from '@/pages/components/Header';
import userService from '@/services/userService';
import { isValidEmail, isValidPassword, validatePassword } from '@/utils/validation';
import { useRef, useState } from 'react';

import './SignUp.scss';

const TITLE = 'Sign Up';

const SignUp = () => {
	const navigate 				= useNavigate();
	const [ error, setError ] 	= useState('');
	const formRef 				= useRef();
	const submitRef 			= useRef();
	let isProcessing 			= false;

	/**
	 * Creates a new user
	 * 
	 * @param {Object} user 
	 */
	const createUser = async(user) => {
		const results = await userService.create(user);

		if (results?.status === 200) {
			setError('User created successfully! You will be redirected to the Login page shortly.');
			formRef.current.reset();
			setTimeout(() => {
				navigate('login/');
			}, 5000);
		} else {
			setError(results?.message || 'Unable to create user, please try again.');
		}
		
		isProcessing = false;
		submitRef.current.disabled = false;
	}

	/**
	 * Validates the user input before creating the new user
	 * 
	 * @param {Event} e 
	 */
	const handleSubmit = (e) => {
		e.preventDefault();

		if (isProcessing) return;
		isProcessing = true;

		const formData 	= new FormData(formRef.current);
		const user 		= {};

		for (let [ key, value ] of formData.entries()) {
			user[key] = value.trim();
		}

		let errorMsg 	= '';
		const name 		= user['name'].trim();
		const email 	= user['email'].trim();
		const password 	= user['password'].trim();

		if (!name || !email || !password) {
			errorMsg = 'All fields are required';

		} else if (!isValidEmail(email)) {
			errorMsg = 'Email is invalid';

		} else if (!isValidPassword(password)) {
			const errors = validatePassword(password);
			errorMsg = <><strong>Password must contain:</strong>{errors.map((e, i) => (<div key={i}>{e}</div>))}</>
		}

		if (errorMsg) {
			setError(errorMsg);

			isProcessing = false;
			return false;
		}
		setError('');

		submitRef.current.disabled = true;

		createUser(user);
	}

	return (
		<Content id='sign_up'>
			{/* Header Section */}
			<Header title={TITLE} />

			<div className='signup-form'>
				{error !== '' && (<div className='error mb-3'>{error}</div>)}

				<form ref={formRef} onSubmit={handleSubmit}>
					<fieldset>
						<div className='mb-3'>
							<label className='form-label' htmlFor='name'>Name</label>
							<Input type='text' className='form-control' id='name' name='name' required />
						</div>

						<div className='mb-3'>
							<label className='form-label' htmlFor='email'>E-mail</label>
							<Input type='email' className='form-control' id='email' name='email' autoComplete='off' required />
						</div>

						<div className='mb-3'>
							<label className='form-label' htmlFor='password'>Password</label>
							<Input type='password' className='form-control' id='password' name='password' autoComplete='off' required />
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

export default SignUp;