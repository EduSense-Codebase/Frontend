import React from 'react';
import './Dropdown.scss';

interface DropdownProps {
    label?: string;
    options: string[];
    values?: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    values,
    value,
    onChange,
    placeholder,
}) => {
    return (
        <div className="dropdown-container">
            {label && <label className="dropdown-label">{label}</label>}
            <select
                className="dropdown-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option, index) => (
                    <option key={index} value={values ? values[index] : option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
