import { parseISO } from "date-fns"; // For converting Date to string for saving
import { MapPin } from "lucide-react"; // Only MapPin now, CalendarDays is in DateInput
import React, { useEffect, useState } from "react";
import DateInput from "./DateInput"; // Import the new DateInput
import FormInput from "./FormInput";

// Gender options from AddUserProfile
const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];

// Define the interface for the personal information form data
interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  gender: string;
dob: Date | null; // Changed to Date | null
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  pinCode: string;
  nationality: string;
}

interface PersonalInformationProps {
  user: PersonalInfoFormData;
  isEditing: boolean;
  onSave?: (updatedUser: PersonalInfoFormData) => void;
  onCancelEdit?: () => void;
}

const PersonalInformationTab: React.FC<PersonalInformationProps> = ({
  user,
  isEditing,
  onSave,
  onCancelEdit,
}) => {
  const [formData, setFormData] = useState<PersonalInfoFormData>(user);

  useEffect(() => {
    // Ensure the dateOfBirth from user prop is a Date object for formData state
    setFormData({
      ...user,
      dob:
        typeof user.dob === "string"
          ? parseISO(user.dob)
          : user.dob instanceof Date
          ? user.dob
          : null,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    date: Date | null,
    fieldName: keyof PersonalInfoFormData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: date,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    // Reset to original user data when canceling
    setFormData({
      ...user,
      dob:
        typeof user.dob === "string"
          ? parseISO(user.dob)
          : user.dob instanceof Date
          ? user.dob
          : null,
    });
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        <FormInput
          label="First name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          readOnly={!isEditing}
        />
        <FormInput
          label="Last name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          readOnly={!isEditing}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          {isEditing ? (
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={genderOptions.find(opt => opt.value === formData.gender)?.label || formData.gender}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          )}
        </div>
        <DateInput
          label="Date of Birth"
          name="dateOfBirth"
          value={formData.dob}
          onChange={(date) => handleDateChange(date, "dob")}
          readOnly={!isEditing}
        />
        <FormInput
          label="Email ID"
          name="email"
          value={formData.email}
          onChange={handleChange}
          readOnly={true}
          type="email"
        />
        <FormInput
          label="Phone Number"
          name="phoneNumber"
          value={formData.phone}
          onChange={handleChange}
          readOnly={true}
          type="tel"
        />
        <FormInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          readOnly={!isEditing}
          className="md:col-span-2"
        />
        <FormInput
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          readOnly={!isEditing}
        />
        <FormInput
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          readOnly={!isEditing}
          icon={<MapPin className="h-5 w-5 text-gray-400" />}
        />
        <FormInput
          label="Pin Code"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
          readOnly={!isEditing}
        />
        <FormInput
          label="Nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          readOnly={!isEditing}
        />
        {/* The last "Date of Birth" in the UI seems redundant if it's the same as the one above.
            Keeping it for direct UI representation but it's likely a UI design quirk. */}
        <DateInput
          label="Date of Birth (Redundant)"
          name="dateOfBirthRedundant"
          value={formData.dob} // This will mirror the first DOB field
          onChange={(date) => handleDateChange(date, "dob")} // Still updates the same field
          readOnly={!isEditing}
        />
      </div>

      {isEditing && (
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#4E53B1] text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInformationTab;
