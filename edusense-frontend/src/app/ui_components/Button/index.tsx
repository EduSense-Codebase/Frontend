// ui_components/Button.tsx
import React from 'react';
import { ReactNode } from 'react';
import './Button.scss';

export interface IButtonProps {
    children?: ReactNode; 
    displayName?: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'icon' | 'icon-secondary';
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
                {displayName && <p>{displayName}</p>}
            </button>
        </>
    );
};

export default Button;
