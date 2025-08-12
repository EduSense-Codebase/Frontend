/* ********************* Generic Types START ********************* */

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


export interface IAnnouncements{
    title: string,
    content: string,
}

export interface IAssignments {
    id: number;
    name: string;
    created: string; // ISO date string from backend
    due: string;     // ISO date string from backend
    description: string;
    points: number;
    module: number;
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
    name: string
}

export interface IStudentData{
    email: string;
    name: string;
    overall_grade: number;
}



/* ********************* Generic Types END *********************** */

/* ********************* Axios Response Types START ********************* */

export interface IAllOfferedResponse {
    data: IOfferedCourse[];
}

export interface IAllEnrolledCourseResponse {
    data: ICourse[];
}

export interface INewEnrollment {
    data: ICourse;
}



export interface IAnnouncementsResponse{
    data: IAnnouncements[];
}

export interface IModulesResponse{
    data: IModules[];
}


export interface IAssignmentsResponse{

    data: IAssignments[];
}



export interface IPermissionsResponse {
    data: IPermissions;
}

export interface IFetchAllAISessions {
    data: IAISession[]
}

export interface IAIJwtTokenRespose {
    jwt: string 
}

export interface IBuilderResponse {
    type: "text" | "quiz_or_assignment",
    text_content?: string
}

export interface IStudentDataResponse {
    data: IStudentData[];
}

/* ********************* Axios Response Types END *********************** */

/* ********************* Mock Data START *********************** */



/* ********************* Mock Data END *********************** */
