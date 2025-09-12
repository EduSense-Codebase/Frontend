
import React from 'react';
import type { StoryObj, Meta } from '@storybook/nextjs-vite';
import AssignmentBuilder, {AssignmentBuilderProps} from '../index';
import { Question } from '../index';
import { on } from 'events';
import { useState } from 'react';
import { IQuizSubmission } from '../../../portal/builder/[courseId]/[builderId]/page';

const meta: Meta<typeof AssignmentBuilder> = {
    title: 'Component/AssignmentBuilder',
    component: AssignmentBuilder,
};

export default meta;

type Story = StoryObj<typeof AssignmentBuilder>;

const primaryQuizQuestions: Question[] = [
    {
        id: 'q1',
        type: 'multiple',
        question: 'Which planet is known as the Red Planet?',
        description: 'Select the correct answer from the options below.',
        isRequired: true,
        mode: 'view',
        options: [
            { id: 'o1', text: 'Earth' },
            { id: 'o2', text: 'Mars', isCorrect: true },
            { id: 'o3', text: 'Jupiter' },
            { id: 'o4', text: 'Venus' },
        ],
        order_index: 0,
        points: 5,
        selectedOptionId: 'o2',
        feedback: ['Correct! Mars is known as the Red Planet.'],
    },
    {
        id: 'q2',
        type: 'short',
        question: 'What is the chemical symbol for water?',
        isRequired: true,
        mode: 'view',
        answer: '',
        correctAnswers: [
            { id: 'a1', text: 'H2O' },
            { id: 'a2', text: 'h2o' },
        ],
        order_index: 1,
        points: 5,
    },
    {
        id: 'q3',
        type: 'long',
        question: 'Explain the process of photosynthesis.',
        description: 'Your explanation should include the role of chlorophyll and sunlight.',
        isRequired: false,
        mode: 'view',
        order_index: 2,
        files: [ new File([], 'example.txt') ],
        feedback: ['Good explanation! You covered the key points of photosynthesis.'],
        points: 10,
    },
];

export const Primary: Story = {
    render: () => {
        const [quizContent, setQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [updatedQuizContent, setUpdatedQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [quizSubmission, setQuizSubmission] = useState<IQuizSubmission[]>([]);

        const [title, setTitle] = useState("Practice Quiz");
        const [description, setDescription] = useState('"Test your science knowledge!"');
    
        const onQuizChange = (newQuestions: Question[]) => {
            setUpdatedQuizContent((prevUpdatedQuizContent) => {
                if (prevUpdatedQuizContent == undefined) {
                    return undefined;
                }
                return {
                    ...prevUpdatedQuizContent,
                    quizQuestions: newQuestions,
                };
            });
        };
    
        const onAnswerSelection = (questionIndex: number, value: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);
    
            setQuizSubmission((prevSubmission) => {
                const newSubmission = [...prevSubmission];
                if (newSubmission[questionIndex].type == 'multiple' && typeof value === 'number') {
                    newSubmission[questionIndex].multiple_value = value;
                } else if (newSubmission[questionIndex].type == 'short' && typeof value === 'string') {
                    newSubmission[questionIndex].short_value = value;
                } else if (newSubmission[questionIndex].type == 'long' && typeof value === 'string') {
                    newSubmission[questionIndex].long_value = value;
                }
                newSubmission[questionIndex].question =
                    quizContent?.quizQuestions[questionIndex].question;
                return newSubmission;
            });
        };
    
        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };
    
        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={false}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'view'}
            />
        );
    }
};

export const Edit: Story = {
    render: () => {
        const [quizContent, setQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [updatedQuizContent, setUpdatedQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [quizSubmission, setQuizSubmission] = useState<IQuizSubmission[]>([]);

        const [title, setTitle] = useState("Practice Quiz");
        const [description, setDescription] = useState('"Test your science knowledge!"');
    
        const onQuizChange = (newQuestions: Question[]) => {
            setUpdatedQuizContent((prevUpdatedQuizContent) => {
                if (prevUpdatedQuizContent == undefined) {
                    return undefined;
                }
                return {
                    ...prevUpdatedQuizContent,
                    quizQuestions: newQuestions,
                };
            });
        };
    
        const onAnswerSelection = (questionIndex: number, value: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);
    
            setQuizSubmission((prevSubmission) => {
                const newSubmission = [...prevSubmission];
                if (newSubmission[questionIndex].type == 'multiple' && typeof value === 'number') {
                    newSubmission[questionIndex].multiple_value = value;
                } else if (newSubmission[questionIndex].type == 'short' && typeof value === 'string') {
                    newSubmission[questionIndex].short_value = value;
                } else if (newSubmission[questionIndex].type == 'long' && typeof value === 'string') {
                    newSubmission[questionIndex].long_value = value;
                }
                newSubmission[questionIndex].question =
                    quizContent?.quizQuestions[questionIndex].question;
                return newSubmission;
            });
        };
    
        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };
    
        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={true}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'edit'}
            />
        );
    }
};

