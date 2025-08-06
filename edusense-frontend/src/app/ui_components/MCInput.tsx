import React from 'react';
import '../theme.css';

interface MCInputProps {
    label: string;
    options: string[];
    name: string;
    selectedValue: string;
    onChange: (val: string) => void;
    className?: string;
}

const MCInput: React.FC<MCInputProps> = ({ label, options, name, selectedValue, onChange }) => {
    return (
        <div className="theme-vars">
            <div className="rounded-lg bg-[var(--light-blue)] p-6 shadow-md">
                <label className="paragraph">{label}</label>
                <div className="space-y-2">
                    {options.map((option) => (
                        <label
                            key={option}
                            className="flex items-center space-x-2 pt-2 text-gray-700"
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option}
                                checked={selectedValue === option}
                                onChange={(e) => onChange(e.target.value)}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MCInput;
