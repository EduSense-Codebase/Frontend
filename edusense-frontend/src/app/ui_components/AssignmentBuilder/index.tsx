import React, { useEffect } from 'react';
import { useState } from 'react';
import './AssignmentBuilder.scss';
import AssignmentBuilderView from './view';
import AssignmentBuilderEdit from './edit';
import AssignmentBuilderGradeView from './gradeview';
import AssignmentBuilderGradeEdit from './gradeedit';

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
    points?: number;
    question: string;
    description?: string;
    isRequired: boolean;
    mode?: QuestionMode;
    order_index: number;
    feedback?: string[];
    is_correct?: boolean;
}

export interface LongAnswerQuestion extends BaseQuestion {
    type: 'long';
    file?: File;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: 'multiple';
    options: Option[];
    selectedOptionId?: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
    type: 'short';
    answer: string;
    correctAnswers: CorrectAnswer[];
    studentAnswer?: string;
}

export interface AssignmentBuilderProps {
    quizQuestions: Question[];
    title: string;
    description: string;
    allowEdit: boolean;
    onQuizChange: (newQuizQuestions: Question[]) => void;
    onDescriptionChange: (newDescription: string) => void;
    onTitleChange: (newTitle: string) => void;
    onAnswerSelection: (index: number, value?: string | number | File) => void;
    onSubmit: () => void;
    mode: Mode;
    studentName?: string;
    gradedPoints?: number;
    totalPoints?: number;
    submissionNumber?: number;
    totalSubmissions?: number;
}

export type Question = LongAnswerQuestion | MultipleChoiceQuestion | ShortAnswerQuestion;

const AssignmentBuilder: React.FC<AssignmentBuilderProps> = (props) => {
    const [questions, setQuestions] = useState<Question[]>(() => {
        return props.quizQuestions.sort((left, right) => left.order_index - right.order_index);
    });
    const [quizTitle, setQuizTitle] = useState(props.title);
    const [quizDescription, setQuizDescription] = useState(props.description);

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
