// app/layout.tsx
'use client';
import '../globals.css';
import React, { useState, useEffect } from "react";
import { Inter } from 'next/font/google';
import Link from 'next/link';
import ChatWidget from '../ui_components/ChatWidget';
import { IPointsRespones, IQuiz } from '../typedef';
import Logout from '../ui_components/Logout';
import { usePathname } from 'next/navigation'
import Image from 'next/image';
import { httpGet } from '../utils';
import { API_PREFIX, AUTH_ENDPOINT } from '../global';


const inter = Inter({ subsets: ['latin'] });

interface IPageContext {
    pageContext: string;
    quiz?: IQuiz | null;
    article?: string | null ;
    roadmap?: string;
}

interface ICustomProps {
    context: IPageContext;
    enrollmentId: number
    setContext: React.Dispatch<React.SetStateAction<IPageContext>>;
    setEnrollmentId: React.Dispatch<React.SetStateAction<number>>;
    setUserSelection: React.Dispatch<React.SetStateAction<string>>;
    refreshXP: () => void;
}


const CustomPropContext = React.createContext<ICustomProps | undefined>(undefined);
export const useCustomProp = () => {
  const value = React.useContext(CustomPropContext);
  if (value === undefined) {
    throw new Error('useCustomProp must be used within a CustomPropProvider');
  }
  return value;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [context, setContext] = useState<IPageContext>({
        pageContext: "",
        quiz: null,
        article: "",
    });
    const [enrollmentId, setEnrollmentId] = useState(-1);
    const showChatWidget = pathname.endsWith('/portal/courses');
    const [userSelection, setUserSelection] = useState("");

      // XP + Level state
      const [userXP, setUserXP] = useState({
        points: 0,
        level: 1,
        currentThreshold: 0,
        nextThreshold: 100,
    });

    const refreshXP = () => {
        // try {
        //     const res = await fetch('/api/user/xp');
        //     const data = await res.json();
        //     setUserXP({
        //         points: data.points,
        //         level: data.level,
        //         currentThreshold: data.current_threshold,
        //         nextThreshold: data.next_threshold,
        //     });
        // } catch (error) {
        //     console.error('Failed to fetch XP:', error);
        // }
        const url = API_PREFIX + AUTH_ENDPOINT;
        const queryParams = {
            type: "get_points"
        }
        const requestResponse = httpGet<IPointsRespones>(url, queryParams);

        requestResponse.then((response) => {
            setUserXP({
                 points: response.data.data.points,
                 level: response.data.data.level,
                 currentThreshold: response.data.data.current_threshold,
                 nextThreshold: response.data.data.next_threshold,
             });
        })
    };


    useEffect(() => {
        refreshXP(); // call once on mount
    }, []);

    return (
        <html lang="en" className="bg-white min-h-full">
            <body className={`${inter.className} bg-white text-gray-800 min-h-screen flex flex-col`}>
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="z-40 bg-white mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href="/portal/courses" className="text-2xl font-bold text-blue-600">
                            <Image
                                src="/EduSense-Sample-Logo.png"
                                alt="Logo"
                                width={120}
                                height={0}
                            />
                        </Link>

                        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
                            {/* XP Level Display */}
                            <div className="flex flex-col items-end text-sm text-gray-800 mr-4">
                                <span className="font-semibold">Lvl {userXP.level}</span>
                                <div className="relative w-28 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                ((userXP.points - userXP.currentThreshold) /
                                                    (userXP.nextThreshold - userXP.currentThreshold)) *
                                                    100
                                            )}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">
                                    {userXP.points} / {userXP.nextThreshold}
                                </span>
                            </div>

                            <Link href="/portal/settings" className="hover:text-gray-900">Settings</Link>
                            <Logout />
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex w-full h-full min-h-screen bg-white mx-auto px-4 py-12">
                    {!showChatWidget && (
                        <ChatWidget
                            pageContext={context.pageContext}
                            enrollmentId={enrollmentId}
                            quiz={context.quiz}
                            article={context.article}
                            userSelection={userSelection}
                        />
                    )}
                    <CustomPropContext.Provider value={{ context, setContext, enrollmentId, setEnrollmentId, setUserSelection, refreshXP }}>
                        {children}
                    </CustomPropContext.Provider>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Edusense. All rights reserved.
                </footer>
            </body>
        </html>
    );
}