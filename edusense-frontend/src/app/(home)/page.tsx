'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const getStarted = () => {
        router.push('/auth/register');
    };
    const stepInfo = (step: string) => {
        let content = '';

        if (step == 'Sign Up') {
            content = 'Sign up for free!';
        } else if (step == 'Pick Your Course') {
            content = 'Choose from a variety of courses to begin your learning!';
        } else if (step == 'Learn & Earn') {
            content = 'Complete activities to earn points and redeem them for rewards!';
        } else {
            content = 'Set goals and track your progress!';
        }

        return <p className="text-sm text-gray-600"> {content}</p>;
    };

    const featureInfo = (feature: string) => {
        let content = '';
        let image = '';

        if (feature == 'AI Lessons') {
            image = '/Ai-lessons.png';
            content = 'Sign up for free!';
        } else if (feature == '1-on-1 Tutor') {
            image = '/1-on-1-tutor.png';
            content = 'Choose from a variety of courses to begin your learning!';
        } else if (feature == 'Gamified Learning') {
            image = '/Gamified-learning.png';
            content = 'Complete activities to earn points and redeem them for rewards!';
        } else {
            image = '/Diagnostics.png';
            content = 'Set goals and track your progress!';
        }

        return (
            <>
                <div className="flex justify-center">
                    <Image src={image} alt={feature} width={120} height={0} />
                </div>
                <h4 className="mb-2 text-xl font-medium">{feature}</h4>
                <p className="text-sm text-gray-600">{content}</p>
            </>
        );
    };
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navbar */}
            <header className="flex items-center justify-between px-8 py-6 shadow-md">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    <Image src="/EduSense-Sample-Logo.png" alt="Logo" width={120} height={0} />
                    {/* Edusense */}
                </Link>
                <nav className="space-x-6">
                    <a href="#features" className="hover:text-blue-600">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-blue-600">
                        How It Works
                    </a>
                    <a href="#contact" className="hover:text-blue-600">
                        Contact
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            <motion.section
                className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-20 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="mb-4 text-4xl font-bold">
                    AI-Powered Learning. Accessible for All.
                </h2>
                <p className="mb-8 text-lg">
                    EduSense is your personal AI tutor—affordable, intelligent, and tailored to
                    every learner.
                </p>
                <button
                    className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                    onClick={getStarted}
                >
                    Get Started
                </button>
            </motion.section>

            {/* Features */}
            <section id="features" className="mx-auto max-w-6xl px-6 py-20">
                <h3 className="mb-12 text-center text-3xl font-semibold">Features</h3>
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {['AI Lessons', '1-on-1 Tutor', 'Gamified Learning', 'Diagnostics'].map(
                        (feature, i) => (
                            <motion.div
                                key={i}
                                className="rounded-2xl bg-white p-6 text-center shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                            >
                                {featureInfo(feature)}
                            </motion.div>
                        ),
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="bg-gray-50 px-6 py-20">
                <h3 className="mb-12 text-center text-3xl font-semibold">How It Works</h3>
                <div className="grid gap-10 text-center sm:grid-cols-2 md:grid-cols-4">
                    {['Sign Up', 'Pick Your Course', 'Learn & Earn', 'Track Progress'].map(
                        (step, i) => (
                            <div key={i} className="p-6">
                                <div className="mb-4 text-5xl font-bold text-blue-500">{i + 1}</div>
                                <h4 className="mb-2 text-xl font-semibold">{step}</h4>
                                {stepInfo(step)}
                            </div>
                        ),
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 px-6 py-12 text-white">
                <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
                    <div>
                        <h5 className="mb-4 text-xl font-semibold">EduSense</h5>
                        <p className="text-sm text-gray-400">
                            Making high-quality tutoring accessible for everyone.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p>
                            Contact:{' '}
                            <a href="mailto:info@edusense.ai" className="underline">
                                info@edusense.ai
                            </a>
                        </p>
                        <p>Twitter: @edusense</p>
                        <p>© 2025 EduSense. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
