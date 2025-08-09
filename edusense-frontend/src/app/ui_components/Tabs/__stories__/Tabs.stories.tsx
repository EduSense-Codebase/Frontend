import React, { useState } from 'react';
import type { StoryObj } from '@storybook/nextjs-vite';
import Tabs from '../index';

const meta = {
    title: 'Component/Tabs',
    component: Tabs,
}

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Primary: Story = {
  args: {
    tabs: ['Overview', 'Classwork', 'Grades'],
    activeTab: 'Overview',
  },
  render: (args) => {
    const [active, setActive] = useState(args.activeTab);

    return (
      <Tabs
        {...args}
        activeTab={active}
        onTabChange={(tab) => setActive(tab)}
      />
    );
  },
};