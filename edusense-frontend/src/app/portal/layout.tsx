'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    CustomPropContext,
    IAllEnrolledCourseResponse,
    IPermissions,
    IPermissionsResponse,
} from '../typedef';
import Logout from '../ui_components/Logout';
import Image from 'next/image';
import { httpGet } from '../utils';
import { API_PREFIX, AUTH_ENDPOINT, COURSE_ENDPOINT } from '../global';

import Sidebar from '../ui_components/Sidebar/Sidebar';
import { ICourse } from '../typedef';
import AIChatController from '../Pages/AIChat/AIChatController';

const interClassName = 'font-inter';

interface IFetchInstitution {
    data: {
        name: string;
    };
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    //   const router = useRouter();
    const [permissions, setPermissions] = useState<IPermissions>();
    const [institution, setInstitution] = useState<string>('');
    const [courses, setCourses] = useState<ICourse[]>([]);

    const [currCourseId, setCurrCourseId] = useState<number | undefined>(undefined);
    const [currBuilderId, setCurrBuilderId] = useState<number | undefined>(undefined);

    useEffect(() => {
        //refreshXP();
        //console.log(userXP);

        const API_URL = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = {
            section: 'permissions',
        };

        const requestResponse = httpGet<IPermissionsResponse>(API_URL, queryParams);
        requestResponse.then((res) => {
            console.log('persmissions', res.data);
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
        const requestResponseInst = httpGet<IFetchInstitution>(API_URL, queryParamsInst);
        requestResponseInst.then((res) => {
            //console.log(res.data);
            setInstitution(res.data.data.name);
        });
    }, []);

    return (
        <div
            id="main"
            className={`${interClassName} flex min-h-screen flex-col bg-white pl-[4rem] text-gray-800`}
        >
            {/* <JoyrideWrapper steps={mainSteps} seenKey="1" /> */}
            {/* Sidebar (fixed) */}
            <Sidebar courses={courses} />

            <header id="dashboard-nav" className="sticky top-0 z-8 bg-white shadow-sm">
                <div className="z-40 mx-auto flex items-center justify-between bg-white px-4 py-4">
                    <Link
                        href="/portal/courses"
                        className="text-2xl font-bold text-blue-600"
                        id="dashboard-nav"
                    >
                        <Image src="/EduSense-Sample-Logo.png" alt="Logo" width={120} height={0} />
                    </Link>

                    <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
                        {/* <Link href="/portal/profile" className="ml-3 hover:text-gray-900">
                            Profile
                        </Link> */}

                        <Link href="/portal/settings" className="hover:text-gray-900">
                            Settings
                        </Link>
                        <Logout />
                    </nav>
                </div>
            </header>

            <main className="mx-auto flex h-full min-h-screen w-full bg-white px-4 py-4">
                {currCourseId ? (
                    <AIChatController courseId={currCourseId} builderId={currBuilderId} />
                ) : null}

                <CustomPropContext.Provider
                    value={{
                        permissions,
                        setPermissions,
                        institution,
                        setInstitution,
                        courses,
                        setCourses,
                        setCurrCourseId,
                        setCurrBuilderId,
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
