import CreateTeamForm, {
  FormValues,
} from "@/components/CreateTeam/CreateTeamForm";
import SelectUsersComponent from "@/components/CreateTeam/SelectUsersComponent";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { TUser } from "@/types/usertype";
import React, { useState } from "react";

const CreateTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const getUsers = useGetAllUserQuery({});
  const userList =
    getUsers?.data?.data?.filter((user: TUser) => user.role != "ADMIN") || [];
  console.log(userList);
  const handleUserSelection = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setTeamMembers((prev) => [...prev, userId]);
    } else {
      setTeamMembers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const onSubmit = async (data: FormValues) => {
    const file = data.image?.[0] || null;
    const payload = {
      title: data.name,
      description: data.description,
      department: data.department,
      image: file,
      members: teamMembers,
    } as const;

    console.log("Create Team payload:", payload);
    console.log("File:", file);
    console.log("Selected team members:", teamMembers);

    // Simulate async save
    await new Promise((res) => setTimeout(res, 600));

    alert("Team created (demo). Check console for payload.");
  };

  return (
    <div className="mt-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <div className="flex flex-col-reverse lg:flex-row items-start gap-5 justify-center">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-indigo-700">
                Create Team
              </h1>
              <p className="text-sm text-gray-500">
                Add a new team and assign a team image
              </p>
            </div>
            <CreateTeamForm onSubmit={onSubmit} />
          </div>

          {/* Team Members Selection */}
          <SelectUsersComponent
            userList={userList}
            teamMembers={teamMembers}
            handleUserSelection={handleUserSelection}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
