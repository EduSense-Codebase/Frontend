'use client';

export const runtime = 'edge';

import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import GradingPage, { StudentAssignment } from '@/app/Pages/GradingPage/GradingPage';
import { useCustomProp } from '@/app/typedef';
import { httpGet, httpPost } from '@/app/utils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

    const { setCurrCourseId, setCurrBuilderId } = useCustomProp();

    const router = useRouter();

    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentPoints, setAssignmentPoints] = useState(0);
    const [assignments, setAssignments] = useState<StudentAssignment[]>([]);

    useEffect(() => {
        const queryParams = {
            section: 'get_assignment_grading_page',
            course_id: courseId,
            builder_id: builderId,
        };

        setCurrCourseId(parseInt(courseId));
        setCurrBuilderId(parseInt(builderId));

        const requestResponse = httpGet<IStudentSubmissionFetch>(url, queryParams);

        requestResponse.then((response) => {
            setAssignmentTitle(response.data.title);
            setAssignmentPoints(response.data.total_points);
            setAssignments(response.data.data);
        });
    }, [courseId, builderId]);

    const handleGradeSubmission = (id: number) => {
        router.push(`/portal/builder/${courseId}/${builderId}/?mode=grade&userId=${id}`);
    };

    const handleAutoGrade = () => {
        const formData = {
            course_id: courseId,
            builder_id: builderId,
        };

        const queryParams = {
            section: 'ai_grade_assignment',
        };

        const requestResponse = httpPost(url, formData, queryParams);
        requestResponse.then(() => {
            toast.success(
                'Auto Grading Started. You will receive an email once the AI finishes grading!',
            );
        });
    };

    return (
        <GradingPage
            title={assignmentTitle}
            assignments={assignments}
            totalPoints={assignmentPoints}
            handleAutoGrade={handleAutoGrade}
            gradeSubmission={handleGradeSubmission}
        />
    );
}
