// src/pages/LoginPage.jsx
import { useState } from "react";
import Step1PhoneNumber from "../components/Step1PhoneNumber";
import Step2VerifyCode from "../components/Step2VerifyCode";
import Step3ProjectSelection from "../components/Step3ProjectSelection";

const Login = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  // Removed unused selectedProject state
  const handlePhoneNumberSubmit = (number: any) => {
    setPhoneNumber(number);
    setStep(2); // Move to the next step
  };

  const handleCodeVerification = () => {
    setStep(3); // Move to the next step after successful code verification
  };

  const handleProjectSelection = (project: any) => {
    // Here you would typically redirect the user to the dashboard or home page
    console.log("Logged in with project:", project);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1PhoneNumber onSubmit={handlePhoneNumberSubmit} />;
      case 2:
        return (
          <Step2VerifyCode
            phoneNumber={phoneNumber}
            onVerify={handleCodeVerification}
          />
        );
      case 3:
        return (
          <Step3ProjectSelection onSelectProject={handleProjectSelection} />
        );
      default:
        return <Step1PhoneNumber onSubmit={handlePhoneNumberSubmit} />;
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
