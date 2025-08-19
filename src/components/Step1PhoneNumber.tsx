// src/components/Step1PhoneNumber.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";

// Define the interface for the component's props
interface Step1PhoneNumberProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading: boolean;
}

const Step1PhoneNumber: React.FC<Step1PhoneNumberProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [countryCode, setCountryCode] = useState<string>("BD"); // Explicitly type as string
  const [number, setNumber] = useState<string>(""); // Explicitly type as string

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Type event object as FormEvent
    e.preventDefault();
    // In a real app, you'd send this number to your backend to send a verification code
    onSubmit(`${number}`);
  };

  return (
    <div className="text-center bg-white p-10 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
      <p className="text-gray-600 mb-6">Log in to your company app</p>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center border border-gray-300 rounded-md p-2 mb-4">
          <select
            className="bg-white outline-none mr-2"
            value={countryCode}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setCountryCode(e.target.value)
            } // Type event object as ChangeEvent<HTMLSelectElement>
          >
            <option value="BD">BD</option>
            {/* Add more country codes as needed */}
          </select>
          <span className="text-gray-500">+880</span>
          <input
            type="text"
            className="flex-grow ml-2 outline-none"
            placeholder="e.g., 1234567890"
            value={number}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNumber(e.target.value)
            } // Type event object as ChangeEvent<HTMLInputElement>
            required
          />
        </div>
        <p className="text-sm text-gray-500 mb-6">
          We'll send you a code to verify your number
        </p>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          {isLoading ? " Verifying..." : " Verify"}
        </button>
      </form>
    </div>
  );
};

export default Step1PhoneNumber;
