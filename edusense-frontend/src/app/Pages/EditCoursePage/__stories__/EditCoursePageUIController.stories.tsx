import React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EditCoursePageUIController from '../EditCoursePageUIController';

const meta = {
    title: 'Pages/EditCoursePage',
    component: EditCoursePageUIController,
} satisfies Meta<typeof EditCoursePageUIController>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    courseTitle: 'SAT',
  }
};
