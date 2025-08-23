
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import PublishPage from '../PublishPage';
import { useState } from 'react';

const meta: Meta<typeof PublishPage> = {
    title: 'Pages/PublishPage',
    component: PublishPage,
};

export default meta;

type Story = StoryObj<typeof PublishPage>;

export const Default: Story = {
    render: () => 
    {
        const [title, setTitle] = useState("");
        const [instructions, setInstructions] = useState("");
        const [course, setCourse] = useState("");
        const [points, setPoints] = useState("");
        const [due, setDue] = useState("");
        const [module, setModule] = useState("");
    
        const onPublish = () => {

        }
    
        const onClose = () => {

        }


        return (
            <PublishPage 
            title={title}
            instructions={instructions}
            course={course}
            points={points}
            due={due}
            module={module}
            onTitleChange={(e) => setTitle?.(e.target.value)}
            onInstructionsChange={(e) => setInstructions?.(e.target.value)}
            onCourseChange={(e) => setCourse?.(e.target.value)}
            onPointsChange={(e) => setPoints?.(e.target.value)}
            onDueChange={(e) => setDue?.(e.target.value)}
            onModuleChange={(e) => setModule?.(e.target.value)}
            onPublishClick={onPublish}
            onCloseClick={onClose}
        />);
    }
};


//export default function Test() {}
