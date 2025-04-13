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

/* ********************* Axios Response Types END *********************** */