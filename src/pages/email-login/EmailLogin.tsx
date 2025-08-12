import { useEmailLoginMutation } from "@/store/api/auth/authApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import VerifyCode from "./VerifyCode";
import VerificationComplete from "./VerificationComplete";

type EmailFormData = {
  email: string;
};

export default function EmailLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EmailFormData>();

  const [login, { isLoading }] = useEmailLoginMutation();
  const [step, setStep] = useState(1);
  const email = watch("email");

  const onSubmit = async (data: EmailFormData) => {
    console.log("Submitted email:", data.email);
    try {
      const result = await login({ email: data?.email }).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success(result?.message || "Check your email");
        setStep(2);
      } else {
        throw new Error(result?.data?.message)
      }
      console.log(result);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || 'something went wrong')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-[#767BD5] to-[#4E53B1]">
      {step === 1 ? (
        <div className="text-center bg-white p-12 rounded-md ">
          <h2 className="text-2xl text-center font-semibold mb-4">
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
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mb-2">
                {errors.email.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 inline-block disabled:opacity-70 disabled:cursor-not-allowed mx-auto py-2 mt-5 cursor-pointer bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              {isLoading ? " Verifying..." : " Verify"}
            </button>
          </form>
        </div>
      ) : step === 2 ? (
        <div>
          <VerifyCode setStep={setStep} email={email} />
        </div>
      ) : (
        <div>
          <VerificationComplete />
        </div>
      )}
    </div>
  );
}
