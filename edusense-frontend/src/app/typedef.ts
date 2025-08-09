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


export interface IAssignmentsResponse{

    data: IAssignments[];
}



export interface IPermissionsResponse {
    data: IPermissions;
}

/* ********************* Axios Response Types END *********************** */

/* ********************* Mock Data START *********************** */



/* ********************* Mock Data END *********************** */
