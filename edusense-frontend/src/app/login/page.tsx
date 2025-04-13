'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_PREFIX, AUTH_ENDPOINT } from "../global";
import { httpPost } from "../utils";
import Form, { IFormFieldBase } from "../ui_components/Form";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();

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

	
	const response = httpPost(apiUrl, form, queryParams);
	response.then((response) => {
		console.log("Login successful:", response.data);
		router.push("/courses");

	}).catch((err) => {
		console.log("WHY")
		console.log(err)
	})

};

return (
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
		/>
);
}
