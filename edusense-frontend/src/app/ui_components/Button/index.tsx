// ui_components/Button.tsx
import React from 'react';
import './Button.scss';

export interface IButtonProps {
    displayName: string;
    onClick: () => void;
    variant?: 'primary' | 'danger';
    icon?: string;
}

const Button: React.FC<IButtonProps> = ({ displayName, onClick, variant = 'primary', icon }) => {
    return (
        <>
            <button
                className={`button button--${variant}`}
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
            >
                {icon && <img src={icon} alt={`${displayName} icon`} className="button-icon" />}
                <p>{displayName}</p>
            </button>
        </>
    );
};

export default Button;
