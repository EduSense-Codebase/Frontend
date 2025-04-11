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
		<form
      onSubmit={handleRegister}
      className="w-full max-w-lg bg-white border border-gray-300 p-8 rounded-xl shadow-sm w-full max-w-md mx-auto space-y-5"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Register</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Age"
        className="w-full border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
      >
        Register
      </button>
    </form>
	  );
}