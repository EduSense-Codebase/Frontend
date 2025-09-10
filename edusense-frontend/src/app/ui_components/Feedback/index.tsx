import React from 'react';
import { useState } from 'react';
import { Mode } from '../MultipleChoiceQ/index';
import './Feedback.scss';

interface FeedbackProps {
    mode: Mode;
    feedback: string[];
    onChangeFeedback: (newFeedback: string[]) => void;
}

const Feedback: React.FC<FeedbackProps> = ({
    mode,
    feedback,
    onChangeFeedback
}) => {
    const [input, setInput] = useState('');

    return (
        <div>
        {(mode === "grade-edit") && (
            <div className='feedback-component'>
                <hr/>
                <h2>Feedback</h2>
                {feedback.map((fb, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                    type="text"
                    value={fb}
                    onChange={(e) => {
                        const newFeedback = [...feedback];
                        newFeedback[idx] = e.target.value;
                        onChangeFeedback?.(newFeedback);
                    }}
                    />
                    <button
                    onClick={() => {
                        const newFeedback = feedback.filter((_, i) => i !== idx);
                        onChangeFeedback?.(newFeedback);
                    }}
                    className="text-[#4b76b3] font-bold px-2 cursor-pointer"
                    >
                    ✕
                    </button>
                </div>
                ))}

                <form
                className="flex gap-2 mt-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!input.trim()) return;
                    onChangeFeedback?.([...feedback, input.trim()]);
                    setInput("");
                }}
                >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="feedback-input"
                    placeholder="Add new feedback..."
                />
                <button type="submit" className="send-icon">
                    <img src="/airplane.svg" alt="send" />
                </button>
                </form>
            </div>
        )}
            {(mode === "grade-view") && (
                <div className='feedback-component'>
                    <hr/>
                    <h2>Feedback</h2>
                    {feedback.length === 0 ? (
                        <p className='text-gray-500'>No feedback available.</p>
                    ) : (
                        <ul>
                        {feedback.map((fb, idx) => (
                            <li key={idx}>{fb}</li>
                        ))}
                        </ul>
                    )}
                </div>
            )}  
        </div>
    );
};

export default Feedback;