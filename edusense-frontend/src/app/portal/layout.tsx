'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { Step } from 'react-joyride';
import ChatWidget from '../ui_components/ChatWidget';
import { IPointsRespones, IQuiz, IPermissions, IPermissionsResponse } from '../typedef';
import Logout from '../ui_components/Logout';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { httpGet } from '../utils';
import { API_PREFIX, AUTH_ENDPOINT } from '../global';

import dynamic from 'next/dynamic';
import { request } from 'http';
const JoyrideWrapper = dynamic(() => import('@/app/ui_components/JoyrideWrapper'), { ssr: false });

interface ICustomProps {
    permissions: IPermissions | undefined;
    setPermissions: React.Dispatch<React.SetStateAction<IPermissions | undefined>>;
    institution: string;
    setInstitution: React.Dispatch<React.SetStateAction<string>>;
}

const mainSteps: Step[] = [
    {
        target: 'body',
        placement: 'center',
        content:
            'Welcome to Edusense! This quick tutorial will help you get comfortable with the platform, so you can start learning right away.',
        disableBeacon: true,
    },

    {
        target: '#dashboard-nav',
        content:
            'This is your dashboard nav. Here you can view your progress bar and your current level, and you can log off.',
        disableBeacon: true,
    },
    {
        target: '#start-course-nav',
        placement: 'top',
        content:
            'Down here is where you can enroll and unenroll in different courses, ranging from math, science, writing, and many more!',
        disableBeacon: true,
    },
    {
        target: '#enroll-course-tile',
        content: 'Click here to enroll in your first course!',
        disableBeacon: true,
    },
];

const CustomPropContext = React.createContext<ICustomProps | undefined>(undefined);
export const useCustomProp = () => {
    const value = React.useContext(CustomPropContext);
    if (value === undefined) {
        throw new Error('useCustomProp must be used within a CustomPropProvider');
    }
    return value;
};

const interClassName = 'font-inter';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    //   const router = useRouter();
    const [permissions, setPermissions] = useState<IPermissions>();
    const [institution, setInstitution] = useState<string>('');

    useEffect(() => {
        //refreshXP();
        //console.log(userXP);

        const API_URL = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = {
            section: 'permissions',
        };

        const requestResponse = httpGet<IPermissionsResponse>(API_URL, queryParams);
        requestResponse.then((res) => {
            console.log(res.data);
            setPermissions(res.data.data);
        });

        const queryParamsInst = { section: 'institution' };
        const requestResponseInst = httpGet<string>(API_URL, queryParamsInst);
        requestResponseInst.then((res) => {
            console.log(res.data);
            setInstitution(res.data.data.name);
        });
    }, []);

    const showChatWidget = pathname.endsWith('/portal/courses');

    return (
        <div
            id="main"
            className={`${interClassName} flex min-h-screen flex-col bg-white text-gray-800`}
        >
            {/* <JoyrideWrapper steps={mainSteps} seenKey="1" /> */}

            <header id="dashboard-nav" className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="z-40 mx-auto flex items-center justify-between bg-white px-4 py-4">
                    <Link
                        href="/portal/courses"
                        className="text-2xl font-bold text-blue-600"
                        id="dashboard-nav"
                    >
                        <Image src="/EduSense-Sample-Logo.png" alt="Logo" width={120} height={0} />
                    </Link>

                    <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">

                        <Link href="/portal/profile" className="ml-3 hover:text-gray-900">
                            Profile
                        </Link>

                        <Link href="/portal/settings" className="hover:text-gray-900">
                            Settings
                        </Link>
                        <Logout />
                    </nav>
                </div>
            </header>

            <main className="mx-auto flex h-full min-h-screen w-full bg-white px-4 py-4">
                {!showChatWidget && (
                    <ChatWidget
                    />
                )}
                <CustomPropContext.Provider
                    value={{
                        permissions,
                        setPermissions,
                        institution,
                        setInstitution,
                    }}
                >
                    {children}
                </CustomPropContext.Provider>
            </main>

            <footer className="mt-12 border-t bg-white py-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Edusense. All rights reserved.
            </footer>
        </div>
    );
}
