// src/components/UserProfile/PersonalInformationTab.tsx
import { CalendarDays, MapPin } from "lucide-react"; // Icons
import React from "react";
import FormInput from "./FormInput"; // Adjust path if necessary

interface PersonalInformationProps {
  user: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: string;
    state: string;
    country: string;
    pinCode: string;
    nationality: string;
  };
}

const PersonalInformationTab: React.FC<PersonalInformationProps> = ({
  user,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 p-6">
      <FormInput label="First name" value={user.firstName} />
      <FormInput label="Last name" value={user.lastName} />
      <FormInput label="Gender" value={user.gender} />
      <FormInput
        label="Date of Birth"
        value={user.dateOfBirth}
        icon={<CalendarDays className="h-5 w-5 text-gray-400" />}
      />
      <FormInput label="Email ID" value={user.email} type="email" />
      <FormInput label="Phone Number" value={user.phoneNumber} type="tel" />
      <FormInput
        label="Address"
        value={user.address}
        className="md:col-span-2"
      />{" "}
      {/* Span 2 columns */}
      <FormInput label="State" value={user.state} />
      <FormInput
        label="Country"
        value={user.country}
        icon={<MapPin className="h-5 w-5 text-gray-400" />}
      />
      <FormInput label="Pin Code" value={user.pinCode} />
      <FormInput label="Nationality" value={user.nationality} />
      {/* The last "Date of Birth" in the UI seems redundant if it's the same as the one above.
          Including it for direct UI representation, but it might be a typo in the original image. */}
      <FormInput
        label="Date of Birth"
        value={user.dateOfBirth}
        icon={<CalendarDays className="h-5 w-5 text-gray-400" />}
      />
    </div>
  );
};

export default PersonalInformationTab;
