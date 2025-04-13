/* ********************* Generic Types START ********************* */
export interface ICourse {
  id: number;
  name: string;
  color: string;
  takenDiag: boolean;
}

export interface IOfferedCourse {
  id: number;
  course_name: string;
}

export interface IUserInfo {
    name: string,
    age: number
}

/* ********************* Generic Types END *********************** */

/* ********************* Axios Response Types START ********************* */

export interface IUserInfoResponse {
    data: IUserInfo
}

export interface IAllOfferedResponse {
    data : IOfferedCourse[]
}

export interface IAllEnrolledCourseResponse {
    data: ICourse[]
}

export interface INewEnrollment{
  data: ICourse
}

/* ********************* Axios Response Types END *********************** */