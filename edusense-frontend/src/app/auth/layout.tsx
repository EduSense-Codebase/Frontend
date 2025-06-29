// app/auth/layout.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-gray-800">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="z-40 mx-auto flex items-center justify-between bg-white px-4 py-4">
                    <Link href="/portal/courses" className="text-2xl font-bold text-blue-600">
                        <Image src="/EduSense-Sample-Logo.png" alt="Logo" width={120} height={0} />
                    </Link>
                    <nav className="space-x-6 text-sm font-medium text-gray-700">
                        <Link href="/auth/login" className="hover:text-blue-600">
                            Login
                        </Link>
                        <Link href="/auth/register" className="hover:text-blue-600">
                            Register
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto flex max-w-4xl flex-grow items-center justify-center bg-white px-4 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="mt-12 border-t bg-white py-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} EduSense. All rights reserved.
            </footer>
        </div>
    );
}
