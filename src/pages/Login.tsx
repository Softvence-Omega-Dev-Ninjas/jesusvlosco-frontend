// src/pages/LoginPage.jsx
import { useState } from "react";
import Step1PhoneNumber from "../components/Step1PhoneNumber";
import Step2VerifyCode from "../components/Step2VerifyCode";
import Step3ProjectSelection from "../components/Step3ProjectSelection";
import {
  usePhoneLoginMutation,
  useVarifyPhoneLoginMutation,
} from "@/store/api/auth/authApi";
import { toast } from "sonner";
import { loginUser } from "@/store/Slices/AuthSlice/authSlice";
import { useAppDispatch } from "@/hooks/useRedux";

const Login = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneLogin, { isLoading: phoneLoading }] = usePhoneLoginMutation();
  const dispatch = useAppDispatch();
  const [verifyCode, { isLoading: verifyLoading }] =
    useVarifyPhoneLoginMutation();
  // Removed unused selectedProject state
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
      toast.error(error?.data?.message || "Something went wrong")
      console.log({ error });
    }

    // Move to the next step
  };

  const handleCodeVerification = async (code: string) => {
    console.log(phoneNumber.slice(1), code);
    try {
      const result = await verifyCode({
        phoneNumber: phoneNumber.slice(1),
        otp: code,
      }).unwrap();
      console.log({ result });
      if (result?.success) {
        toast.success(result?.message || "Login Successfull");
        dispatch(
          loginUser({ ...result?.data?.user, accessToken: result?.data?.token })
        );
        setStep(3);
      } else {
        toast.error(result?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleProjectSelection = (project: any) => {
    // Here you would typically redirect the user to the dashboard or home page
    console.log("Logged in with project:", project);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1PhoneNumber
            isLoading={phoneLoading}
            onSubmit={handlePhoneNumberSubmit}
          />
        );
      case 2:
        return (
          <Step2VerifyCode
            isLoading={verifyLoading}
            phoneNumber={phoneNumber}
            onVerify={handleCodeVerification}
          />
        );
      case 3:
        return (
          <Step3ProjectSelection onSelectProject={handleProjectSelection} />
        );
      default:
        return (
          <Step1PhoneNumber
            isLoading={phoneLoading}
            onSubmit={handlePhoneNumberSubmit}
          />
        );
    }
  };

  return (
    // Updated line here with the gradient class
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-[#767BD5] to-[#4E53B1]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {renderStep()}
      </div>
    </div>
  );
};

export default Login;