export const GradeView: Story = {
    render: () => {
        const [quizContent, setQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [updatedQuizContent, setUpdatedQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [quizSubmission, setQuizSubmission] = useState<IQuizSubmission[]>([]);

        const [title, setTitle] = useState("Practice Quiz");
        const [description, setDescription] = useState('"Test your science knowledge!"');
    
        const onQuizChange = (newQuestions: Question[]) => {
            setUpdatedQuizContent((prevUpdatedQuizContent) => {
                if (prevUpdatedQuizContent == undefined) {
                    return undefined;
                }
                return {
                    ...prevUpdatedQuizContent,
                    quizQuestions: newQuestions,
                };
            });
        };
    
        const onAnswerSelection = (questionIndex: number, value: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);
    
            setQuizSubmission((prevSubmission) => {
                const newSubmission = [...prevSubmission];
                if (newSubmission[questionIndex].type == 'multiple' && typeof value === 'number') {
                    newSubmission[questionIndex].multiple_value = value;
                } else if (newSubmission[questionIndex].type == 'short' && typeof value === 'string') {
                    newSubmission[questionIndex].short_value = value;
                } else if (newSubmission[questionIndex].type == 'long' && typeof value === 'string') {
                    newSubmission[questionIndex].long_value = value;
                }
                newSubmission[questionIndex].question =
                    quizContent?.quizQuestions[questionIndex].question;
                return newSubmission;
            });
        };
    
        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };
    
        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={false}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'grade-view'}
            />
        );
    }
};

export const GradeEdit: Story = {
    render: () => {
        const [quizContent, setQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [updatedQuizContent, setUpdatedQuizContent] = useState<AssignmentBuilderProps | undefined>(undefined);
        const [quizSubmission, setQuizSubmission] = useState<IQuizSubmission[]>([]);

        const [title, setTitle] = useState("Practice Quiz");
        const [description, setDescription] = useState('"Test your science knowledge!"');
    
        const onQuizChange = (newQuestions: Question[]) => {
            setUpdatedQuizContent((prevUpdatedQuizContent) => {
                if (prevUpdatedQuizContent == undefined) {
                    return undefined;
                }
                return {
                    ...prevUpdatedQuizContent,
                    quizQuestions: newQuestions,
                };
            });
        };
    
        const onAnswerSelection = (questionIndex: number, value: string | number | File) => {
            console.log(`Question Index: ${questionIndex}`);
            console.log(`Value: ${value}`);
    
            setQuizSubmission((prevSubmission) => {
                const newSubmission = [...prevSubmission];
                if (newSubmission[questionIndex].type == 'multiple' && typeof value === 'number') {
                    newSubmission[questionIndex].multiple_value = value;
                } else if (newSubmission[questionIndex].type == 'short' && typeof value === 'string') {
                    newSubmission[questionIndex].short_value = value;
                } else if (newSubmission[questionIndex].type == 'long' && typeof value === 'string') {
                    newSubmission[questionIndex].long_value = value;
                }
                newSubmission[questionIndex].question =
                    quizContent?.quizQuestions[questionIndex].question;
                return newSubmission;
            });
        };
    
        const onQuizSubmit = () => {
            console.log('Quiz Submit');
        };
    
        return (
            <AssignmentBuilder
                quizQuestions={primaryQuizQuestions}
                title={title}
                description={description}
                allowEdit={false}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onQuizChange={onQuizChange}
                onAnswerSelection={onAnswerSelection}
                onSubmit={onQuizSubmit}
                mode={'grade-edit'}
                studentName={"John Doe"}
                gradedPoints={95}
                totalPoints={100}
                submissionNumber={3}
                totalSubmissions={8}
            />
        );
    }
};

//export default function Test() {}
