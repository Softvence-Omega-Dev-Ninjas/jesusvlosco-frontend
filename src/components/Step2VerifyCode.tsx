// src/components/Step2VerifyCode.tsx
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

// Define the types for the component's props
interface Step2VerifyCodeProps {
    phoneNumber: string;
    onVerify: () => void;
}

const Step2VerifyCode: React.FC<Step2VerifyCodeProps> = ({ phoneNumber, onVerify }) => {
    const [code, setCode] = useState<string[]>(['', '', '', '']); // State for each digit, explicitly an array of strings

    const handleChange = (index: number, value: string) => {
        // Ensure only digits are entered
        const numericValue = value.replace(/\D/g, '');

        // Only update if it's a single digit or empty string (for backspace clearing)
        if (numericValue.length <= 1) {
            const newCode = [...code];
            newCode[index] = numericValue;
            setCode(newCode);

            // Auto-focus to the next input if a digit was entered and it's not the last input
            if (numericValue && index < 3) {
                document.getElementById(`code-input-${index + 1}`)?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // If Backspace is pressed and the current input is empty, focus the previous input
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-input-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fullCode = code.join('');
        // In a real app, you'd send this code to your backend for verification
        console.log('Verifying code:', fullCode);
        onVerify(); // Assuming verification is successful for now
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Enter the 4 digit code</h2>
            <p className="text-gray-600 mb-6">Sent to {phoneNumber}</p>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center space-x-2 mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-input-${index}`}
                            type="text" // Changed to 'text' to allow initial empty string, but we'll enforce numeric input
                            inputMode="numeric" // Suggests numeric keyboard on mobile
                            pattern="[0-9]" // HTML5 pattern for single digit
                            maxLength={1} // Ensures only one character can be typed
                            value={digit}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    ))}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    Didn't get the code?{' '}
                    <button type="button" className="text-blue-600 hover:underline">
                        More options
                    </button>
                </p>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-4"
                >
                    Verify
                </button>
                <button type="button" className="text-blue-600 hover:underline">
                    Log in using email
                </button>
            </form>
        </div>
    );
};

export default Step2VerifyCode;