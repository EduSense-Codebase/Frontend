'use client';

import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import GradingPage, { StudentAssignment } from '@/app/Pages/GradingPage/GradingPage';
import { httpGet } from '@/app/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const runtime = 'edge';

interface IStudentSubmissionFetch {
    data: StudentAssignment[];
    title: string;
    total_points: number;
}

export default function Grades() {
    const url = `${API_PREFIX}${COURSE_ENDPOINT}`;

    const params = useParams();
    const courseId = params.courseId as string;
    const builderId = params.builderId as string;

    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentPoints, setAssignmentPoints] = useState(0);
    const [assignments, setAssignments] = useState<StudentAssignment[]>([]);

    useEffect(() => {
        const queryParams = {
            section: 'get_assignment_grading_page',
            course_id: courseId,
            builder_id: builderId,
        };

        const requestResponse = httpGet<IStudentSubmissionFetch>(url, queryParams);

        requestResponse.then((response) => {
            setAssignmentTitle(response.data.title);
            setAssignmentPoints(response.data.total_points);
            setAssignments(response.data.data);
        });
    }, [courseId, builderId]);

    return (
        <GradingPage
            title={assignmentTitle}
            assignments={assignments}
            totalPoints={assignmentPoints}
            handleAutoGrade={() => alert('Auto grading...')}
            gradeSubmission={() => alert('Going to View Submission Page...')}
        />
    );
}
