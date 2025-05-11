// app/layout.tsx
'use client';
import '../globals.css';
import React, { useState } from "react";
import { Inter } from 'next/font/google';
import Link from 'next/link';
import ChatWidget from '../ui_components/ChatWidget';
import { IQuiz } from '../typedef';
import Logout from '../ui_components/Logout';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

interface IPageContext {
    pageContext: string;
    quiz?: IQuiz | null;
    article?: string | null ;
}

interface ICustomProps {
    context: IPageContext;
    enrollmentId: number
    setContext: React.Dispatch<React.SetStateAction<IPageContext>>;
    setEnrollmentId: React.Dispatch<React.SetStateAction<number>>;
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

  return (
    <html lang="en" className="bg-white min-h-full">
      <body className={`${inter.className} bg-white text-gray-800 min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="z-40 bg-white mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/portal/courses" className="text-2xl font-bold text-blue-600">
              EduSense
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium text-gray-700">
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
            />
            )}
            <CustomPropContext.Provider value={{ context, setContext, enrollmentId, setEnrollmentId }}>
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
