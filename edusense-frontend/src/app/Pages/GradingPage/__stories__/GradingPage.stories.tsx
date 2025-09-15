import React from 'react';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import GradingPage from '../GradingPage';
import { StudentAssignment } from '../GradingPage';

const meta: Meta<typeof GradingPage> = {
    title: 'Pages/GradingPage',
    component: GradingPage,
};

export default meta;

type Story = StoryObj<typeof GradingPage>;

export const Default: Story = {
    render: () => {
        const mockTitle = 'Assignment 1';
        const mockAssignments: StudentAssignment[] = [
            { id: 937584028, name: 'Student A', status: 'Submitted', pointsAwarded: 85 },
            { id: 937592749, name: 'Student B', status: 'Late', pointsAwarded: 70 },
            { id: 830472648, name: 'Student C', status: 'Not Submitted', pointsAwarded: null },
        ];

        return (
            <GradingPage
                title={mockTitle}
                assignments={mockAssignments}
                totalPoints={100}
                handleAutoGrade={() => alert('Auto grading...')}
                gradeSubmission={() => alert('Going to View Submission Page...')}
            />
        );
    },
};
