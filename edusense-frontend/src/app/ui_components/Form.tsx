// ui_components/Form.tsx
import React from 'react';
import Input from './Input';
import Button from './Button';

export interface IFormFieldBase {
    id: string;
    type: 'text' | 'email' | 'password';
    value: string;
    callbackID: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export interface IFormProps {
    metadata?: {
        formClassName?: string;
        inputGroupClassName?: string;
        heading?: string;
    };
    fields: IFormFieldBase[];
    callbackFunc: (callbackID: string, value: string) => void;
    submitCallback: () => void;
    submitId: string;
    submitDisplayName: string;
    extraComponents?: React.ReactElement;
}

const Form: React.FC<IFormProps> = ({
    metadata,
    fields,
    callbackFunc,
    submitCallback,
    submitId,
    submitDisplayName,
    extraComponents,
}) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitCallback();
    };

    return (
        <form
            onSubmit={onSubmit}
            className={`mx-auto w-full max-w-lg space-y-5 rounded-xl border border-gray-300 bg-white p-8 shadow-sm ${
                metadata?.formClassName || ''
            }`}
        >
            {metadata?.heading && (
                <h2 className="text-center text-2xl font-semibold text-gray-800">
                    {metadata.heading}
                </h2>
            )}

            {fields.map((field, index) => (
                <React.Fragment key={index}>
                    <label className="mb-1 text-sm font-medium text-gray-700">{field.label}</label>
                    <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(val) => callbackFunc(field.callbackID, val)}
                        disabled={field.disabled}
                        className={`w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                            field.className || ''
                        }`}
                    />
                </React.Fragment>
            ))}

            <Button
                displayName={submitDisplayName}
                onClick={submitCallback}
                variant="primary"
                id={submitId}
            />
            {extraComponents}
        </form>
    );
};

export default Form;
