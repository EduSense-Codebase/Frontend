'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Step } from 'react-joyride';
import ChatWidget from '../ui_components/AIChat/ChatWidget';
import { IAllEnrolledCourseResponse, IPermissions, IPermissionsResponse } from '../typedef';
import Logout from '../ui_components/Logout';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { httpGet } from '../utils';
import { API_PREFIX, AUTH_ENDPOINT,COURSE_ENDPOINT } from '../global';


import dynamic from 'next/dynamic';
import Sidebar from '../ui_components/Sidebar/Sidebar';
import { ICourse } from '../typedef';

const JoyrideWrapper = dynamic(() => import('@/app/ui_components/JoyrideWrapper'), { ssr: false });

interface ICustomProps {
    permissions: IPermissions | undefined;
    setPermissions: React.Dispatch<React.SetStateAction<IPermissions | undefined>>;
    institution: string;
    setInstitution: React.Dispatch<React.SetStateAction<string>>;
    courses: ICourse[];
    setCourses:React.Dispatch<React.SetStateAction<ICourse[]>>;
    setCurrCourseId: React.Dispatch<React.SetStateAction<number | undefined>>;
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
    const [courses, setCourses] = useState<ICourse[]>([]);

    const [currCourseId, setCurrCourseId] = useState<number | undefined>(undefined);

    useEffect(() => {
        //refreshXP();
        //console.log(userXP);

        const API_URL = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = {
            section: 'permissions',
        };

        const requestResponse = httpGet<IPermissionsResponse>(API_URL, queryParams);
        requestResponse.then((res) => {
            console.log("persmissions", res.data);
            setPermissions(res.data.data);
            const courseApiUrl = API_PREFIX + COURSE_ENDPOINT;
            console.log(permissions?.create_course);

            const queryParams = {
                section: res.data.data.join_course
                    ? 'all_enrolled_courses'
                    : res.data.data.create_course 
                    ? 'all_created_courses'
                    : 'null',
            };

            const courseResponse = httpGet<IAllEnrolledCourseResponse>(courseApiUrl, queryParams);

            courseResponse
                .then((response) => {
                    console.log(response);
                    setCourses(response.data.data);
                })
                .catch((err) => {
                    //FIXME: Add Error Handling
                    console.log(err);
                });
        });

        const queryParamsInst = { section: 'institution' };
        const requestResponseInst = httpGet<string>(API_URL, queryParamsInst);
        requestResponseInst.then((res) => {
            //console.log(res.data);
            setInstitution(res.data.data.name);
        });
    }, []);

    const showChatWidget = pathname.endsWith('/portal/courses');

    return (
        <div
            id="main"
            className={`${interClassName} flex min-h-screen flex-col bg-white text-gray-800 pl-[4rem]`}
        >
            {/* <JoyrideWrapper steps={mainSteps} seenKey="1" /> */}
            {/* Sidebar (fixed) */}
            <Sidebar courses={courses}/>

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
                {currCourseId ? (
                    <ChatWidget courseId={currCourseId} />
                ): null}

                <CustomPropContext.Provider
                    value={{
                        permissions,
                        setPermissions,
                        institution,
                        setInstitution,
                        courses,
                        setCourses,
                        setCurrCourseId,
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
