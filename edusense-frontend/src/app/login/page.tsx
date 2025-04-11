// app/login/page.tsx
'use client';

import { useState } from "react";
//import axios from 'axios'

export default function LoginPage(){
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		console.log("logging in")
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
		  <form onSubmit={handleLogin} className="bg-gray-400 p-8 rounded shadow-md w-full max-w-sm space-y-4">
			<h2 className="text-gray-800 font-semibold">Login</h2>
			<input
			  type="email"
			  placeholder="Email"
			  className="w-full border px-3 py-2 rounded text-gray-800"
			  value={email}
			  onChange={(e) => setEmail(e.target.value)}
			/>
			<input
			  type="password"
			  placeholder="Password"
			  className="w-full border px-3 py-2 rounded text-gray-800"
			  value={password}
			  onChange={(e) => setPassword(e.target.value)}
			/>
			<button className="bg-blue-600 text-gray-800 px-4 py-2 rounded w-full" type="submit">
			  Login
			</button>
		  </form>
		</div>
	  );


}