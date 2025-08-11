import React from 'react';

const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}> = ({ checked, onChange, disabled = false }) => {
    return (
        <label className={`toggle-switch ${disabled ? 'toggle-switch--disabled' : ''}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className="toggle-switch__slider"></span>
        </label>
    );
};

export default ToggleSwitch;