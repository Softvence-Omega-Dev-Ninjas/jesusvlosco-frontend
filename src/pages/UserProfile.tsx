import backArrow from "@/assets/arrow_back.svg";
import UserProfileHeader from "@/components/UserProfile/UserProfileHeader";
import UserProfileTabs from "@/components/UserProfile/UserProfileTabs";
import { useUpdateUserMutation } from "@/store/api/admin/user/userApi";
import { parseISO } from "date-fns"; // For parsing/formatting dates
import React, { useState } from "react";

// Define a comprehensive interface for the entire user profile data
interface UserProfileData {
  profileUrl: string;
  name: string;
  title: string;
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

// Dummy user data
const initialUser: UserProfileData = {
  profileUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  name: "Leslie Alexander",
  title: "Senior Software Engineer",
  firstName: "Leslie",
  lastName: "Alexander",
  gender: "Female",
  dob: parseISO("1998-07-25"), // Parse the string into a Date object
  email: "info@example.com",
  phone: "+123 456 789",
  address: "1901 Thorndridge Cir. Shiloh, Hawaii 81063",
  state: "Los Angelos",
  country: "America",
  pinCode: "1203",
  nationality: "American",
};

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date | null;
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
  pinCode: string;
  nationality: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfileData>(initialUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);
const [updateUser] = useUpdateUserMutation();
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // When cancelling, reset the user state to the original initial values
    // to discard any unsaved changes in the form.
    setUser(initialUser);
  };

  const handleSavePersonalInformation = async (
    updatedData: PersonalInfoFormData
  ) => {
    const userToSave: UserProfileData = {
      ...user, // retain existing fields like avatar, title, etc.
      ...updatedData,
      name: `${updatedData.firstName} ${updatedData.lastName}`,
    };

      const personalFormData = new FormData();
    // formData.role = selectedRole || 'EMPLOYEE';
    for (const key in userToSave) {
      const value = userToSave[key as keyof UserProfileData];
      personalFormData.append(key, value instanceof Date ? value.toISOString() : String(value));
    }

    try {
      const result = await updateUser({data: personalFormData, userId: "7f787ded-b061-4dfd-b136-7fb26f353a20"}).unwrap();
      console.log({ result });
      if (result?.success) {
       
      }
    } catch (error: any) {
      console.log({ error });
      
    }

   
    setUser(userToSave);
    setIsEditing(false);
    console.log("Updated User Data for Saving:", userToSave);
  };

  const headerUser = {
    profileUrl: user.profileUrl,
    name: user.name,
    title: user.title,
  };

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <img src={backArrow} alt="" />
        <span className=" text-[#4E53B1] font-bold text-2xl">User profile</span>
      </div>
      <UserProfileHeader
        user={headerUser}
        onEditClick={handleEditClick}
        isEditing={isEditing}
      />
      <UserProfileTabs
        user={user}
        isEditing={isEditing}
        onSavePersonalInformation={handleSavePersonalInformation}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default UserProfile;
