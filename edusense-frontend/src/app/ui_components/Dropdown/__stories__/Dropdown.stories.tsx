import type { StoryObj } from '@storybook/nextjs-vite';

import React, { useState } from 'react';

import Dropdown from '../index';

const meta = {
    title: 'Component/Dropdown',
    component: Dropdown,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        options: ['Option 1', 'Option 2', 'Option 3'],
        value: 'Choose an option',
        onChange: (value: string) => console.log(value),
        placeholder: 'Choose an option',
    },
    render: (args) => {
        const [value, setValue] = useState('');
        return <Dropdown {...args} value={value} onChange={(newValue) => setValue(newValue)} />;
    },
};
