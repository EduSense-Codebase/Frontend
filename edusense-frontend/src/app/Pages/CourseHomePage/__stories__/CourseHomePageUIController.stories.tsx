import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CourseHomePageUIController from '../CourseHomePageUIController';
import { IFile, IModules } from '@/app/typedef';
import { fn } from 'storybook/internal/test';

const meta = {
    title: 'Pages/CourseHomePage',
    component: CourseHomePageUIController,
} satisfies Meta<typeof CourseHomePageUIController>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        announcements: [],
        assignments: [],
        onPostAnnouncement: (title, desc) =>
            alert(`Posted announcement with title: ${title} and description: ${desc}`),
        allModules: [],
        showToDoWidget: true,
        showModuleWidget: true,
        students: [],
        files: [],
        classModule: '',
        setFiles: fn() as React.Dispatch<React.SetStateAction<IFile[]>>,
        setShowModuleWidget: fn() as React.Dispatch<React.SetStateAction<boolean>>,
        setShowToDoWidget: fn() as React.Dispatch<React.SetStateAction<boolean>>,
        setModules: fn() as React.Dispatch<React.SetStateAction<IModules[]>>,
    },
    render: (args) => {
        return <CourseHomePageUIController {...args} />;
    },
};
