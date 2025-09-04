// src/components/Step2VerifyCode.tsx
import React, { useState, ChangeEvent, KeyboardEvent } from "react";
// import { Link } from "react-router-dom";

// Define the types for the component's props
interface Step2VerifyCodeProps {
  phoneNumber: string;
  onVerify: (code: string) => void;
  isLoading: boolean;
}

const Step2VerifyCode: React.FC<Step2VerifyCodeProps> = ({
  phoneNumber,
  onVerify,
  isLoading,
}) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]); // State for each digit, explicitly an array of strings

  const handleChange = (index: number, value: string) => {
    // Ensure only digits are entered
    const numericValue = value.replace(/\D/g, "");

    // Paste handling: if pasting into the first field and length >= 2, distribute
    if (index === 0 && numericValue.length > 1) {
      const newCode = Array(6)
        .fill("")
        .map((_, i) => numericValue[i] || "");
      setCode(newCode);
      // Focus the last filled input
      const lastIdx = Math.min(numericValue.length - 1, 5);
      setTimeout(() => {
        document.getElementById(`code-input-${lastIdx}`)?.focus();
      }, 0);
      return;
    }

    // Only update if it's a single digit or empty string (for backspace clearing)
    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Auto-focus to the next input if a digit was entered and it's not the last input
      if (numericValue && index < 5) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // If Backspace is pressed and the current input is empty, focus the previous input
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullCode = code.join("");
    // In a real app, you'd send this code to your backend for verification
    console.log("Verifying code:", fullCode);
    onVerify(fullCode); // Assuming verification is successful for now
  };

  return (
    <div className="text-center bg-white px-5 py-10 rounded-2xl ">
      <h2 className="text-2xl font-semibold mb-4">Enter the 6 digit code</h2>
      <p className="text-gray-600 mb-6">Sent to {phoneNumber}</p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(index, e.target.value)
              }
              onPaste={
                index === 0
                  ? (e) => {
                      const paste = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "");
                      if (paste.length > 1) {
                        e.preventDefault();
                        handleChange(0, paste);
                      }
                    }
                  : undefined
              }
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(index, e)
              }
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full disabled:cursor-not-allowed disabled:opacity-70 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-4"
        >
          {isLoading ? " Verifying..." : " Verify"}
        </button>
      </form>
    </div>
  );
};

export default Step2VerifyCode;
