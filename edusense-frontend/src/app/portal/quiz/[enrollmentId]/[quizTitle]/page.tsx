'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { httpPost } from '../../../../utils';
import { AI_ENDPOINT, API_PREFIX } from "../../../../global";

export interface IQuiz{
    questions: string[]
    choices:string[][]
    correct_ans: string[]
    reasoning: string[][]
    length: number
}

export interface IQuizResponse{
    data: IQuiz 
}

interface QuizOptionProps {
    option: string;
    index: number;
    selectedAnswer: number | null;
    correctAnswer: string;
    hasSubmitted: boolean;
    onSelect: (index: number) => void;
  }
  
const QuizOption: React.FC<QuizOptionProps> = ({
    option,
    index,
    selectedAnswer,
    correctAnswer,
    hasSubmitted,
    onSelect,
  }) => {
    const isCorrect = option[0] === correctAnswer;
    const isSelected = index === selectedAnswer;
  
    const baseClasses =
      "w-full text-left p-4 rounded-lg border font-medium transition duration-200";
  
    let stateClasses = "";
  
    if (hasSubmitted) {
      if (isSelected && isCorrect) {
        stateClasses = "bg-green-500 text-white border-green-600";
      } else if (isSelected && !isCorrect) {
        stateClasses = "bg-red-500 text-white border-red-600";
      } else {
        stateClasses = "bg-gray-100 border-gray-300 text-gray-700";
      }
    } else {
      stateClasses = isSelected
        ? "bg-indigo-500 text-white border-indigo-500"
        : "bg-gray-100 hover:bg-indigo-100 border-gray-300 text-gray-700";
    }
  
    return (
      <button onClick={() => onSelect(index)} className={`${baseClasses} ${stateClasses}`}>
        {option}
      </button>
    );
};
  


export default function QuizPage() {
    const params = useParams();
    const enrollmentId = params.enrollmentId as string;
    const quizName = decodeURIComponent(params.quizTitle  as string)

    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [cleanTitle, setCleanTitle] = useState("");
    const [quiz, setQuiz] = useState<IQuiz>();
    const [hasSubmitted, setHasSubmitted] = useState(Boolean)

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
            console.log(response.data.data)
            setQuiz(response.data.data)

        })



    },[])

    const handleStart = () => {
        setStarted(true);

    };

    const handleSelectAnswer = (index: number) => {
        setHasSubmitted(false)
        setSelectedAnswer(index);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz?.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null); // reset selection
        } else {
        // For now just alert finished
        alert('Quiz completed!');
        }
    };

    const handleSubmit = () => {
        if(selectedAnswer === null) {
            console.log("choose something");
            return;
        }
      
        const correct = quiz?.correct_ans[currentQuestionIndex]
        const current_ans =  quiz?.choices[currentQuestionIndex][selectedAnswer][0]
        console.log(`The correct ans is ${correct} and this is what was selected ${current_ans}`);
        if (current_ans === correct) {
            console.log("Correct!");
        } else {
            console.log("Incorrect.");
        }
        setHasSubmitted(true);
        
    }

    const progress = ((currentQuestionIndex + 1) / quiz?.length) * 100;

    

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
                {quiz?.questions[currentQuestionIndex]  }
                </h2>
                {/* Options */}
                <div className="flex flex-col gap-4 mt-4 text-gray-500">
                {quiz?.choices[currentQuestionIndex].map((option, index) => (
                    <QuizOption
                    key={index}
                    option={option}
                    index={index}
                    selectedAnswer={selectedAnswer}
                    correctAnswer={quiz.correct_ans[currentQuestionIndex]}
                    hasSubmitted={hasSubmitted}
                    onSelect={handleSelectAnswer}
                    />
                ))}
                </div>

                {/* Submit + Next Buttons */}
                <div className="mt-6 flex justify-between gap-4">
                <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                    Submit Answer
                </button>

                <button
                    onClick={handleNext}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Next Question
                </button>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    //this is a comment
}


