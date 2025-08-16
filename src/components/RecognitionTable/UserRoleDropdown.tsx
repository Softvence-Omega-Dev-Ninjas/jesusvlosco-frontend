/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { useUpdateRoleMutation } from "@/store/api/auth/authApi";

interface IProp {
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  id: string;
}

export default function UserRoleDropdown({ role, setRole, id }: IProp) {
  const [open, setOpen] = useState(false);
  const [updateRole] = useUpdateRoleMutation();
  const handleRoleChange = async (newRole: string) => {
    const toastId = toast.loading("Updating role...");
    try {
      const result = await updateRole({
        userId: id,
        data: { role: newRole },
      }).unwrap();
      console.log({ result });
      if (result?.success) {
        toast.success(result?.message || "User role updated", { id: toastId });
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.message || "Something went wrong", { id: toastId });
    } finally {
      setRole(newRole);
      setOpen(false);
    }
    console.log("Updated role:", newRole, id);
  };

  return (
    <div className="relative inline-block text-left">
      {/* 3-dot button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg z-10">
          <p className="px-3 py-2 text-sm text-gray-500">Update Role</p>
          <button
            onClick={() => handleRoleChange("ADMIN")}
            className={`block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 ${
              role === "Admin" ? "font-semibold text-blue-600" : "text-gray-700"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => handleRoleChange("EMPLOYEE")}
            className={`block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 ${
              role === "Employee"
                ? "font-semibold text-blue-600"
                : "text-gray-700"
            }`}
          >
            Employee
          </button>
        </div>
      )}
    </div>
  );
}
