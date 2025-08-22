import CreateTeamForm, {
  FormValues,
} from "@/components/CreateTeam/CreateTeamForm";
import SelectUsersComponent from "@/components/CreateTeam/SelectUsersComponent";
import { useCreateTeamMutation } from "@/store/api/admin/team/CreateTeamApi";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { TUser } from "@/types/usertype";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [createTeam] = useCreateTeamMutation();
  const getUsers = useGetAllUserQuery({limit: 1000});
  const navigate = useNavigate();
  
  const userList = (Array.isArray(getUsers?.data?.data) ? getUsers!.data!.data : []).filter(
    (user: TUser) =>
      user.role !== "ADMIN" &&
      (user.projects?.length ?? 0) === 0 &&
      (user.shift?.length ?? 0) === 0
  );
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
    if (teamMembers.length < 2) {
      Swal.fire("Please select at least two team members.");
      return;
    }
    console.log(teamMembers)
    // Build multipart FormData
    const fd = new FormData();
    fd.append("title", data.name);
    fd.append("description", data.description);
    fd.append("department", data.department);

    if (file) {
      fd.append("image", file);
    }

  // Append members as repeated fields (one entry per member)
  // (avoid sending JSON string + repeated fields which can confuse backend parsing)
  teamMembers.forEach((m) => fd.append("members", m));

    try {
      const result = await createTeam(fd).unwrap();
      console.log("createTeam result:", result);
      const normalizeMessage = (m: unknown) => {
        if (!m) return undefined;
        if (Array.isArray(m)) return (m as unknown[]).join(" \n");
        if (typeof m === "string") return m;
        try {
          return JSON.stringify(m);
        } catch {
          return String(m as unknown);
        }
      };

      if (result?.success) {
        Swal.fire("Team created", "Team was created successfully.", "success");
        navigate(-1);
      } else {
        const msg = normalizeMessage(result?.message) || "Failed to create team";
        Swal.fire("Error", msg, "error");
      }
    } catch (err) {
      console.error("createTeam error", err);
      const maybe = err as unknown as { data?: { message?: string }; message?: string };
      const message = maybe?.data?.message || maybe?.message || "Failed to create team";
      Swal.fire("Error", message, "error");
    }
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
