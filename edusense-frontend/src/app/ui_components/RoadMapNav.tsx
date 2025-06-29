'use client';

import { useRouter } from 'next/navigation';

interface BottomNavBarProps {
    enrollmentId: string;
    section: string;
}

export default function RoadMapNav({ enrollmentId, section }: BottomNavBarProps) {
    const router = useRouter();

    return (
        <div className="fixed bottom-0 left-0 z-30 flex w-full items-center justify-between border-t border-gray-300 bg-white px-4 py-3 shadow-sm">
            <button
                onClick={() => router.push(`/portal/course_roadmap/${enrollmentId}/${section}`)}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
                ← Back to Roadmap
            </button>
        </div>
    );
}
