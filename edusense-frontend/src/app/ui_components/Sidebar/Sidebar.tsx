"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../../style/theme.scss"


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
    href: string; // now required
    isOpen: boolean;
    small?: boolean;
  }) {
    return (
      <Link
        href={href}
        className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors ${
          !isOpen ? "justify-center" : ""
        } ${small ? "text-sm" : ""}`}
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
  const [isOpen, setIsOpen] = useState(true);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      {/* Top Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 focus:outline-none"
      >
        <Image
                    src={"/sidebar/sidebar.png"}
                    width={30}
                    height={30}
                    alt="course icon"
             />
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1">
        {/* Home */}
        <SidebarItem
          icon={<Image
                    src={"/sidebar/home.png"}
                    width={40}
                    height={40}
                    alt="home icon"
             />}
          label="Home"
          isOpen={isOpen}
          href="/"
        />

        {/* Courses */}
        <div>
          <button
            onClick={() => setCoursesOpen(!coursesOpen)}
            className={`flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              !isOpen ? "justify-center" : ""
            }`}
          >
            <Image
                    src={"/sidebar/course.png"}
                    width={27}
                    height={27}
                    alt="course icon"
             />
            {isOpen && (
              <>
                <span className="ml-3 flex-1 text-left">Courses</span>
                <ChevronDownIcon
                  className={`transition-transform ${
                    coursesOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {/* Dropdown */}
          {coursesOpen && isOpen && (
            <div className="ml-8 space-y-1">
              <SidebarItem
                label="SAT"
                href="/courses/sat"
                isOpen={isOpen}
                small
              />
              <SidebarItem
                label="ACT"
                href="/courses/act"
                isOpen={isOpen}
                small
              />
            </div>
          )}
        </div>

        {/* Settings */}
        <SidebarItem
          icon={<Image
            src={"/sidebar/settings.png"}
            width={30}
            height={30}
            alt="course icon"
        />}
          label="Settings"
          isOpen={isOpen}
          href="/settings"
        />
      </nav>
    </div>
  );
}
