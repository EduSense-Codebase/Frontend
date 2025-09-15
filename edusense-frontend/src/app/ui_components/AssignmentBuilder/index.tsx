import React, { useEffect } from 'react';
import { useState } from 'react';
import './AssignmentBuilder.scss';
import AssignmentBuilderView from './view';
import AssignmentBuilderEdit from './edit';
import AssignmentBuilderGradeView from './gradeview';
import AssignmentBuilderGradeEdit from './gradeedit';
import { IFileInfo } from '@/app/typedef';

export type Mode = 'view' | 'edit' | 'grade-view' | 'grade-edit';

export type QuestionType = 'long' | 'multiple' | 'short';

type QuestionMode = 'view' | 'edit';

interface Option {
    id: string;
    text: string;
    isCorrect?: boolean;
}

interface CorrectAnswer {
    id: string;
    text: string;
}

export interface BaseQuestion {
    id: string;
    type: QuestionType;
    question: string;
    isRequired: boolean;
    orderIndex: number;
    points?: number;
    mode?: QuestionMode;
    feedback?: string[]; // For Graded Views
    isCorrect?: boolean; // For Graded Views
}

export interface LongAnswerQuestion extends BaseQuestion {
    type: 'long';
    description?: string;
    file?: IFileInfo;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple';
    options: Option[];
    selectedOptionId?: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
    type: 'short';
    correctAnswers: CorrectAnswer[];
    answer?: string;
    studentAnswer?: string;
}

export interface AssignmentBuilderProps {
    quizQuestions: Question[];
    title: string;
    description: string;
    onQuizChange?: (newQuizQuestions: Question[]) => void;
    onDescriptionChange?: (newDescription: string) => void;
    onTitleChange?: (newTitle: string) => void;
    onAnswerSelection?: (index: number, value?: string | number | File) => void;
    onSubmit?: () => void;
    mode: Mode;
    studentName?: string;
    gradedPoints?: number;
    totalPoints?: number;
    submissionNumber?: number;
    totalSubmissions?: number;
}

export type Question = LongAnswerQuestion | MultipleChoiceQuestion | ShortAnswerQuestion;

const AssignmentBuilder: React.FC<AssignmentBuilderProps> = (props) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');

    useEffect(() => {
        setQuestions(() => {
            return props.quizQuestions.sort((left, right) => left.orderIndex - right.orderIndex);
        });
    }, [props.quizQuestions]);

    useEffect(() => {
        setQuizTitle(props.title);
    }, [props.title]);

    useEffect(() => {
        setQuizDescription(props.description);
    }, [props.description]);

    useEffect(() => {
        props.onQuizChange?.(questions);
    }, [questions]);

    useEffect(() => {
        props.onTitleChange?.(quizTitle);
    }, [quizTitle]);

    useEffect(() => {
        props.onDescriptionChange?.(quizDescription);
    }, [quizDescription]);

    if (props.mode == 'view') {
        return <AssignmentBuilderView {...props} />;
    }

    if (props.mode == 'edit') {
        return (
            <AssignmentBuilderEdit
                {...props}
                quizQuestions={questions}
                title={quizTitle}
                description={quizDescription}
                setQuestions={setQuestions}
                setQuizDescription={setQuizDescription}
                setQuizTitle={setQuizTitle}
            />
        );
    }

    if (props.mode == 'grade-view') {
        return (
            <AssignmentBuilderGradeView
                {...props}
                quizQuestions={questions}
                setQuestions={setQuestions}
            />
        );
    }

    if (props.mode == 'grade-edit') {
        return (
            <AssignmentBuilderGradeEdit
                {...props}
                quizQuestions={questions}
                setQuestions={setQuestions}
            />
        );
    }
};

export default AssignmentBuilder;
