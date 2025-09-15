import React from 'react';
import { useState } from 'react';
import type { Meta, ComponentStory } from '@storybook/nextjs-vite';
import EditCoursePageUIController from '../EditCoursePageUIController';
import { IAssignments, ICourse, IModules } from '@/app/typedef';
import { fn } from 'storybook/internal/test';

const meta = {
    title: 'Pages/EditCoursePage',
    component: EditCoursePageUIController,
} satisfies Meta<typeof EditCoursePageUIController>;

export default meta;

type Story = ComponentStory<typeof meta>;

const mockCourse: ICourse = {
    id: 1,
    course_name: 'math',
    institution: 1,
    join_code: 'ns23v',
    teacher_id: 1,
};

const mockAssignments: IAssignments[] = [];

const mockModules: IModules[] = [];

export const Primary: Story = {
    render: () => {
        const [editMode, setEditMode] = useState(true);
        const [bannerImage, setBannerImage] = useState<string | null>(null);
        const [showModuleWidget, setShowModuleWidget] = useState(false);
        const [showToDoWidget, setShowToDoWidget] = useState(false);

        const originalValues = {
            bannerImage: null,
            showModuleWidget: true,
            showToDoWidget: true,
            textBoxStyle: '',
        };

        return (
            <EditCoursePageUIController
                course={mockCourse}
                allModules={mockModules}
                assignments={mockAssignments}
                editMode={editMode}
                setEditMode={setEditMode}
                showModuleWidget={showModuleWidget}
                showToDoWidget={showToDoWidget}
                setShowModuleWidget={setShowModuleWidget}
                setShowToDoWidget={setShowToDoWidget}
                setBannerImage={setBannerImage}
                bannerImage={bannerImage}
                originalValues={originalValues}
                classModule=''
                setClassModule={fn()}
            />
        );
    },
};

//export default function Test() {}
