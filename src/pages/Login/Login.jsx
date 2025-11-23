import Content from '@/components/Content';
import {
	Button,
	Input
} from '@/components/ui';
import useNavigate from '@/hooks/useNavigate';
import authService from '@/services/authService';
import eventEmitter, { EVENTS } from '@/utils/eventEmitter';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

import './Login.scss';

const Login = (props) => {
	const navigate 				= useNavigate();
	const location 				= useLocation();
	const [ path, setPath ] 	= useState('/home');
	const [ error, setError ] 	= useState('');
	const formRef 				= useRef();
	const submitRef 			= useRef();

	/**
	 * 
	 * @param {Event} e 
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();

		const data 		= {};
		const formData 	= new FormData(formRef.current);
		
		for (const [ key, value ] of formData.entries()) {
			data[key] = value.trim();
		}
		
		if (!data.email || !data.password) {
			setError('Member ID and Password are required.');
			return;
		}

		submitRef.current.disabled = true;

		eventEmitter.emit(EVENTS.LOADER_SHOW);
		
		const response 	= await authService.login({ email: data.email, password: data.password });
		let errorMsg 	= response?.message || '';
		const status 	= response?.status || 500;
		
		if (status === 200) {
			if (!errorMsg) {
				navigate(path);
				
				// This event will trigger the App to get the session data
				eventEmitter.emit(EVENTS.LOGGED_IN);
			}
		} else {
			errorMsg = errorMsg || 'Unable to login, please try again.';
			if ([401, 403].includes(status)) {
				errorMsg = 'Invalid email or password';
			}
		}

		setError(errorMsg);
		submitRef.current.disabled = false;
		eventEmitter.emit(EVENTS.LOADER_HIDE);

		return false;
	};

	useEffect(() => {
		// location.state.from is set in ProtectedRoute and equals the current location before redirection to login
		const from = location.state && location.state.from ? location.state.from :  path;
		setPath(from !== '/login' ? from : '/home');
	}, []);

	return (
		<Content id='login'>
			<div className='login-form'>
				<div className='logo'>
					<img src='assets/img/app_icon.png' />
					<span className='simple'>Simple</span><span className='app'>App</span>
				</div>

				{error && <div className='error mb-3'>{error}</div>}

				<form ref={formRef} onSubmit={handleSubmit}>
					<div className='mb-3'>
						<label htmlFor='email' className='form-label'>Email Address</label>
						<Input type='email' className='form-control form-control-lg' id='email' name='email' autoComplete='off' defaultValue='test@test.com' />
					</div>

					<div className='mb-3'>
						<label htmlFor='password' className='form-label'>Password</label>
						<Input type='password' className='form-control form-control-lg' id='password' name='password' autoComplete='off' defaultValue='Password!1' />
					</div>

					<Button ref={submitRef} type='submit' className='btn btn-primary login'>Login</Button>
				</form>
			</div>
		</Content>
	)
};

export default Login;