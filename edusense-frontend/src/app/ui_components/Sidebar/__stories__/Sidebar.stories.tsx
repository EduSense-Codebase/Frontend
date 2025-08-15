import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from '../Sidebar';

const meta: Meta<typeof Sidebar> = {
    title: 'Components/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen', // so you can see the full height sidebar
    },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    render: () => <Sidebar />,
};

export const Closed: Story = {
    render: () => {
        // Wrap in a container to force closed state initially
        return (
            <div className="h-screen">
                <SidebarWrapper initialOpen={false} />
            </div>
        );
    },
};

// Small wrapper to force starting state in stories
import { useState } from 'react';

function SidebarWrapper({ initialOpen }: { initialOpen: boolean }) {
    const [open, setOpen] = useState(initialOpen);
    return <Sidebar key={String(open)} />;
}
