import React, { useState, useCallback } from "react";
import PersonalInformationTab from "./PersonalInformationTab";
import ExperienceUpdateForm from "./ExperienceUpdateForm";
import EducationUpdateForm from "./EducationUpdateForm";
import PayrollUpdateForm from "./PayrollUpdateForm";
import { TUser } from "@/types/usertype";
import { UpdateUserFormData, UpdateProfileData, UpdateExperienceData, UpdateEducationData, UpdatePayrollData } from "@/types/updateUserTypes";

interface UserProfileTabsNewProps {
  userData: TUser | null;
  isEditing: boolean;
  onSave: (updateData: UpdateUserFormData) => void;
  onCancelEdit: () => void;
}

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  gender: string;
  department?: string;
  dob: Date | null;
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  pinCode: string;
  nationality: string;
}

type TabKey =
  | "personalInformation"
  | "experience"
  | "education"
  | "payroll";

const UserProfileTabsNew: React.FC<UserProfileTabsNewProps> = ({
  userData,
  isEditing,
  onSave,
  onCancelEdit,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("personalInformation");

  // Store individual form updates
  const [profileUpdates, setProfileUpdates] = useState<Partial<UpdateProfileData>>({});
  const [experienceUpdates, setExperienceUpdates] = useState<Partial<UpdateExperienceData>[]>([]);
  const [educationUpdates, setEducationUpdates] = useState<Partial<UpdateEducationData>[]>([]);
  const [payrollUpdates, setPayrollUpdates] = useState<Partial<UpdatePayrollData>>({});

  const handleProfileUpdate = useCallback((profileFormData: PersonalInfoFormData) => {
    // Convert PersonalInfoFormData to UpdateProfileData
    const profileData: Partial<UpdateProfileData> = {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      gender: profileFormData.gender as "MALE" | "FEMALE" | "OTHER",
  department: profileFormData.department,
      dob: profileFormData.dob?.toISOString(),
      address: profileFormData.address,
      city: profileFormData.state, // Mapping state to city for now
      state: profileFormData.state,
      country: profileFormData.country,
      nationality: profileFormData.nationality,
    };
    
    // Filter out empty or unchanged fields
    const filteredProfileData: Record<string, string | undefined> = {};
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        // Check if this field is actually different from original data
        const originalValue = userData?.profile?.[key as keyof typeof userData.profile];
        if (value !== originalValue) {
          filteredProfileData[key] = value;
        }
      }
    });
    
    setProfileUpdates(filteredProfileData as Partial<UpdateProfileData>);
  }, [userData]);

  const handleExperienceUpdate = useCallback((experiences: Partial<UpdateExperienceData>[]) => {
    // Filter out experiences with no meaningful changes
    const filteredExperiences = experiences.filter(exp => {
      // Check if at least one field has a value
      return Object.values(exp).some(value => 
        value !== undefined && value !== '' && value !== null
      );
    });
    setExperienceUpdates(filteredExperiences);
  }, []);

  const handleEducationUpdate = useCallback((educations: Partial<UpdateEducationData>[]) => {
    // Filter out educations with no meaningful changes
    const filteredEducations = educations.filter(edu => {
      // Check if at least one field has a value
      return Object.values(edu).some(value => 
        value !== undefined && value !== '' && value !== null
      );
    });
    setEducationUpdates(filteredEducations);
  }, []);

  const handlePayrollUpdate = useCallback((payroll: Partial<UpdatePayrollData>) => {
    // Filter out empty or unchanged payroll fields
    const filteredPayroll: Record<string, string | number | string[] | undefined> = {};
    Object.entries(payroll).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Check if this field is actually different from original data
        const originalValue = userData?.payroll?.[key as keyof typeof userData.payroll];
        if (JSON.stringify(value) !== JSON.stringify(originalValue)) {
          filteredPayroll[key] = value;
        }
      }
    });
    
    setPayrollUpdates(filteredPayroll as Partial<UpdatePayrollData>);
  }, [userData]);

  const handleSave = () => {
    // Collect all the updates
    const updateData: UpdateUserFormData = {};
    
    if (Object.keys(profileUpdates).length > 0) {
      updateData.profile = profileUpdates;
    }
    
    if (experienceUpdates.length > 0) {
      updateData.experiences = experienceUpdates;
    }
    
    if (educationUpdates.length > 0) {
      updateData.educations = educationUpdates;
    }
    
    if (Object.keys(payrollUpdates).length > 0) {
      updateData.payroll = payrollUpdates;
    }

    console.log('Saving user updates:', updateData);
    onSave(updateData);
  };

  const handleCancel = () => {
    // Reset all updates
    setProfileUpdates({});
    setExperienceUpdates([]);
    setEducationUpdates([]);
    setPayrollUpdates({});
    onCancelEdit();
  };

  const hasChanges = () => {
    return Object.keys(profileUpdates).length > 0 ||
           experienceUpdates.length > 0 ||
           educationUpdates.length > 0 ||
           Object.keys(payrollUpdates).length > 0;
  };

  const renderTabContent = () => {
    if (!userData) {
      return <div className="text-center py-8 text-gray-500">Loading user data...</div>;
    }

    switch (activeTab) {
      case "personalInformation":
        return (
          <PersonalInformationTab
            user={{
              firstName: userData.profile?.firstName || '',
              lastName: userData.profile?.lastName || '',
              gender: userData.profile?.gender || '',
              dob: userData.profile?.dob ? new Date(userData.profile.dob) : null,
              email: userData.email || '',
              phone: userData.phone || '',
              address: userData.profile?.address || '',
              state: userData.profile?.state || '',
              country: userData.profile?.country || '',
              pinCode: '', // Not in API response
              nationality: userData.profile?.nationality || '',
              department: userData.profile?.department || '',
            }}
            isEditing={isEditing}
            onSave={handleProfileUpdate}
            onCancelEdit={handleCancel}
          />
        );
      case "experience":
        return (
          <ExperienceUpdateForm
            experiences={userData.experience || []}
            onUpdate={handleExperienceUpdate}
            isEditing={isEditing}
          />
        );
      case "education":
        return (
          <EducationUpdateForm
            educations={userData.educations || []}
            onUpdate={handleEducationUpdate}
            isEditing={isEditing}
          />
        );
      case "payroll":
        return (
          <PayrollUpdateForm
            payroll={userData.payroll || null}
            onUpdate={handlePayrollUpdate}
            isEditing={isEditing}
          />
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabKey: TabKey; label: string }> = ({
    tabKey,
    label,
  }) => (
    <button
      className={`py-3 px-6 text-center font-medium text-lg relative transition-colors duration-200
        ${
          activeTab === tabKey
            ? "text-[#4E53B1] before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-[#4E53B1]"
            : "text-gray-600 hover:text-gray-900"
        }
      `}
      onClick={() => setActiveTab(tabKey)}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-6 border-t border-gray-200">
      <div className="flex justify-between px-10 flex-wrap gap-2">
        <TabButton tabKey="personalInformation" label="Personal Information" />
        <TabButton tabKey="experience" label="Work Experience" />
        <TabButton tabKey="education" label="Education" />
        <TabButton tabKey="payroll" label="Payroll" />
      </div>
      
      <div className="mt-6 px-6">
        {renderTabContent()}
      </div>

      {isEditing && hasChanges() && (
        <div className="mt-8 px-6 pb-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel All Changes
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#4E53B1] text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Save All Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileTabsNew;
