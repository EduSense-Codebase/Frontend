'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_PREFIX, AUTH_ENDPOINT, GOOGLE_CLIENT_ID } from "../../global";
import { httpPost } from "../../utils";
import Form, { IFormFieldBase } from "../../ui_components/Form";

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { CredentialResponse } from '@react-oauth/google';

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();
const [loginError, setLoginError] = useState(false);


const fields: IFormFieldBase[] = [
	{
	type: "email",
	placeholder: "Enter your email",
	value: email,
	callbackID: "email",
	label: "Email",
	className: "login-input",
	},
	{
	type: "password",
	placeholder: "Enter your password",
	value: password,
	callbackID: "password",
	label: "Password",
	className: "login-input",
	},
];

const handleFieldChange = (id: string, val: string) => {
	if (id === "email") setEmail(val);
	if (id === "password") setPassword(val);
};

const handleLogin = () => {
	//e.preventDefault();
	const apiUrl = API_PREFIX + AUTH_ENDPOINT;
	const queryParams = { type: "signin" };

	// const form = new FormData();
	// form.append("email", email);
	// form.append("password", password);

	const form = {
		"email": email,
		"password": password
	};

	httpPost(apiUrl, form, queryParams)
		.then((response) => {
			console.log("Login successful:", response.data);
			setLoginError(false);
			router.push("/portal/courses");
		})
		.catch((err) => {
			console.log("Login failed:", err);
			setLoginError(true);
		});
};

const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
	const apiUrl = API_PREFIX + AUTH_ENDPOINT;
	const formData = {
			provider: "google",
			credential: credentialResponse.credential,
		};
	const queryParams = {
		type: "third_party_signin"
	}

	
	const response = httpPost(apiUrl, formData, queryParams);
	response.then((response) => {
		console.log("Login successful:", response.data);
		router.push("/portal/courses");

	}).catch((err) => {
		console.log("WHY")
		console.log(err)
	})
}

return (
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<Form
		metadata={{
			heading: 'Login',
			formClassName:
			'w-full max-w-lg bg-white border border-gray-300 p-8 rounded-xl shadow-sm w-full max-w-md mx-auto space-y-5',
			inputGroupClassName: 'space-y-1',
		}}
		fields={fields}
		callbackFunc={handleFieldChange}
		submitCallback={handleLogin}
		submitDisplayName="Login"
		extraComponents={<GoogleLogin onSuccess={handleGoogleLogin} />}
		/>
		{loginError && (
			<p className="text-red-600 text-sm text-center mt-2">
				Invalid email or password. Please try again.
			</p>
		)}
		</GoogleOAuthProvider>
		
);
}
