// app/login/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import { API_PREFIX, AUTH_ENDPOINT } from "../global";
import { httpPost } from "../utils";

export default function RegisterPage(){
	const [form, setForm] = useState({name: '', email: '', password: '', age: ''});
	const router = useRouter()


	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault()

		let apiUrl = API_PREFIX + AUTH_ENDPOINT;
		let queryParams = {
			type: "signup"
		}
		let signupPromise = httpPost(apiUrl, form, queryParams)

		signupPromise.then((response) => {
			console.log("Successfull");
			console.log(response.data);
		}).catch((err) => {
			console.log("Error")
			console.log(err)
		})

		router.push("/login")
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
			<form
				onSubmit={handleRegister}
				className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">

				<h2 className="text-2xl font-bold text-gray-800 text-center">Create Your Account</h2>
				<div className="space-y-4">
					<input
						type="text"
						placeholder="Full Name"
						className="w-full border border-gray-300 px-4 py-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
					/>
					<input
						type="email"
						placeholder="Email Address"
						className="w-full border border-gray-300 px-4 py-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full border border-gray-300 px-4 py-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
					/>
					<input
						type="text"
						placeholder="Age"
						className="w-full border border-gray-300 px-4 py-2 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={form.age}
						onChange={(e) => setForm({ ...form, age: e.target.value })}
					/>
				</div>

				<button
				type="submit"
				className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-xl"
				>
					Register
				</button>
			</form>
		</div>
	  );
}