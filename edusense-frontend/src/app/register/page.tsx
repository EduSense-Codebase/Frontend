'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Form, { IFormFieldBase } from '../ui_components/Form';
import { API_PREFIX, AUTH_ENDPOINT } from '../global';
import { httpPost } from '../utils';

const Register: React.FC = () => {
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const router = useRouter();

	const fields: IFormFieldBase[] = [
	{
		type: 'text',
		placeholder: 'Enter your first name',
		value: fname,
		callbackID: '1',
		label: 'First Name',
	},
	{
		type: 'text',
		placeholder: 'Enter your last name',
		value: lname,
		callbackID: '2',
		label: 'Last Name',
	},
	{
		type: 'email',
		placeholder: 'Enter your email',
		value: email,
		callbackID: '3',
		label: 'Email',
	},
	{
		type: 'password',
		placeholder: 'Enter your password',
		value: password,
		callbackID: '4',
		label: 'Password',
	},
	];

	const handleFieldChange = (id: string, value: string) => {
		if (id === '1') {
			setFname(value);
		} else if (id === '2') {
			setLname(value);
		} else if (id === '3') {
			setEmail(value);
		} else if (id === '4') {
			setPassword(value);
		}
	};

	const handleSubmit = () => {
		const API_URL = API_PREFIX + AUTH_ENDPOINT;
		const formData = {
			name: fname + " " + lname,
			email: email,
			password: password,
			age: 10
		};
		const queryParams = {
			type: "signup"
		}
		const registerPromise = httpPost(API_URL, formData, queryParams);

		registerPromise.then((response) => {
			console.log("Successfully Registered")
			console.log(response.data)
			router.push('/login');
		}).catch((err) => {
			console.log("Something went wrong while registering")
			console.log(err)
		})
	};

	return (
		<Form
		metadata={{
			heading: 'Register',
			formClassName:
			'w-full max-w-lg bg-white border border-gray-300 p-8 rounded-xl shadow-sm w-full max-w-md mx-auto space-y-5',
			inputGroupClassName: 'space-y-1',
		}}
		fields={fields}
		callbackFunc={handleFieldChange}
		submitCallback={handleSubmit}
		submitDisplayName="Register"
		/>
	);
};

export default Register;
