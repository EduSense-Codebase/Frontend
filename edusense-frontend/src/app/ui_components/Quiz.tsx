'use client';

import { useState } from "react";
import { IQuiz, } from '../typedef';
import PointsPopup from "./PointsPopup";
import { motion, AnimatePresence } from 'framer-motion';
import { httpPost } from "../utils";
import { API_PREFIX, AUTH_ENDPOINT } from "../global";

interface QuizProps {
    quiz: IQuiz,
    title: string
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

const Quiz: React.FC<QuizProps> = ({ quiz, title }) => {
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [showPointsPopup, setShowPointsPopup] = useState(false);

    const [curAnswered, setCurAnswered] = useState(false);

    const handleStart = () => {
    setStarted(true);
    };

    const handleSelectAnswer = (index: number) => {
    setHasSubmitted(false);
    setSelectedAnswer(index);
    };

    const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = quiz.correct_ans[currentQuestionIndex];
    const selected = quiz.choices[currentQuestionIndex][selectedAnswer][0];

    if (selected === correct && !curAnswered) {
        setShowPointsPopup(true);
    
        // Automatically hide after 2 seconds (optional, in case popup component doesn't auto-close)
        setTimeout(() => setShowPointsPopup(false), 10000);
        
        const API_URL = API_PREFIX + AUTH_ENDPOINT
        const queryParams = {
            "type": "add_points"
        }
        const formData = {
            "event_type": "correct_answer"
        }

        const response = httpPost(API_URL, formData, queryParams);
        response.then((res)=>{
            console.log(res["data"]);
        })



    }
    setCurAnswered(true)

    //console.log(`Correct: ${correct}, Selected: ${selected}`);
    setHasSubmitted(true);
    };

    const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(-1);
        setHasSubmitted(false);
        setCurAnswered(false)
    } else {
        alert("Quiz completed!");
    }
    };

    const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;

    return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl">
        <h1 className="text-3xl text-gray-700 font-bold mb-8 text-center">
        {title || "Untitled"}
        </h1>

        <AnimatePresence mode="wait">
    {!started ? (
        <motion.div
        key="start-button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center"
        >
        <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-300"
        >
            Start
        </button>
        </motion.div>
    ) : (
        <motion.div
        key={`quiz-content-${currentQuestionIndex}`} // re-animates on question change
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
        >
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
            <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            />
        </div>

        {quiz.passage && (
            <p className="text text-gray-800 mt-6">{quiz.passage}</p>
        )}

        {/* Question */}
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">
            {quiz.questions[currentQuestionIndex]}
        </h2>

        {/* Options with stagger */}
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
            visible: {
                transition: {
                staggerChildren: 0.1,
                },
            },
            }}
            className="flex flex-col gap-4 mt-4 text-gray-500"
        >
            {quiz.choices[currentQuestionIndex].map((option, index) => (
            <motion.div
                key={index}
                variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
                }}
            >
                <QuizOption
                option={option}
                index={index}
                selectedAnswer={selectedAnswer}
                correctAnswer={quiz.correct_ans[currentQuestionIndex]}
                hasSubmitted={hasSubmitted}
                onSelect={handleSelectAnswer}
                />
            </motion.div>
            ))}
        </motion.div>

        {hasSubmitted && (
            <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
            <strong>Explanation:</strong> {quiz.reasoning[currentQuestionIndex][selectedAnswer]}
            </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-between gap-4">
            <button
            onClick={handleSubmit}
            className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
            Submit Answer
            </button>

            <button
            onClick={handleNext}
            disabled={!hasSubmitted}
            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Next Question
            </button>
        </div>
        </motion.div>
    )}
    </AnimatePresence>

        {showPointsPopup && (
        <PointsPopup points={10} onClose={() => setShowPointsPopup(false)} />
        )}
    </div>
    );
};

export default Quiz;
