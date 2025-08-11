import React from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import AssignmentBuilder from '../index';

const meta: Meta<typeof AssignmentBuilder> = {
  title: 'Component/AssignmentBuilder',
  component: AssignmentBuilder,
};

export default meta;

type Story = StoryObj<typeof AssignmentBuilder>;

export const Primary: Story = {
  render: () => <AssignmentBuilder />,
};
