/* ********************* Generic Types START ********************* */
export interface ICourse {
  id: number;
  name: string;
  color: string;
  takenDiag: boolean;
  roadmaps: string[];
}

export interface IOfferedCourse {
  id: number;
  course_name: string;
}

export interface IUserInfo {
    name: string,
    age: number
}

export interface IJourney {
    title: string,
    description: string
}

export interface IArticle {
    article_title: string,
    sections: string[],
    section_content: string[]
}

export interface IQuiz{
    questions: string[]
    choices:string[][]
    correct_ans: string[]
    reasoning: string[][]
    length: number
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

export interface IJourneyResponse {
    data: {
        title: string[];
        description: string[];
    }
}

export interface IArticleResponse {
    data: IArticle
}

export interface IFrontendAIResponse {
  data: {
    response: string
  }
}

export interface IQuizResponse{
    data: IQuiz 
}

/* ********************* Axios Response Types END *********************** */