// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Edusense',
  description: 'A smarter way to learn — powered by AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white min-h-full">
      <body className={`${inter.className} bg-white text-gray-800 min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="bg-white max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Edusense
            </Link>
            <nav className="space-x-6 text-sm font-medium text-gray-700">
              <Link href="/login" className="hover:text-blue-600">Login</Link>
              <Link href="/register" className="hover:text-blue-600">Register</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex items-center justify-center min-h-screen bg-white max-w-4xl mx-auto px-4 py-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Edusense. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
