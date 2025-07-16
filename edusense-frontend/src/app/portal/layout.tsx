'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Step } from 'react-joyride';
import ChatWidget from '../ui_components/ChatWidget';
import { IPointsRespones, IQuiz } from '../typedef';
import Logout from '../ui_components/Logout';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { httpGet } from '../utils';
import { API_PREFIX, AUTH_ENDPOINT } from '../global';

import dynamic from 'next/dynamic';
const JoyrideWrapper = dynamic(() => import('@/app/ui_components/JoyrideWrapper'), { ssr: false });

interface IPageContext {
    pageContext: string;
    quiz?: IQuiz | null;
    article?: string | null;
    roadmap?: string;
}

interface ICustomProps {
    context: IPageContext;
    enrollmentId: number;
    setContext: React.Dispatch<React.SetStateAction<IPageContext>>;
    setEnrollmentId: React.Dispatch<React.SetStateAction<number>>;
    setUserSelection: React.Dispatch<React.SetStateAction<string>>;
    refreshXP: () => void;
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

    const [context, setContext] = useState<IPageContext>({
        pageContext: '',
        quiz: null,
        article: '',
    });

    const [enrollmentId, setEnrollmentId] = useState(-1);
    const [userSelection, setUserSelection] = useState('');
    const [userXP, setUserXP] = useState({
        points: 0,
        level: 1,
        currentThreshold: 0,
        nextThreshold: 50,
    });

    useEffect(() => {
        refreshXP();
        //console.log(userXP);
    }, []);

    const refreshXP = () => {
        const url = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = { type: 'get_points' };
        const requestResponse = httpGet<IPointsRespones>(url, queryParams);

        requestResponse.then((response) => {
            console.log(response.data.data);
            setUserXP({
                points: response.data.data.points,
                level: response.data.data.level,
                currentThreshold: response.data.data.current_threshold,
                nextThreshold: response.data.data.next_threshold,
            });
        });
    };

    const showChatWidget = pathname.endsWith('/portal/courses');

    return (
        <div
            id="main"
            className={`${interClassName} flex min-h-screen flex-col bg-white text-gray-800`}
        >
            <JoyrideWrapper steps={mainSteps} seenKey="1" />

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
                        <div
                            className="mr-4 flex flex-col items-end text-sm text-gray-800"
                            id="course-progress-bar"
                        >
                            <span className="font-semibold">Lvl {userXP.level}</span>
                            <div className="relative h-2 w-28 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="absolute top-0 left-0 h-full rounded-full bg-blue-500"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            ((userXP.points - userXP.currentThreshold) /
                                                (userXP.nextThreshold - userXP.currentThreshold)) *
                                                100,
                                        )}%`,
                                    }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">
                                {userXP.points} / {userXP.nextThreshold}
                            </span>
                        </div>

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

            <main className="mx-auto flex h-full min-h-screen w-full bg-white px-4 py-12">
                {!showChatWidget && (
                    <ChatWidget
                        pageContext={context.pageContext}
                        enrollmentId={enrollmentId}
                        quiz={context.quiz}
                        article={context.article}
                        userSelection={userSelection}
                    />
                )}
                <CustomPropContext.Provider
                    value={{
                        context,
                        setContext,
                        enrollmentId,
                        setEnrollmentId,
                        setUserSelection,
                        refreshXP,
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
