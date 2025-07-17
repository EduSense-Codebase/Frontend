'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LandingPage() {
    const router = useRouter();
    const [showDemo, setShowDemo] = useState(false);

    const getStarted = () => {
        router.push('/auth/register');
    };

    // Updated step info for clarity
    const stepInfo = (step: string) => {
        switch (step) {
            case 'Sign Up':
                return (
                    <p className="text-sm text-gray-600">
                        Sign up for free and create your profile.
                    </p>
                );
            case 'Pick Your Course':
                return (
                    <p className="text-sm text-gray-600">
                        Choose from a variety of courses to start learning.
                    </p>
                );
            case 'Learn & Earn':
                return (
                    <p className="text-sm text-gray-600">
                        Complete activities to earn points and redeem rewards.
                    </p>
                );
            case 'Track Progress':
                return (
                    <p className="text-sm text-gray-600">
                        Set goals and watch your improvement over time.
                    </p>
                );
            default:
                return null;
        }
    };

    // Updated feature info with better descriptions and images
    const featureInfo = (feature: string) => {
        let image = '';
        let content = '';

        switch (feature) {
            case 'AI Lessons':
                image = '/Ai-lessons.png';
                content =
                    'Instantly generated lessons tailored to your learning style using the latest AI technology.';
                break;
            case '1-on-1 Tutor':
                image = '/1-on-1-tutor.png';
                content =
                    'Get personalized help from AI tutors that understand your strengths and weaknesses.';
                break;
            case 'Gamified Learning':
                image = '/Gamified-learning.png';
                content =
                    'Earn points, badges, and rewards while enjoying fun and interactive lessons.';
                break;
            case 'Diagnostics':
                image = '/Diagnostics.png';
                content = 'Track your skills and get detailed insights on your progress.';
                break;
        }

        return (
            <>
                <div className="mb-4 flex justify-center">
                    <Image src={image} alt={feature} width={120} height={120} />
                </div>
                <h4 className="mb-2 text-xl font-semibold">{feature}</h4>
                <p className="text-sm text-gray-600">{content}</p>
            </>
        );
    };

    // Social links for footer icons
    const socialLinks = [
        {
            name: 'Twitter',
            href: 'https://twitter.com/edusense',
            icon: (
                <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M23 3a10.9 10.9 0 01-3.14.86 5.48 5.48 0 002.4-3.02 10.8 10.8 0 01-3.44 1.3 5.41 5.41 0 00-9.2 4.94 15.36 15.36 0 01-11.15-5.65 5.39 5.39 0 001.67 7.2 5.38 5.38 0 01-2.45-.67v.07a5.42 5.42 0 004.34 5.31 5.41 5.41 0 01-2.44.09 5.43 5.43 0 005.07 3.77A10.86 10.86 0 010 19.54a15.34 15.34 0 008.29 2.43c9.95 0 15.4-8.25 15.4-15.4 0-.24 0-.48-.02-.71A11.03 11.03 0 0023 3z" />
                </svg>
            ),
        },
        // Add more social icons here if needed
    ];

    return (
        <div className="flex min-h-screen flex-col bg-white text-gray-900">
            {/* Navbar */}
            <header className="flex items-center justify-between px-8 py-6 shadow-md">
                <Link href="/" className="flex items-center space-x-2 text-blue-600">
                    <Image
                        src="/EduSense-Sample-Logo.png"
                        alt="EduSense Logo"
                        width={120}
                        height={40}
                    />
                    {/* Optional: <span className="text-2xl font-bold">EduSense</span> */}
                </Link>
                <nav className="space-x-6 font-medium text-gray-700">
                    <Link href="/auth/login" className="transition hover:text-blue-600">
                        Login
                    </Link>
                    <a href="#features" className="transition hover:text-blue-600">
                        Features
                    </a>
                    <a href="#how-it-works" className="transition hover:text-blue-600">
                        How It Works
                    </a>
                    <a href="#contact" className="transition hover:text-blue-600">
                        Contact
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            {/* Full-width gradient background wrapper */}
            <motion.div
                className="w-full bg-gradient-to-r from-blue-50 to-green-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Centered content container */}
                <section className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 px-6 py-20 md:flex-row">
                    <div className="max-w-xl text-center md:text-left">
                        <h1 className="mb-6 text-5xl leading-tight font-extrabold tracking-tight text-gray-900">
                            Your Personal AI Tutor —{' '}
                            <span className="text-blue-600">Free, Smart, Fun.</span>
                        </h1>
                        <p className="mb-8 text-lg text-gray-700">
                            EduSense uses smart AI to create lessons on the fly, adapting to how you
                            learn so you always get the right content at the right time—making
                            learning easier and more fun.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                            <button
                                onClick={getStarted}
                                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
                            >
                                Get Started
                            </button>
                            {/* <button
                                onClick={() => setShowDemo(true)}
                                className="rounded-xl border border-blue-600 px-8 py-3 font-semibold text-blue-600 shadow-sm transition hover:bg-blue-100"
                            >
                                Watch Demo
                            </button> */}
                        </div>
                    </div>

                    <div className="w-full max-w-md md:max-w-lg">
                        <Image
                            src="/EduSense-Sample-Logo.png"
                            alt="EduSense app preview"
                            width={540}
                            height={400}
                            className="mx-auto"
                        />
                    </div>
                </section>
            </motion.div>

            {/* Features */}
            <section
                id="features"
                className="mx-auto max-w-6xl px-6 py-20"
                aria-label="Features of EduSense"
            >
                <h2 className="mb-12 text-center text-3xl font-semibold">Features</h2>
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {['AI Lessons', '1-on-1 Tutor', 'Gamified Learning', 'Diagnostics'].map(
                        (feature, i) => (
                            <motion.div
                                key={i}
                                className="cursor-pointer rounded-2xl bg-white p-6 text-center shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
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
                <h2 className="mb-12 text-center text-3xl font-semibold">How It Works</h2>
                <div className="grid gap-10 text-center sm:grid-cols-2 md:grid-cols-4">
                    {['Sign Up', 'Pick Your Course', 'Learn & Earn', 'Track Progress'].map(
                        (step, i) => (
                            <motion.div
                                key={i}
                                className="rounded-xl bg-white p-6 shadow-md"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                            >
                                <div className="mb-4 text-5xl font-bold text-blue-500">{i + 1}</div>
                                <h4 className="mb-2 text-xl font-semibold">{step}</h4>
                                {stepInfo(step)}
                            </motion.div>
                        ),
                    )}
                </div>
            </section>

            {/* Testimonials */}
            <section className="mx-auto max-w-6xl bg-white px-6 py-20 text-center">
                <h2 className="mb-12 text-3xl font-semibold">What Students Say</h2>
                <div className="flex flex-col gap-8 md:flex-row md:justify-center md:gap-10">
                    {[
                        {
                            quote: 'Insert Quote Here',
                            author: 'Insert Testimonial',
                        },
                        {
                            quote: 'Insert Quote Here',
                            author: 'Insert Testimonial',
                        },
                        {
                            quote: 'Insert Quote Here',
                            author: 'Insert Testimonial',
                        },
                    ].map(({ quote, author }, i) => (
                        <motion.div
                            key={i}
                            className="mx-auto max-w-sm rounded-lg bg-gray-100 p-6 shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.3 }}
                        >
                            <p className="text-gray-800 italic">“{quote}”</p>
                            <p className="mt-4 font-semibold text-gray-900">— {author}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer
                id="contact"
                className="flex w-full flex-col justify-between gap-10 bg-gray-900 px-6 py-12 text-white md:flex-row"
            >
                <div>
                    <h5 className="mb-4 text-xl font-semibold">EduSense</h5>
                    <p className="max-w-sm text-gray-400">
                        Making high-quality tutoring accessible for everyone.
                    </p>
                </div>

                <div className="space-y-6 md:text-right">
                    <div className="flex justify-center space-x-4 md:justify-end">
                        {socialLinks.map(({ name, href, icon }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={name}
                                className="transition hover:text-blue-400"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>

                    <div>
                        <p>Contact: </p>
                        <a href="mailto:info@edusense.ai" className="underline hover:text-blue-400">
                            info@edusense.ai
                        </a>
                    </div>

                    <p>© 2025 EduSense. All rights reserved.</p>
                </div>
            </footer>

            {/* Demo Modal */}
            {showDemo && (
                <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg">
                        <button
                            onClick={() => setShowDemo(false)}
                            className="absolute top-3 right-3 text-2xl font-bold text-gray-600 hover:text-gray-900"
                            aria-label="Close Demo"
                        >
                            &times;
                        </button>
                        <h3 className="mb-4 text-2xl font-semibold">EduSense Demo</h3>
                        {/* Replace below iframe src with your actual demo video URL */}
                        <div className="aspect-video">
                            <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Example video URL, replace with your real one
                                title="EduSense Demo Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="h-full w-full rounded-lg"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
