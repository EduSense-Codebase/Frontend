import React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CourseHomePageUIController from '../CourseHomePageUIController';

const meta = {
    title: 'Pages/CourseHomePage',
    component: CourseHomePageUIController,
} satisfies Meta<typeof CourseHomePageUIController>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    courseTitle: 'SAT',
    courseCode: 'j4t39rn',
    activeTab: 'Overview',
    onTabChange: () => {},
    announcements: [],
    onCreate: () => alert('Create clicked'),
    onPostAnnouncement: (title, desc) => alert(`Posted announcement with title: ${title} and description: ${desc}`),
    onCancelAnnouncement: () => alert('Announcement cancelled'),
    onEditPage: () => alert('Edit page clicked'),
  },
  render: (args) => {
    const [active, setActive] = useState('Overview');
    return (
      <CourseHomePageUIController
        {...args}
        activeTab={active}
        onTabChange={setActive}
      />
    );
  },

};
