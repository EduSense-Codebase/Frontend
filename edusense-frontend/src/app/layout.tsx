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
    <html lang="en" className="bg-white">
      <body className={`${inter.className} bg-white `}>
      
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link className="text-2xl font-bold text-blue-600" href ="/" >Edusense</Link>
            <nav className="space-x-6 text-sm font-medium text-gray-700">
              <Link href="/login" className="hover:text-blue-600">Login</Link>
              <Link href="/register" className="hover:text-blue-600">Register</Link>
              {/* Add dashboard/home links here if needed */}
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          {children}
        </main>

        <footer className="bg-white border-t mt-10 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Edusense. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
