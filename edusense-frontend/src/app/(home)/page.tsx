'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import './page.scss';
import Button from '../ui_components/Button/index';

// Content Constants

export default function LandingPage() {
    const [showCalendly, setShowCalendly] = useState(false);

    const toggleCalendly = () => {
        setShowCalendly(!showCalendly);
    };

    const missionStatementContent = (
        <>
            {
                'The reality is AI is becoming more and more a part of everyday life. As students ourselves, we saw a paradigm shift in how AI is used in an academic setting. Students are trying to find ways to shortcut their learning, and traditional teaching methods are becoming more and more outdated. To help classrooms adapt to this emerging age of technology, we wanted to equip teachers with the tools necessary to make classrooms more efficient, to encourage smarter and stronger learning for students, and promote the responsible use of artificial intelligence. AI is opening a new frontier in the world, and EduSense’s aim is to bring that change to schools and democratize the use of AI for education.'
            }
            <br />
            <br />
            <a href="#" onClick={toggleCalendly}>
                Join us
            </a>
            {' in making education more accessible, efficient and personalized for all.'}
        </>
    );

    const taglineContent = ['The Modern Classroom', 'Smarter Teaching, Stronger Learning'];

    const productHighlightsContent = [
        {
            highlightHeading: 'Course Content Generation',
            heading: 'High Quality Course Material is just a prompt away',
            content:
                'Empowering teachers with cutting edge technology to make high quality content generation more accessible.',
            gifPath: '/landing_page/videos/content_gen.mp4',
        },
        {
            highlightHeading: 'Conversational Chatbot',
            heading: 'Provide personalized learning for students',
            content:
                'Creating a layer of support to provide students with one-on-one teaching assistance',
            gifPath: '/landing_page/videos/conversational.mp4',
        },
        {
            highlightHeading: 'Enhanced LMS Features',
            heading: 'Traditional LMS, modernized by AI',
            content: 'Intuitive interface to create, customize, and personalize your classroom',
            gifPath: '/landing_page/videos/lms.mp4',
        },
        {
            highlightHeading: 'Grading Agent',
            heading: 'Cut the busy work with AI assisted grading',
            content:
                'Grades and adds feedback to short answer, long answer, and essay based questions, along with traditional multiple choice grading',
            gifPath: '/landing_page/videos/grading_agent.mp4',
        },
    ];

    const aboutFoundersContent = [
        {
            picPath: '/landing_page/founder_pic/divyansh.jpeg',
            picAlt: 'Divyansh Picture',
            content:
                'Hey, I’m Divyansh. I’m a fourth-year CS and Managerial Economics student at UC Davis and co-founder of Edusense, where we’re building personalized learning tools to make quality education accessible to every student. I also co-founded Intelligent Workspace, the team behind Accountant Workspace, a SaaS platform supporting tax professionals. Beyond startups, I’ve worked on AI research in biomedical imaging and am now focused on LLM verification to reduce model hallucinations. At the end of the day, I love taking big ideas and turning them into tech that makes a real impact.',
        },
        {
            picPath: '/landing_page/founder_pic/soham.jpg',
            picAlt: 'Soham Picture',
            content:
                'Hi, I’m Soham Kolhatkar, a UC Davis Computer Science and Managerial Economics student and co-founder of EduSense. I’m passionate about using AI to make high-quality, personalized education accessible to all. My journey started at a scheduling startup improving tools for thousands of students and has taken me through research of AI tools in industry, LLM verification, and medical imaging, as well as industry internships. EduSense is my first startup, built on years of exploring how technology can transform learning and empower both teachers and students.',
        },
    ];

    const calendlyLink = 'https://calendly.com/edusense0114/30min';

    // Social links for footer icons
    const socialLinks = [
        {
            name: 'Twitter',
            href: '#',
            icon: (
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M46 3.00009C44.0848 4.35105 41.9642 5.38431 39.72 6.06009C38.5155 4.67511 36.9147 3.69348 35.1341 3.24794C33.3535 2.80241 31.479 2.91448 29.7642 3.569C28.0493 4.22351 26.5769 5.38889 25.546 6.90753C24.515 8.42616 23.9754 10.2248 24 12.0601V14.0601C20.4853 14.1512 17.0025 13.3717 13.862 11.791C10.7215 10.2103 8.02063 7.87736 6 5.00009C6 5.00009 -2 23.0001 16 31.0001C11.8811 33.796 6.97431 35.198 2 35.0001C20 45.0001 42 35.0001 42 12.0001C41.9982 11.443 41.9446 10.8873 41.84 10.3401C43.8812 8.32708 45.3217 5.78552 46 3.00009Z"
                        stroke="#4B76B3"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            ),
        },
        {
            name: 'Email',
            href: '#',
            icon: (
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M42 6C42 3.8 40.2 2 38 2H6C3.8 2 2 3.8 2 6M42 6V30C42 32.2 40.2 34 38 34H6C3.8 34 2 32.2 2 30V6M42 6L22 20L2 6"
                        stroke="#4B76B3"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            href: '#',
            icon: (
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M33 11H33.02M12 2H32C37.5228 2 42 6.47715 42 12V32C42 37.5228 37.5228 42 32 42H12C6.47715 42 2 37.5228 2 32V12C2 6.47715 6.47715 2 12 2ZM30 20.74C30.2468 22.4045 29.9625 24.1044 29.1875 25.598C28.4125 27.0916 27.1863 28.3028 25.6833 29.0593C24.1802 29.8159 22.4769 30.0792 20.8156 29.8119C19.1543 29.5445 17.6195 28.7602 16.4297 27.5703C15.2398 26.3805 14.4555 24.8457 14.1881 23.1844C13.9208 21.5231 14.1841 19.8198 14.9407 18.3167C15.6972 16.8137 16.9084 15.5875 18.402 14.8125C19.8956 14.0375 21.5955 13.7532 23.26 14C24.9578 14.2518 26.5297 15.0429 27.7434 16.2566C28.9571 17.4703 29.7482 19.0422 30 20.74Z"
                        stroke="#4B76B3"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            ),
        },
        // Add more social icons here if needed
    ];

    return (
        <div className="landing-page">
            {/* Navbar */}
            <header className="navbar">
                <Link href="/" className="flex items-center space-x-2 text-[#6dc4e0]">
                    <Image
                        src="/landing_page/logo-full.png"
                        alt="EduSense Logo"
                        width={120}
                        height={40}
                    />
                    {/* Optional: <span className="text-2xl font-bold">EduSense</span> */}
                </Link>
                <nav className="space-x-6 text-[#25436d]">
                    {/*<Link href="/auth/login" className="transition hover:text-[#6dc4e0]">
                        Login
                    </Link>*/}
                    <a href="#how-it-works" className="transition hover:text-[#6dc4e0]">
                        How It Works
                    </a>
                    <a href="#mission" className="transition hover:text-[#6dc4e0]">
                        Our Mission
                    </a>
                    <a href="#founders" className="transition hover:text-[#6dc4e0]">
                        About the Founders
                    </a>
                    <a href="#contact" className="transition hover:text-[#6dc4e0]">
                        Contact
                    </a>
                    <button
                        onClick={toggleCalendly}
                        className="cursor-pointer transition hover:text-[#6dc4e0]"
                    >
                        Book A Demo
                    </button>
                </nav>
            </header>

            <div className="content">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-left">
                        <img
                            src="/landing_page/logo-text.png"
                            alt="edusense"
                            className="logo-text"
                        />
                        <img
                            src="/landing_page/bookshelf.png"
                            alt="bookshelf"
                            className="bookshelf"
                        />
                    </div>
                    <img
                        src="/landing_page/airplane.gif"
                        alt="paper airplane gif"
                        className="airplane-gif"
                    />
                    <div className="right-hero">
                        <motion.img
                            src="/landing_page/logo.png"
                            alt="edusense logo"
                            className="logo-icon"
                            animate={{ y: ['0%', '-4%'] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className="chat-bubble"
                            animate={{ y: ['0%', '-4%'], x: ['-20%', '-20%'] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                ease: 'easeInOut',
                            }}
                        >
                            <img src="/landing_page/chat-bubble.png" alt="chat bubble" />
                            <div className="chat-bubble-content">
                                <p className="tagline-header">{taglineContent[0]}</p>
                                <p className="tagline">{taglineContent[1]}</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Video Section */}
                {productHighlightsContent.map((content, idx) => (
                    <section className="video-demo" id="how-it-works" key={idx}>
                        <div className="video-container">
                            <div className="frame">
                                <img
                                    src="/landing_page/videoframe.png"
                                    alt="video frame"
                                    className="videoframe"
                                />
                                {content.gifType ? (
                                    <img src={content.gifPath} className="video" alt="" />
                                ) : (
                                    <video
                                        src={content.gifPath}
                                        title="EduSense Demo Video"
                                        autoPlay
                                        muted
                                        loop
                                        className="video"
                                    ></video>
                                )}
                            </div>
                            <div className="text">
                                <h1>{content.heading}</h1>
                                <p>{content.content}</p>
                            </div>
                        </div>
                    </section>
                ))}

                <img src="/landing_page/wavyline.png" alt="separator" className="wavyline" />

                {/* Demo Section */}
                <section className="demo">
                    <img
                        src="/landing_page/calendar.png"
                        alt="calendar"
                        className="calendar-icon"
                    />
                    <div className="demo-text">
                        <p className="learn-more">Want to Learn More?</p>
                        <Button
                            onClick={toggleCalendly}
                            displayName="Book A Demo"
                            variant="primary"
                        />
                    </div>
                    <img src="/landing_page/butterfly.png" alt="butterfly" className="butterfly" />
                </section>

                {showCalendly && (
                    <div className="calendly-modal">
                        <div className="calendly-overlay" onClick={toggleCalendly}></div>
                        <div className="calendly-container">
                            <button className="calendly-close" onClick={toggleCalendly}>
                                ×
                            </button>
                            <iframe
                                src={calendlyLink}
                                width="100%"
                                height="550"
                                title="Schedule a Demo"
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Mission Section */}
                <section className="mission" id="mission">
                    <div className="mission-heading">
                        <img
                            src="/landing_page/lightbulb.png"
                            alt="lightbulb"
                            className="lightbulb"
                        />
                        <h2>Our Mission</h2>
                    </div>
                    <p className="description">{missionStatementContent}</p>
                </section>

                {/* Founders Section */}
                <section className="founders" id="founders">
                    <div className="founders-heading flex flex-col items-center md:flex-row md:justify-between">
                        <h2 className="mb-4 text-3xl font-bold md:mb-0">About the Founders</h2>
                        <img
                            src="/landing_page/laptop.png"
                            alt="laptop"
                            className="laptop w-40 md:w-60"
                        />
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:gap-8 md:flex-row lg:gap-[20vw]">
                        <Image
                            src={aboutFoundersContent[0].picPath}
                            alt={aboutFoundersContent[0].picAlt}
                            width={250}
                            height={100}
                            className="rounded-2xl border-3 border-[#4b76b3] object-cover shadow-md"
                        />
                        <Image
                            src={aboutFoundersContent[1].picPath}
                            alt={aboutFoundersContent[1].picAlt}
                            width={200}
                            height={200}
                            className="rounded-2xl border-3 border-[#4b76b3] object-cover shadow-md"
                        />
                    </div>

                    <div className="bios mt-6 space-y-4 text-center md:text-left">
                        {aboutFoundersContent.map((content, idx) => (
                            <p key={idx}>{content.content}</p>
                        ))}
                    </div>
                </section>

                <img src="/landing_page/grass.png" className="grass" alt="" />
            </div>

            {/* Footer */}
            <footer className="landing-footer" id="contact">
                <h3>Contact Us</h3>
                <div className="socials">
                    {socialLinks.map(({ name, href, icon }) => (
                        <a
                            key={name}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={name}
                            className="social-icon"
                        >
                            {icon}
                        </a>
                    ))}
                </div>

                <p>© 2025 EduSense. All rights reserved.</p>
            </footer>
        </div>
    );
}
