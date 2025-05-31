"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const getStarted = () =>{
        router.push("/auth/register")
    }
return (
    <div className="min-h-screen bg-white text-gray-900">
    {/* Navbar */}
    <header className="flex justify-between items-center px-8 py-6 shadow-md">
            <Link href="/" className="text-2xl font-bold text-blue-600">
                <Image
                    src = "/EduSense-Sample-Logo.png"
                    alt = "Logo"
                    width={120}
                    height={0}
                />
                {/* Edusense */}
            </Link>
        <nav className="space-x-6">
        <a href="#features" className="hover:text-blue-600">Features</a>
        <a href="#how-it-works" className="hover:text-blue-600">How It Works</a>
        <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>
    </header>

    {/* Hero Section */}
    <motion.section
        className="text-center px-6 py-20 bg-gradient-to-r from-blue-50 to-green-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        <h2 className="text-4xl font-bold mb-4">AI-Powered Learning. Accessible for All.</h2>
        <p className="text-lg mb-8">EduSense is your personal AI tutor—affordable, intelligent, and tailored to every learner.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition" onClick={getStarted}>
        Get Started
        </button>
    </motion.section>

    {/* Features */}
    <section id="features" className="px-6 py-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-semibold text-center mb-12">Features</h3>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        {['AI Lessons', '1-on-1 Tutor', 'Gamified Learning', 'Diagnostics'].map((feature, i) => (
            <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            >
            <img
                src={`https://via.placeholder.com/100?text=${feature.split(' ')[0]}`}
                alt={feature}
                className="mx-auto mb-4"
            />
            <h4 className="text-xl font-medium mb-2">{feature}</h4>
            <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </motion.div>
        ))}
        </div>
    </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-gray-50 px-6 py-20">
        <h3 className="text-3xl font-semibold text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10 text-center">
            {['Sign Up', 'Pick Your Course', 'Learn & Earn', 'Track Progress'].map((step, i) => (
            <div key={i} className="p-6">
                <div className="text-5xl font-bold text-blue-500 mb-4">{i + 1}</div>
                <h4 className="text-xl font-semibold mb-2">{step}</h4>
                <p className="text-gray-600 text-sm">Step description goes here with concise info.</p>
            </div>
            ))}
        </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6">
            <div>
            <h5 className="text-xl font-semibold mb-4">EduSense</h5>
            <p className="text-gray-400 text-sm">Making high-quality tutoring accessible for everyone.</p>
            </div>
            <div className="space-y-2">
            <p>Contact: <a href="mailto:info@edusense.ai" className="underline">info@edusense.ai</a></p>
            <p>Twitter: @edusense</p>
            <p>© 2025 EduSense. All rights reserved.</p>
            </div>
        </div>
        </footer>
    </div>
    );
}
