import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Sidebar from '../Sidebar';
import { ICourse } from '@/app/typedef';

const meta: Meta<typeof Sidebar> = {
    title: 'Components/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen', // so you can see the full height sidebar
    },
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

const mockCourses: ICourse[] = [
    {
        id: 1,
        course_name: 'Intro to Programming',
        institution: 101,
        join_code: 'CS101A',
        teacher_id: 1001,
    },
    {
        id: 2,
        course_name: 'Calculus',
        institution: 102,
        join_code: 'MATH202B',
        teacher_id: 1002,
    },
];

export const Default: Story = {
    render: () => <Sidebar courses={mockCourses} />,
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
function SidebarWrapper({ initialOpen }: { initialOpen: boolean }) {
    return <Sidebar key={String(initialOpen)} courses={[]} />;
}

//export default function Test() {}
