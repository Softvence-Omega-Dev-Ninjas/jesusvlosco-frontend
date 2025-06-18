import backArrow from "@/assets/arrow_back.svg";
import UserProfileHeader from "@/components/UserProfile/UserProfileHeader";
import UserProfileTabs from "@/components/UserProfile/UserProfileTabs";
import { parseISO } from "date-fns"; // For parsing/formatting dates
import React, { useState } from "react";

// Define a comprehensive interface for the entire user profile data
interface UserProfileData {
  avatar: string;
  name: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date | null; // Changed to Date | null
  email: string;
  phoneNumber: string;
  address: string;
  state: string;
  country: string;
  pinCode: string;
  nationality: string;
}

// Dummy user data
const initialUser: UserProfileData = {
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  name: "Leslie Alexander",
  title: "Senior Software Engineer",
  firstName: "Leslie",
  lastName: "Alexander",
  gender: "Female",
  dateOfBirth: parseISO("1998-07-25"), // Parse the string into a Date object
  email: "info@example.com",
  phoneNumber: "+123 456 789",
  address: "1901 Thorndridge Cir. Shiloh, Hawaii 81063",
  state: "Los Angelos",
  country: "America",
  pinCode: "1203",
  nationality: "American",
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfileData>(initialUser);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // When cancelling, reset the user state to the original initial values
    // to discard any unsaved changes in the form.
    setUser(initialUser);
  };

  const handleSavePersonalInformation = (updatedData: UserProfileData) => {
    // Before saving, ensure the dateOfBirth is stored as a Date object in the main user state.
    // If you need to send it to a backend as a string, perform that conversion here.
    const userToSave: UserProfileData = {
      ...updatedData,
      // For the name in the header, update it based on the form's first/last name
      name: `${updatedData.firstName} ${updatedData.lastName}`,
    };

    setUser(userToSave);
    setIsEditing(false);
    console.log("Updated User Data for Saving:", userToSave);
    // console.log("Date of Birth as string for API:", userToSave.dateOfBirth ? format(userToSave.dateOfBirth, 'yyyy-MM-dd') : '');
    // Here you would typically send userToSave (or a modified version for API) to a backend.
  };

  const headerUser = {
    avatar: user.avatar,
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
