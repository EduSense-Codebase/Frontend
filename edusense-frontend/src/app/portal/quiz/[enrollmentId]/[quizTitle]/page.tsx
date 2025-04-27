'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { httpPost } from '../../../../utils';
import { AI_ENDPOINT, API_PREFIX } from "../../../../global";

export interface IQuiz{
    questions: string[]
    choices:string[][]
    length: number
}

export interface IQuizResponse{
    data: IQuiz 
}

export default function QuizPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const quizName = params.quizTitle as string

    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [cleanTitle, setCleanTitle] = useState("");

    useEffect(() => {
        const quizTitleArray = quizName.split("%")
        const cleaned = quizTitleArray.join(" ")
        setCleanTitle(cleaned) 
        const apiUrl = API_PREFIX + AI_ENDPOINT;
        const queryParams = {
            section: "generate_ai_content"
        }
        const prompt_parameters = {
            "title": quizName

        }
        const formData = {
            enrollment_id: enrollmentId,
            prompt_type: "quiz_mc",
            prompt_parameters: JSON.stringify(prompt_parameters),
        }

        const response = httpPost<IQuizResponse>(apiUrl, formData, queryParams);
        response.then((response) => {
            console.log(response.data)

        })



    },[])

    // Dummy questions for now
    const questions = [
        {
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        },
        {
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
        },
        {
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['Shakespeare', 'Hemingway', 'Orwell', 'Tolkien'],
        },
    ];

    const handleStart = () => {
        setStarted(true);

    };

    const handleSelectAnswer = (index: number) => {
        setSelectedAnswer(index);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null); // reset selection
        } else {
        // For now just alert finished
        alert('Quiz completed!');
        }
    };

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-white">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl">
            {/* Quiz Title */}
            <h1 className="text-3xl text-gray-700 font-bold mb-8 text-center">
            Quiz: {cleanTitle}
            </h1>

            {/* Start Button */}
            {!started && (
            <div className="flex justify-center">
                <button
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-300"
                >
                Start Quiz
                </button>
            </div>
            )}

            {/* Quiz Content */}
            {started && (
            <div className="space-y-6">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-semibold text-gray-800 mt-6">
                {questions[currentQuestionIndex].question}
                </h2>

                {/* Options */}
                <div className="flex flex-col gap-4 mt-4 text-gray-500">
                {questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border font-medium transition duration-200 ${
                        selectedAnswer === index
                        ? 'bg-indigo-500 text-white border-indigo-500'
                        : 'bg-gray-100 hover:bg-indigo-100 border-gray-300 text-gray-700'
                    }`}
                    >
                    {option}
                    </button>
                ))}
                </div>

                {/* Next Button */}
                <div className="flex justify-end mt-8">
                <button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-300"
                >
                    Next
                </button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    //this is a comment
}
