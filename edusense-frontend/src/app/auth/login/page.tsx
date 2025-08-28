'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_PREFIX, AUTH_ENDPOINT } from '../../global';
import { httpPost } from '../../utils';
import Form, { IFormFieldBase } from '../../ui_components/Form';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const fields: IFormFieldBase[] = [
        {
            type: 'email',
            placeholder: 'Enter your email',
            value: email,
            callbackID: 'email',
            label: 'Email',
            className: 'login-input',
        },
        {
            type: 'password',
            placeholder: 'Enter your password',
            value: password,
            callbackID: 'password',
            label: 'Password',
            className: 'login-input',
        },
    ];

    const handleFieldChange = (id: string, val: string) => {
        if (id === 'email') setEmail(val);
        if (id === 'password') setPassword(val);
    };

    const handleLogin = () => {
        //e.preventDefault();
        const apiUrl = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = { section: 'signin' };

        // const form = new FormData();
        // form.append("email", email);
        // form.append("password", password);

        const form = {
            email: email,
            password: password,
        };

        httpPost(apiUrl, form, queryParams)
            .then((response) => {
                console.log('Login successful:', response.data);
                router.push('/portal/courses');
            })
            .catch((err) => {
                console.log('WHY');
                console.log(err);
            });
    };

    return (
        <div className="mx-auto w-full max-w-md">
            <Form
                metadata={{
                    heading: 'Login',
                    formClassName:
                        'w-full bg-white border border-gray-300 p-8 rounded-xl shadow-sm space-y-5',
                    inputGroupClassName: 'space-y-1',
                }}
                fields={fields}
                callbackFunc={handleFieldChange}
                submitCallback={handleLogin}
                submitDisplayName="Login"
            />

            {/* Footer Text BELOW the login box */}
            <div className="mt-4 text-center text-sm text-gray-500">
                Don’t have an account?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:underline">
                    Sign up here!
                </Link>
            </div>
        </div>
    );
}
