'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { httpPost } from '../../../../utils';
import { AI_ENDPOINT, API_PREFIX } from "../../../../global";
import { IQuiz, IQuizResponse} from '../../../../typedef';
import Quiz from '../../../../ui_components/Quiz'


export default function QuizPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const quizName = decodeURIComponent(params.quizTitle  as string)
    const [quiz, setQuiz] = useState<IQuiz>();

    useEffect(() => {

        const apiUrl = API_PREFIX + AI_ENDPOINT;
        const queryParams = {
            section: "generate_ai_content"
        }
        const prompt_parameters = {
            "title": quizName,

        }
        const formData = {
            enrollment_id: enrollmentId,
            prompt_type: "quiz_mc",
            prompt_parameters: JSON.stringify(prompt_parameters),
        }

        const response = httpPost<IQuizResponse>(apiUrl, formData, queryParams);
        response.then((response) => {
            console.log(response.data)
            console.log(response.data.data)
            setQuiz(response.data.data)

        })



    },[])

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-white">
            {quiz ? <Quiz quiz={quiz} title={quizName} /> : <p>Loading...</p>}
        </div>

    );
}


