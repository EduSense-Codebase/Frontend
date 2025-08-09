"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Sidebar.scss";


/* Reusable Sidebar Item */
function SidebarItem({
    icon,
    label,
    href,
    isOpen,
    small,
  }: {
    icon?: React.ReactNode;
    label: string;
    href: string;
    isOpen: boolean;
    small?: boolean;
  }) {
    return (
      <Link
        href={href}
        className={`sidebar-item ${!isOpen ? "justify-center" : ""} ${
          small ? "small" : ""
        }`}
      >
        {icon}
        {isOpen && <p>{label}</p>}
      </Link>
    );
}
  


function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-4 h-4 text-gray-500 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}


export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [coursesOpen, setCoursesOpen] = useState(false);
  
    return (
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Toggle Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="p-4 focus:outline-none">
          <Image src="/sidebar/sidebar.png" width={30} height={30} alt="menu" />
        </button>
  
        <nav className="flex-1 space-y-1">
          {/* Home */}
          <SidebarItem
            icon={<Image src="/sidebar/home.png" width={40} height={40} alt="home" />}
            label="Home"
            isOpen={isOpen}
            href="/"
          />
  
          {/* Courses */}
          <div>
            <button
              onClick={() => setCoursesOpen(!coursesOpen)}
              className={`flex items-center w-full px-4 py-2 ${
                !isOpen ? "justify-center" : ""
              }`}
            >
              <Image src="/sidebar/course.png" width={27} height={27} alt="courses" />
              {isOpen && (
                <>
                  <span className="sidebar-item">Courses</span>
                  <ChevronDownIcon className={`transition-transform ${coursesOpen ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
  
            {coursesOpen && isOpen && (
              <div className="ml-8 space-y-1">
                <SidebarItem label="SAT" href="/courses/sat" isOpen={isOpen} small />
                <SidebarItem label="ACT" href="/courses/act" isOpen={isOpen} small />
              </div>
            )}
          </div>
  
          {/* Settings */}
          <SidebarItem
            icon={<Image src="/sidebar/settings.png" width={30} height={30} alt="settings" />}
            label="Settings"
            isOpen={isOpen}
            href="/settings"
          />
        </nav>
      </div>
    );
  }
  