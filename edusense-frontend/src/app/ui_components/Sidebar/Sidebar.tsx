'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Sidebar.scss';
import { ICourse } from '@/app/typedef';
import { motion, AnimatePresence } from 'framer-motion';

/* Reusable Sidebar Item */
function SidebarItem({
    icon,
    label,
    href,
    isOpen,
}: {
    icon?: React.ReactNode;
    label: string;
    href: string;
    isOpen: boolean;
    small?: boolean;
}) {
    return (
        <Link href={href} className={`sidebar-item`}>
            {icon}
            <AnimatePresence>
                {isOpen && (
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                    >
                        {label}
                    </motion.p>
                )}
            </AnimatePresence>
        </Link>
    );
}

function ChevronDownIcon({ className = '' }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-gray-500 ${className}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default function Sidebar({ courses }: { courses: ICourse[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [coursesOpen, setCoursesOpen] = useState(false);

    return (
        <AnimatePresence>
            <motion.div
                className={`sidebar ${isOpen ? 'open' : 'closed'}`}
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                variants={{
                    open: { width: '14rem' },
                    closed: { width: '4rem' },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* Toggle Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="mt-2">
                    <SidebarItem
                        icon={
                            <Image src="/sidebar/sidebar.png" width={30} height={30} alt="menu" />
                        }
                        label=""
                        isOpen={isOpen}
                        href=""
                    />
                </button>
                <nav className="flex-1 space-y-1">
                    {/* Home */}
                    <SidebarItem
                        icon={<Image src="/sidebar/home.png" width={40} height={40} alt="home" />}
                        label="Home"
                        isOpen={isOpen}
                        href="/portal/courses"
                    />
                    {/* Courses */}
                    <div className="courses-dropdown">
                        <button
                            onClick={() => setCoursesOpen(!coursesOpen)}
                            className={`courses-btn ${!isOpen ? 'justify-center' : ''}`}
                        >
                            <Image src="/sidebar/course.png" width={27} height={27} alt="courses" />
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.span
                                        key="courses-label"
                                        className="sidebar-item"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: 0.3, duration: 0.2 }}
                                    >
                                        Courses
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.span
                                        key="chevron"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: coursesOpen ? 180 : 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        transition={{ delay: 0.3, duration: 0.2 }}
                                    >
                                        <ChevronDownIcon />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                        <AnimatePresence>
                            {coursesOpen && isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="ml-8 space-y-1 overflow-hidden"
                                >
                                    {courses.map((course, index) => (
                                        <SidebarItem
                                            label={course.course_name}
                                            href={`/portal/course_roadmap/${course.id}`}
                                            isOpen={isOpen}
                                            key={index}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Settings */}
                    <SidebarItem
                        icon={
                            <Image
                                src="/sidebar/settings.png"
                                width={30}
                                height={30}
                                alt="settings"
                            />
                        }
                        label="Settings"
                        isOpen={isOpen}
                        href="/portal/settings"
                    />
                </nav>
            </motion.div>
        </AnimatePresence>
    );
}
