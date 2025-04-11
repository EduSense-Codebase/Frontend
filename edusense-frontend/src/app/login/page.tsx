// app/login/page.tsx
'use client';

import { useState } from "react";
//import axios from 'axios'
import { API_PREFIX, AUTH_ENDPOINT } from "../global";
import { httpPost } from "../utils";
import { useRouter } from "next/navigation";

export default function LoginPage(){
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

  const router = useRouter()
  const handleLogin = (e: React.FormEvent) => {
		e.preventDefault()
		console.log("logging in")
    const apiUrl = API_PREFIX + AUTH_ENDPOINT;
		const queryParams = {
			type: "signin"
		}
    const form = new FormData
    form.append("email", email)
    form.append("password", password)


		const signupPromise = httpPost(apiUrl, form, queryParams)

		signupPromise.then((response) => {
			console.log("Successfull");
			console.log(response.data);
      router.push("/courses")
		}).catch((err) => {
			console.log("Error")
			console.log(err)
		})

	}

	return (
		<form
      className="w-full max-w-lg bg-white border border-gray-300 p-8 rounded-xl shadow-sm w-full max-w-md mx-auto space-y-5"
      onSubmit={handleLogin}
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Log In</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={ (e)=> setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={ (e)=> setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
      >
        Log In
      </button>
    </form>
	  );


}