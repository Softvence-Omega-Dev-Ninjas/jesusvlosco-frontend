import { customList } from "country-codes-list";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Step1PhoneNumberProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading: boolean;
}

// Generate array of all country codes
const countryCodes = Object.values(
  customList(
    "countryCode",
    "{countryCode} | {countryNameEn} | +{countryCallingCode}"
  )
).map((item: string) => {
  const [code, name, dialCode] = item.split(" | ");
  return { code, name, dialCode };
});

const Step1PhoneNumber: React.FC<Step1PhoneNumberProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [countryCode, setCountryCode] = useState<string>("US");
  const [number, setNumber] = useState<string>("");
  const [dialCode, setDialCode] = useState<string>("+1");

  useEffect(() => {
    const selectedCountry = countryCodes.find((c) => c.code === countryCode);
    if (selectedCountry) {
      setDialCode(selectedCountry.dialCode);
    }
  }, [countryCode]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(`${dialCode}${number}`);
  };

  return (
    <div className="text-center bg-white p-10 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
      <p className="text-gray-600 mb-6">Log in to your company app</p>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center border border-gray-300 rounded-md p-2 mb-4">
          <select
            className="bg-white outline-none mr-2 min-w-fit"
            value={countryCode}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setCountryCode(e.target.value)
            }
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </select>

          <span className="text-gray-500 mr-2 whitespace-nowrap">
            {dialCode}
          </span>

          <input
            type="text"
            className="flex-1 min-w-0 outline-none"
            placeholder="e.g., 1234567890"
            value={number}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNumber(e.target.value)
            }
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
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default Step1PhoneNumber;
