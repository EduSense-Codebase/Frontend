import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import PublishPage from '../PublishPage';

const meta: Meta<typeof PublishPage> = {
    title: 'Pages/PublishPage',
    component: PublishPage,
};

export default meta;

type Story = StoryObj<typeof PublishPage>;

export const Default: Story = {
    render: () => <PublishPage />,
};
