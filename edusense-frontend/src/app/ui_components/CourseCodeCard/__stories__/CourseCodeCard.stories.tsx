import type { StoryObj } from '@storybook/nextjs-vite';

import Button from '../index'

const meta = {
    title: 'Component/CourseCodeCard',
    component: Button,
    args: { code: 'f24h43' },
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        code: 'f24h43'
    },
};