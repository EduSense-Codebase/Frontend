// ui_components/Button.tsx
import React from 'react';

export interface IButtonProps {
    displayName: string;
    onClick: () => void;
    variant?: 'primary' | 'danger';
}

const Button: React.FC<IButtonProps> = ({ displayName, onClick, variant = 'primary' }) => {
    const baseStyles = ' px-4 py-2 rounded font-medium transition duration-200';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-black hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]}`}
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
        >
            {displayName}
        </button>
    );
};

export default Button;
