/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useEmailLoginMutation,
  usePhoneLoginMutation,
} from "@/store/api/auth/authApi";
import VerifyCode from "./VerifyCode";
import VerificationComplete from "./VerificationComplete";
import { Phone, Mail } from "lucide-react";
import Step1PhoneNumber from "@/components/Step1PhoneNumber";

type EmailFormData = {
  email: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EmailFormData>();

  const [login, { isLoading }] = useEmailLoginMutation();
  const [step, setStep] = useState(0); // 👈 start from welcome screen
  const email = watch("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneLogin, { isLoading: phoneLoading }] = usePhoneLoginMutation();
  const handlePhoneNumberSubmit = async (number: any) => {
    setPhoneNumber(number);
    try {
      const result = await phoneLogin({ phoneNumber: number }).unwrap();
      console.log({ result });
      if (result?.success) {
        toast.success(result?.message || "Otp send to your phone");
        setStep(2);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
      console.log({ error });
    }

    // Move to the next step
  };

  console.log(phoneNumber);

  const onSubmit = async (data: EmailFormData) => {
    try {
      const result = await login({ email: data?.email }).unwrap();
      if (result?.success) {
        toast.success(result?.message || "Check your email");
        setStep(2);
      } else {
        toast.error(result?.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-[#767BD5] to-[#4E53B1]">
      {step === 0 ? (
        // 🔹 Welcome Screen
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-indigo-600 mb-3">Welcome</h2>
          <p className="text-gray-600 mb-8">Log in to your company app</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setStep(1)} // go to phone login
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              <Phone size={18} /> Log in with phone
            </button>

            <button
              onClick={() => setStep(10)} // go to email login
              className="flex items-center gap-2 px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              <Mail size={18} /> Log in with email
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        // 🔹 Phone login flow (your existing component)
        <Step1PhoneNumber
          isLoading={phoneLoading}
          onSubmit={handlePhoneNumberSubmit}
        />
      ) : step === 10 ? (
        // 🔹 Email login step 1 (enter email)
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Log in with your email
          </h2>
          <p className="text-gray-600 mb-6">
            We’ll send you a code to verify your email address
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mb-2">
                {errors.email.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-2 mt-5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Code"}
            </button>
          </form>
        </div>
      ) : step === 2 ? (
        <VerifyCode setStep={setStep} email={email} />
      ) : (
        <VerificationComplete />
      )}
    </div>
  );
}
