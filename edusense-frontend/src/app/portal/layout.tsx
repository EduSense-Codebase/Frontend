'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    CustomPropContext,
    IAllEnrolledCourseResponse,
    ICoursePermissions,
    ICoursePermissionsResponse,
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
import { Toaster } from 'react-hot-toast';

const interClassName = 'font-inter';

interface IFetchInstitution {
    data: {
        name: string;
    };
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    const API_URL = API_PREFIX + AUTH_ENDPOINT;
    const COURSE_API_URL = API_PREFIX + COURSE_ENDPOINT;

    const [permissions, setPermissions] = useState<IPermissions>();
    const [coursePermissions, setCoursePermissions] = useState<ICoursePermissions>();
    const [institution, setInstitution] = useState<string>('');
    const [courses, setCourses] = useState<ICourse[]>([]);

    const [currCourseId, setCurrCourseId] = useState<number | undefined>(undefined);
    const [currBuilderId, setCurrBuilderId] = useState<number | undefined>(undefined);
    const [isBackgroundRunning, setIsBackgroundRunning] = useState<boolean>(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isBackgroundRunning) {
                return;
            }
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isBackgroundRunning]);

    useEffect(() => {
        const queryParams = {
            section: 'permissions',
        };

        const requestResponse = httpGet<IPermissionsResponse>(API_URL, queryParams);
        requestResponse.then((res) => {
            console.log('permissions', res.data);
            setPermissions(res.data.data);
        });

        const queryParamsInst = { section: 'institution' };
        const requestResponseInst = httpGet<IFetchInstitution>(API_URL, queryParamsInst);
        requestResponseInst.then((res) => {
            setInstitution(res.data.data.name);
        });

        const queryParamsCourse = {
            section: 'all_enrolled_courses',
        };
        const courseResponse = httpGet<IAllEnrolledCourseResponse>(
            COURSE_API_URL,
            queryParamsCourse,
        );
        courseResponse
            .then((response) => {
                // console.log("rspone: ", response.data);
                const orderedCourses = response.data.data.sort((a, b) => a.id - b.id);
                setCourses(orderedCourses);
            })
            .catch(() => {
                //FIXME: Add Error Handling
            });
    }, []);

    useEffect(() => {
        if (currCourseId != undefined) {
            console.log(currCourseId);
            // Fetch Course Permissions
            const queryParams = {
                section: 'course_permissions',
                course_id: currCourseId,
            };

            const requestResponse = httpGet<ICoursePermissionsResponse>(API_URL, queryParams);

            requestResponse.then((response) => {
                console.log('course perms', response.data);
                setCoursePermissions(response.data.data);
            });
        }
    }, [currCourseId]);

    return (
        <div
            id="main"
            className={`${interClassName} flex min-h-screen flex-col bg-white pl-[4rem] text-gray-800`}
        >
            {/* <JoyrideWrapper steps={mainSteps} seenKey="1" /> */}
            {/* Sidebar (fixed) */}
            <Sidebar courses={courses} />
            <Toaster position="top-right" />

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
                    <AIChatController
                        courseId={currCourseId}
                        builderId={currBuilderId}
                        setBackgroundRunning={setIsBackgroundRunning}
                    />
                ) : null}

                <CustomPropContext.Provider
                    value={{
                        permissions,
                        setPermissions,
                        coursePermissions,
                        setCoursePermissions,
                        institution,
                        setInstitution,
                        courses,
                        setCourses,
                        setCurrCourseId,
                        setCurrBuilderId,
                        setIsBackgroundRunning,
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
