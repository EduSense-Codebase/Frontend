'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is logged in (example: via session or backend)
    axios.get('http://127.0.0.1:8000/api/auth')
      .then(res => {
        setLoggedIn(true);
        setUsername(res.data.name); // customize depending on response
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
        setLoggedIn(false);
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">EduSense</Link>

      <div className="space-x-4">
        {!loggedIn ? (
          <>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        ) : (
          <>
            <Link href="/home" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
