import React, { JSX } from "react";

interface FormInputProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  icon?: JSX.Element;
  readOnly?: boolean;
  className?: string;
  name: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  icon,
  readOnly = false,
  className = "",
  name,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          aria-label={label}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700
            ${
              readOnly
                ? "bg-gray-50 cursor-default"
                : "bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            }
            ${icon ? "pr-10" : ""}
          `}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInput;
