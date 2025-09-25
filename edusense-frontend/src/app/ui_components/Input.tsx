// ui_components/Input.tsx
import React from 'react';

interface InputProps {
    id: string,
    type: 'text' | 'email' | 'password';
    value: string;
    placeholder?: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    id,
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
            data-testid={id}
        />
    );
};

export default Input;
