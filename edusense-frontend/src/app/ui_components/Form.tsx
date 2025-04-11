// ui_components/Form.tsx
import React from "react";
import Input from "./Input";
import Button from "./Button";

export interface IFormFieldBase {
  type: "text" | "email" | "password";
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
  submitDisplayName: string;
}

const Form: React.FC<IFormProps> = ({
  metadata,
  fields,
  callbackFunc,
  submitCallback,
  submitDisplayName,
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitCallback();
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full max-w-md mx-auto bg-white border border-gray-300 p-8 rounded-xl shadow-sm space-y-5 ${
        metadata?.formClassName || ""
      }`}
    >
      {metadata?.heading && (
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          {metadata.heading}
        </h2>
      )}

      {fields.map((field, index) => (
        <div
          className={`flex flex-col ${metadata?.inputGroupClassName || ""}`}
          key={field.callbackID || index}
        >
          <label className="mb-1 text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={field.value}
            onChange={(val) => callbackFunc(field.callbackID, val)}
            disabled={field.disabled}
            className={`w-full border border-gray-300 px-4 py-2 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              field.className || ""
            }`}
          />
        </div>
      ))}

      <Button
        displayName={submitDisplayName}
        onClick={submitCallback}
        variant="primary"
      />
    </form>
  );
};

export default Form;
