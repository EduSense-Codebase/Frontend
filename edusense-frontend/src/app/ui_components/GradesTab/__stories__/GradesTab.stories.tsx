import React from 'react';
import { Meta } from '@storybook/react';
import GradesTab, { Grade, GradesTabProps } from '../GradesTab';

export default {
  title: 'UI Components/GradesTab',
  component: GradesTab,
} as Meta;

const Template: Story<GradesTabProps> = (args) => <GradesTab {...args} />;

const mockGrades: Grade[] = [
  { id: 1, label: 'Midterm Exam', score: '16/20' },
  { id: 2, label: 'Project 1', score: '92/100' },
  { id: 3, label: 'Final Paper', score: '97/100' },
  { id: 4, label: 'Participation', score: '10/10' },
];

export const Default = Template.bind({});
Default.args = {
  grades: mockGrades,
};
