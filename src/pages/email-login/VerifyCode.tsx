// src/components/Step2VerifyCode.tsx
import { useAppDispatch } from "@/hooks/useRedux";
import { useVarifyemailLoginMutation } from "@/store/api/auth/authApi";
import { loginUser } from "@/store/Slices/AuthSlice/authSlice";
import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { toast } from "sonner";

// Define the types for the component's props
interface Step2VerifyCodeProps {
  email: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const VerifyCode: React.FC<Step2VerifyCodeProps> = ({ email, setStep }) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [verify, { isLoading }] = useVarifyemailLoginMutation();
  const dispatch = useAppDispatch();
  const handleChange = (index: number, value: string) => {
    // Ensure only digits are entered
    const numericValue = value.replace(/\D/g, "");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullCode = code.join("");
    // In a real app, you'd send this code to your backend for verification
    console.log("Verifying code:", fullCode, email);
    try {
      const result = await verify({ email, otp: Number(fullCode) }).unwrap();
      if (result?.success) {
        toast.success(result?.message);
        dispatch(
          loginUser({ ...result?.data?.user, accessToken: result?.data?.token })
        );
        setStep(3);
      } 
      console.log(result.data.token);
    } catch (error: any) {
        toast.error(error?.data?.message)
        console.log(error)
    }
  };

  return (
    <div className="text-center bg-white  py-12 px-20 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Enter the 6 digit code</h2>
      <p className="text-gray-600 mb-6">Sent to {email}</p>
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(index, e.target.value)
              }
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(index, e)
              }
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Didn't get the code?{" "}
          <button type="button" className="text-blue-600 hover:underline">
            More options
          </button>
        </p>
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyCode;
