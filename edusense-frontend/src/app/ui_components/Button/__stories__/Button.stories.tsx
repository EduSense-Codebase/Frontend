import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import Button from '../index'

const meta = {
    title: 'Component/Button',
    component: Button,
    args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        displayName: "Primary Button",
        variant: 'primary',
        icon: '/edit.svg'
    },
};

export const Secondary: Story = {
    args: {
        displayName: "Secondary",
        variant: 'secondary'
    },
};

export const Danger: Story = {
    args: {
        displayName: "Danger Button",
        variant: 'danger'
    },
};