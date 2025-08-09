import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AnnouncementForm from '../index';

const meta: Meta<typeof AnnouncementForm> = {
  title: 'Component/AnnouncementForm',
  component: AnnouncementForm,
};

export default meta;
type Story = StoryObj<typeof AnnouncementForm>;

export const Primary: Story = {
  args: {
    courses: ['ACT', 'SAT'],
    onSubmit: (course, message) => alert(`Posted to ${course}: ${message}`),
    onCancel: () => alert('Cancelled'),
  },
};
