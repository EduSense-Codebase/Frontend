// app/login/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from 'axios'


export default function RegisterPage(){
	const [form, setForm] = useState({name: '', email: '', password: '', age: ''});
	const router = useRouter()


	const handleRegister = (e: React.FormEvent) => {

		e.preventDefault()
		console.log("making account")
		axios.post("http://127.0.0.1:8000/api/auth/?type=signup", form, {
			headers: {
				'Content-Type':  'multipart/form-data'
			}
		}).then((response)=>{
			console.log("Successful")
			console.log(response.data)
		}).catch((err) => {
			console.log("Error")
			console.log(err)
		})
		router.push("/login")
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
		  <form onSubmit={handleRegister} className="bg-gray-400 p-8 rounded shadow-md w-full max-w-sm space-y-4">
			<h2 className="text-gray-700 font-semibold">Register</h2>
			<input
			  type="text"
			  placeholder="Name"
			  className="w-full border px-3 py-2 rounded text-gray-700"
			  value={form.name}
			  onChange={(e) => setForm({ ...form, name: e.target.value })}
			/>
			<input
			  type="email"
			  placeholder="Email"
			  className="w-full border px-3 py-2 rounded text-gray-700"
			  value={form.email}
			  onChange={(e) => setForm({ ...form, email: e.target.value })}
			/>
			<input
			  type="password"
			  placeholder="Password"
			  className="w-full border px-3 py-2 rounded text-gray-700"
			  value={form.password}
			  onChange={(e) => setForm({ ...form, password: e.target.value })}
			/>

			<input
			  type="text"
			  placeholder="Age"
			  className="w-full border px-3 py-2 rounded text-gray-700"
			  value={form.age}
			  onChange={(e) => setForm({ ...form, age: e.target.value })}
			/>
			<button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="submit">
			  Register
			</button>
		  </form>
		</div>
	  );


}