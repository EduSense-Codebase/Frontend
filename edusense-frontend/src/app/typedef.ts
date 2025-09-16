/* ********************* Generic Types START ********************* */

import { IQuizConfiguration, IQuizPerStudentInformation, IQuizSubmission } from './portal/builder/[courseId]/[builderId]/page';
import { Mode } from './ui_components/AssignmentBuilder';
import React from 'react';

export interface IFileInfo {
    file_id: number;
    name: string;
    size: number;
    url: string;
}

export interface IFile {
    id: number;
    filename: string;
    description: string;
    uploaded_at: string; // ISO string from backend
    url: string;
    student_uploaded: boolean;
    student_facing: boolean;
}

export interface IPermissions {
    join_course: boolean;
    create_course: boolean;
    edit_course: boolean;
    quick_actions: boolean;
}

export interface ICourse {
    id: number;
    course_name: string;

    institution: number;
    join_code: string;
    teacher_id: number;
}

export interface IOfferedCourse {
    id: number;
    course_name: string;
}

export interface IAnnouncements {
    title: string;
    content: string;
}

export interface IAssignments {
    id: number;
    name: string;
    created: string; // ISO date string from backend
    due: string; // ISO date string from backend
    description: string;
    points: number;
    module: number;
    builder: number;
    graded: number;
    assignment_data: Record<string, unknown>; // empty or dynamic object
}

export interface IModules {
    id: number;
    title: string;
    created: string;
    course: number;
}

export interface IAISession {
    id: number;
    name: string;
}

export interface IStudentData {
    email: string;
    name: string;
    overall_grade: number;
}

export interface IAIAgentData {
    internal_name: string;
    external_name: string;
}

/* ********************* Generic Types END *********************** */

/* ********************* Axios Response Types START ********************* */

export interface IFileResponse {
    data: IFile[];
}

export interface IOneFileResponse {
    data: IFile;
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

export interface IAnnouncementsResponse {
    data: IAnnouncements[];
}

export interface IModulesResponse {
    data: IModules[];
}

export interface IModuleResponse {
    data: IModules;
}

export interface IAssignmentsResponse {
    data: IAssignments[];
}

export interface IPermissionsResponse {
    data: IPermissions;
}

export interface IFetchAllAISessions {
    data: IAISession[];
}

export interface IAIJwtTokenRespose {
    jwt: string;
}

export interface IBuilderResponse {
    type: 'text' | 'quiz_or_assignment';
    is_assignment_created: boolean;
    mode: Mode;
    text_content?: string;
    quiz_or_assignment_content?: IQuizConfiguration;
    submission_data?: IQuizSubmission[];
    all_students_submission_data?: Record<number,IQuizPerStudentInformation>
}

export interface ISubmitFileResponse {
    data: IFileInfo;
}

export interface IStudentDataResponse {
    data: IStudentData[];
}

export interface IAIAgentsResponse {
    data: IAIAgentData[];
}

export interface IEnrollOrCreateCourseResponse {
    data: ICourse;
}

export interface ICustomProps {
    permissions: IPermissions | undefined;
    setPermissions: React.Dispatch<React.SetStateAction<IPermissions | undefined>>;
    institution: string;
    setInstitution: React.Dispatch<React.SetStateAction<string>>;
    courses: ICourse[];
    setCourses: React.Dispatch<React.SetStateAction<ICourse[]>>;
    setCurrCourseId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setCurrBuilderId: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const useCustomProp = () => {
    const value = React.useContext(CustomPropContext);
    if (value === undefined) {
        throw new Error('useCustomProp must be used within a CustomPropProvider');
    }
    return value;
};

export const CustomPropContext = React.createContext<ICustomProps | undefined>(undefined);
/* ********************* Axios Response Types END *********************** */

/* ********************* Mock Data START *********************** */

/* ********************* Mock Data END *********************** */
