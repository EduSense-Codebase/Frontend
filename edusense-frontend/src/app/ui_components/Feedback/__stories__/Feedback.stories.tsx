
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Feedback from '../index';

const meta: Meta<typeof Feedback> = {
    title: 'Component/Feedback',
    component: Feedback,
};
export default meta;

type Story = StoryObj<typeof Feedback>;

export const Primary: Story = {
    render: () => {
        const mockFeedback = ['Wrong. Correct answer is Berlin', 'Make sure to review European capitals before the next exam!'];
        const [feedback, setFeedback] = useState<string[]>(mockFeedback);

        return (
            <Feedback
                mode={'grade-edit'}
                feedback={feedback}
                onChangeFeedback={(newFeedback) => setFeedback(newFeedback)}
            />
        );
    },
};

export const ViewGrade: Story = {
    render: () => {
        const mockFeedback = ['Wrong. Correct answer is Berlin', 'Make sure to review European capitals before the next exam!'];
        const [feedback, setFeedback] = useState<string[]>(mockFeedback);

        return (
            <Feedback
                mode={'grade-view'}
                feedback={feedback}
                onChangeFeedback={(newFeedback) => setFeedback(newFeedback)}
            />
        );
    },
};