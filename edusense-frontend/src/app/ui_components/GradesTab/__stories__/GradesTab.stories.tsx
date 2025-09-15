import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import GradesTab from '../GradesTab';

export default {
    title: 'UI Components/GradesTab',
    component: GradesTab,
} as Meta;

type Story = StoryObj<typeof GradesTab>;

export const Primary: Story = {
    render: () => {

        return (
            <GradesTab
                grades={[]}
                create_course={false}
            />
        );
    },
};