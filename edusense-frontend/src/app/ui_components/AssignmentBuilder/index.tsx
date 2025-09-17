import React from 'react';
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
    totalPoints?: number;
    mode?: QuestionMode;
    feedback?: string[]; // For Graded Views
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
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
    setQuizTitle: React.Dispatch<React.SetStateAction<string>>;
    setQuizDescription: React.Dispatch<React.SetStateAction<string>>;
    onQuizChange?: (newQuizQuestions: Question[]) => void;
    onDescriptionChange?: (newDescription: string) => void;
    onTitleChange?: (newTitle: string) => void;
    onAnswerSelection?: (index: number, value?: string | number | File) => void;
    onSubmit?: () => void;
    onChangeStudentSubmission?: (direction: 'front' | 'back') => void;
    mode: Mode;
    studentName?: string;
    gradedPoints?: number;
    totalPoints?: number;
    submissionNumber?: number;
    totalSubmissions?: number;
}

export type Question = LongAnswerQuestion | MultipleChoiceQuestion | ShortAnswerQuestion;

const AssignmentBuilder: React.FC<AssignmentBuilderProps> = (props) => {
    if (props.mode == 'view') {
        return <AssignmentBuilderView {...props} />;
    }

    if (props.mode == 'edit') {
        return <AssignmentBuilderEdit {...props} />;
    }

    if (props.mode == 'grade-view') {
        return <AssignmentBuilderGradeView {...props} />;
    }

    if (props.mode == 'grade-edit') {
        return <AssignmentBuilderGradeEdit {...props} />;
    }
};

export default AssignmentBuilder;
