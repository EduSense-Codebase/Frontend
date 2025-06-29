'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_PREFIX, AUTH_ENDPOINT } from '../global';

export default function Navbar() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in (example: via session or backend)
        axios
            .get(API_PREFIX + AUTH_ENDPOINT)
            .then(() => {
                setLoggedIn(true);
            })
            .catch(() => {
                setLoggedIn(false);
            });
    }, []);

    const handleLogout = () => {
        setLoggedIn(false);
    };

    return (
        <nav className="flex w-full items-center justify-between bg-white px-6 py-4 shadow-md">
            <Link href="/" className="text-2xl font-bold text-blue-600">
                EduSense
            </Link>

            <div className="space-x-4">
                {!loggedIn ? (
                    <>
                        <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                            Login
                        </Link>
                        <Link href="/auth/register" className="text-gray-700 hover:text-blue-600">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/home" className="text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                            Profile
                        </Link>
                        <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
