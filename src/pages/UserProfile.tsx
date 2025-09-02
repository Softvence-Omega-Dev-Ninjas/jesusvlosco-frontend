import backArrow from "@/assets/arrow_back.svg";
import UserProfileHeader from "@/components/UserProfile/UserProfileHeader";
import UserProfileTabsNew from "@/components/UserProfile/UserProfileTabsNew";
import { useUpdateFullInfoUserMutation } from "@/store/api/admin/user/userApi";
import { useGetProfileQuery } from "@/store/api/auth/authApi";
import { TUser } from "@/types/usertype";
import { UpdateUserFormData } from "@/types/updateUserTypes";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile: React.FC = () => {
  const id = useParams().id;
  const { data: getUserProfileResponse, isLoading, error, refetch } = useGetProfileQuery(id);
  const [updateFullInfoUser] = useUpdateFullInfoUserMutation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log('User Profile Response:', getUserProfileResponse);

  const userData: TUser | null = getUserProfileResponse?.success ? getUserProfileResponse.data : null;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveUpdates = async (updateData: UpdateUserFormData) => {
    if (!userData?.id) {
      console.error('No user ID available for update');
      return;
    }

    try {
      console.log('Updating user with data:', updateData);
      
      // Format the data according to the API expectation
      const apiPayload = {
        profile: updateData.profile,
        experiences: updateData.experiences,
        educations: updateData.educations,
        payroll: updateData.payroll
      };

      const result = await updateFullInfoUser({
        data: apiPayload,
        userId: userData.id
      }).unwrap();

      console.log('Update result:', result);
      refetch();
      if (result?.success) {
        console.log('User updated successfully');
        setIsEditing(false);
        // Optionally, you can refetch the user data here
      } else {
        console.error('Update failed:', result);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const headerUser = userData ? {
    profileUrl: userData.profile?.profileUrl || '',
    name: `${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}`.trim() || 'Unknown User',
    title: userData.profile?.jobTitle || 'No Job Title',
  } : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4E53B1]"></div>
          <p className="mt-4 text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error loading user profile</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <img onClick={() => navigate(-1)} src={backArrow} alt="" />
        <span className="text-[#4E53B1] font-bold text-2xl">User profile</span>
      </div>
      
      {headerUser && (
        <UserProfileHeader
          user={headerUser}
          onEditClick={handleEditClick}
          isEditing={isEditing}
        />
      )}
      
      <UserProfileTabsNew
        userData={userData}
        isEditing={isEditing}
        onSave={handleSaveUpdates}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default UserProfile;
