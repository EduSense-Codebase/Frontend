import React from 'react';

interface MCInputProps {
    label: string;
    options: string[];
    name: string;
    selectedValue: string;
    onChange: (val: string) => void;
    className?: string;
}

const MCInput: React.FC<MCInputProps> = ({
    label,
    options,
    name,
    selectedValue,
    onChange,
    className = '',
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label className="mb-1 block font-semibold text-gray-700">{label}</label>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option} className="flex items-center space-x-2 text-gray-700">
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
    );
};

export default MCInput;
