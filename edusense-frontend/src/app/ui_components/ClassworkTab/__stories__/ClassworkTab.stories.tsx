import type { Meta, StoryObj } from '@storybook/react';
import Classwork from '../ClassworkTab';

const meta: Meta<typeof Classwork> = {
    title: 'Components/Classwork',
    component: Classwork,
};

export default meta;
type Story = StoryObj<typeof Classwork>;

export const Default: Story = {
    args: {
        modules: [
            {
                id: 1,
                name: 'Module 1: Introduction',
                assignments: ['Assignment 1', 'Assignment 2'],
            },
            {
                id: 2,
                name: 'Module 2: Advanced Topics',
                assignments: ['Assignment 3', 'Assignment 4', 'Assignment 5'],
            },
        ],
        unassignedAssignments: ['Assignment X', 'Assignment Y'],
    },
};
