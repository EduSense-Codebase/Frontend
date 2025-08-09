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
    onSubmit: (title, desc) => alert(`Posted announcement with title: ${title} and description: ${desc}`),
    onCancel: () => alert('Cancelled'),
  },
};
