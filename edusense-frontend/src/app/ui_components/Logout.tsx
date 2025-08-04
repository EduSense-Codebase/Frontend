'use client';

import { useRouter } from 'next/navigation';
import { API_PREFIX, AUTH_ENDPOINT } from '../global';
import { httpPost } from '../utils';
import Button from './Button';

export default function Logout() {
    const router = useRouter();
    const apiUrl = API_PREFIX + AUTH_ENDPOINT;
    const queryParams = {
        section: 'logout',
    };
    const formData = {};
    console.log('POSTing to:', apiUrl);

    const handleLogout = () => {
        const response = httpPost(apiUrl, formData, queryParams);
        response.then((response) => {
            console.log(response);
        });

        router.push('/auth/login');
    };

    return (
        <>
            <Button onClick={handleLogout} displayName="Logout" />
        </>
    );
}
