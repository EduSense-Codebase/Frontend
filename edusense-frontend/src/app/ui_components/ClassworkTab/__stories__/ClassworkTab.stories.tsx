import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Classwork from '../ClassworkTab';

const meta: Meta<typeof Classwork> = {
    title: 'Components/Classwork',
    component: Classwork,
};

export default meta;
type Story = StoryObj<typeof Classwork>;

export const Default: Story = {
    args: {
        modules: [
            {
                id: 1,
                title: 'Module 1: Introduction',
                created: '',
                course: 0,
            },
            {
                id: 2,
                title: 'Module 2: Advanced Topics',
                created: '',
                course: 0,
            },
        ],
    },
};
