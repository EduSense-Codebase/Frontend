'use client';

import React, { useState } from 'react';
import Button from '@/app/ui_components/Button';
import Input from '@/app/ui_components/Input';
import { useRouter } from 'next/navigation';
import { AUTH_ENDPOINT, API_PREFIX } from '../../global'; // Update to your actual path
import { httpPost } from '../../utils';

export default function Settings() {
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const router = useRouter();
    const API_URL = API_PREFIX + AUTH_ENDPOINT;

    const handleEmailChange = (value: string) => {
        setNewEmail(value);
    };

    const handlePasswordChange = (value: string) => {
        setNewPassword(value);
    };

    const handleSubmit = () => {
        const formData = {};

        const queryParams = { type: 'update' };

        const response = httpPost(API_URL, formData, queryParams);
        response
            .then((res) => {
                console.log(res.data);
                router.push('/portal/courses');
            })
            .catch((err) => {
                console.log(`Error: ${err}`);
            });

        //     axios
        //       .post(`${API_URL}${API_PREFIX}/?type=update`, formData, {
        //         headers: {
        //           Authorization: `Bearer ${token}`,
        //         },
        //       })
        //       .then((res) => {
        //         console.log('Updated successfully:', res.data);
        //         router.push('/settings');
        //       })
        //       .catch((err) => {
        //         console.error('Error updating user:', err);
        //       });
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account?');
        if (!confirmDelete) return;

        //implement delete wrapper function
        console.log('deleted');
        // axios
        //   .delete(`${API_URL}${API_PREFIX}`, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   })
        //   .then((res) => {
        //     if (res.status === 204) {
        //       console.log('User deleted successfully');
        //       onLogout();
        //       router.push('/');
        //     }
        //   })
        //   .catch((err) => {
        //     console.error('Error deleting user:', err);
        //   });
    };

    return (
        <section className="bg-gray mx-auto w-full max-w-3xl space-y-6 rounded-xl p-6 text-gray-700 shadow">
            <h2 className="text-2xl font-bold">Settings</h2>

            {/* Change Email */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Change Email</h3>
                <div className="flex items-center space-x-2">
                    <Input
                        id="settings-email"
                        type="email"
                        value={newEmail}
                        placeholder="Enter new email"
                        onChange={(newEmail) => handleEmailChange(newEmail)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
                    />
                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-blue-600 px-4 py-2 whitespace-nowrap text-white hover:bg-blue-700"
                    >
                        Update Email
                    </button>
                </div>
            </div>

            <hr />

            {/* Change Password */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Change Password</h3>
                <div className="flex items-center space-x-2">
                    <Input
                        id="settings-password"
                        type="password"
                        value={newPassword}
                        placeholder="Enter new password"
                        onChange={(newPassword) => handlePasswordChange(newPassword)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
                    />
                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-blue-600 px-4 py-2 whitespace-nowrap text-white hover:bg-blue-700"
                    >
                        Update Password
                    </button>
                </div>
            </div>

            <hr />

            {/* Delete Account */}
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-600">Delete Account</h3>
                <Button onClick={handleDelete} displayName="Delete Account" variant="danger" />
            </div>
        </section>
    );
}
