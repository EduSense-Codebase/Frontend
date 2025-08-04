/* ********************* Generic Types START ********************* */


export interface IPermissions{
    join_course: boolean;
    create_course: boolean;
    edit_course: boolean;
    quick_actions: boolean;
}

export interface ICourse {
    id: number;

    course_name: string;
    color: string;
    takenDiag: boolean;
    roadmaps: string[];
}

export interface IOfferedCourse {
    id: number;
    course_name: string;
}

export interface IUserInfo {
    name: string;
    age: number;
}

export interface IJourney {
    title: string;
    description: string;
    type: string;
}

export interface IArticle {
    article_title: string;
    sections: string[];
    section_content: string[];
}

export interface IQuiz {
    questions: string[];
    choices: string[][];
    correct_ans: string[];
    reasoning: string[][];
    length: number;
    passage: string;
}

export interface IMatchingActivity {
    title: string;
    description: string;
    left_items: string[];
    right_items: string[];
    correct_pairs: [string, string][];
}

export type Task = {
    id: number;
    title: string;
    status: 'pending' | 'completed';
};

/* ********************* Generic Types END *********************** */

/* ********************* Axios Response Types START ********************* */

export interface IUserInfoResponse {
    data: IUserInfo;
}

export interface IAllOfferedResponse {
    data: IOfferedCourse[];
}

export interface IAllEnrolledCourseResponse {
    data: ICourse[];
}

export interface INewEnrollment {
    data: ICourse;
}

export interface IJourneyResponse {
    data: {
        title: string[];
        description: string[];
        type: string[];
    };
}

export interface IArticleResponse {
    data: IArticle;
}

export interface IFrontendAIResponse {
    data: {
        response: string;
    };
}

export interface IQuizResponse {
    data: IQuiz;
}

export interface IPointsRespones {
    data: {
        points: number;
        level: number;
        current_threshold: number;
        next_threshold: number;
    };
}

export interface IMatchingActivityResponse {
    data: IMatchingActivity;
}

export interface IPermissionsResponse{
    data: IPermissions;
}

/* ********************* Axios Response Types END *********************** */

/* ********************* Mock Data START *********************** */

// Example in app/sat/page.tsx (or wherever you're working)
export const mockTasks: Task[] = [
    { id: 1, title: 'Finish Reading Lesson 2', status: 'pending' },
    { id: 2, title: 'Take Practice Quiz 1', status: 'pending' },
    { id: 3, title: 'Review missed questions', status: 'completed' },
    { id: 4, title: 'Watch timing strategy video', status: 'pending' },
    { id: 5, title: 'Complete Vocab Drill', status: 'pending' },
];

/* ********************* Mock Data END *********************** */
