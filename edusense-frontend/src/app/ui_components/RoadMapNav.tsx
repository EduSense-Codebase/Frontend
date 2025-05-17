'use client';

import { useRouter } from 'next/navigation';

interface BottomNavBarProps {
  enrollmentId: string;
  section: string;
}

export default function RoadMapNav({ enrollmentId, section }: BottomNavBarProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 py-3 px-4 flex justify-between items-center shadow-sm z-30">
      <button
        onClick={() => router.push(`/portal/course_roadmap/${enrollmentId}/${section}`)}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
      >
        ← Back to Roadmap
      </button>
    </div>
  );
}
