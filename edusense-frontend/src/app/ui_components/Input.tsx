// ui_components/Input.tsx
import React from 'react';

interface InputProps {
    type: 'text' | 'email' | 'password';
    value: string;
    placeholder?: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    type,
    value,
    placeholder,
    onChange,
    disabled,
    className = '',
}) => {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={className}
        />
    );
};

export default Input;
