import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UserCog, Trash2 } from "lucide-react";
import UpdateRoleModal from "./UserRoleUpdateModal";
import DeleteUserModal from "./UserDeleteModal";
import { toast } from "sonner";
import { useUpdateRoleMutation } from "@/store/api/auth/authApi";
import { useDeleteUserMutation } from "@/store/api/admin/user/userApi";
// import UpdateRoleModal from "@/components/modals/UpdateRoleModal";
// import DeleteUserModal from "@/components/modals/DeleteUserModal";

interface UserRoleDropdownProps {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: string;
}

export default function UserActionDropdown({
  id,
  role,
  firstName,
  lastName,
  email,
}: UserRoleDropdownProps) {
  const [updateRoleOpen, setUpdateRoleOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("EMPLOYEE");

  const [updateRole] = useUpdateRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const handleUpdateRole = async () => {
    const toastId = toast.loading("Updating role...");
    console.log({ role, selectedRole });
    if (role === selectedRole) {
      toast.error("User role is already Employee");
      return;
    }
    try {
      const result = await updateRole({
        userId: id,
        data: { role: selectedRole },
      }).unwrap();
      console.log({ result });
      if (result?.success) {
        console.log(
          `Updating role for ${firstName} ${lastName} (${email}) id: ${id} → ${selectedRole}`
        );
        toast.success(result?.message || "User role updated", { id: toastId });
        setUpdateRoleOpen(false);
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.message || "Something went wrong", { id: toastId });
    }
  };

  const handleDeleteUser = async () => {
    const toastId = toast.loading("Deleting user...");
    try {
      const result = await deleteUser(id).unwrap();
      console.log({ result });
      if (result?.success) {
        toast.success(result?.message || "User deleted successfully", {
          id: toastId,
        });
        setDeleteUserOpen(false);
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 hover:bg-slate-300 transition-colors duration-300 cursor-pointer rounded-full w-8 p-3"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white">
          <DropdownMenuItem
            className="cursor-pointer hover:bg-slate-200 transition-colors duration-300"
            onClick={() => setUpdateRoleOpen(true)}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Update Role
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteUserOpen(true)}
            className="text-red-500 hover:bg-slate-200 transition-colors duration-300 cursor-pointer focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Role Modal */}
      <UpdateRoleModal
        open={updateRoleOpen}
        setOpen={setUpdateRoleOpen}
        name={((firstName as string) + "  " + lastName) as string}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onConfirm={handleUpdateRole}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        open={deleteUserOpen}
        name={((firstName as string) + "  " + lastName) as string}
        setOpen={setDeleteUserOpen}
        onConfirm={handleDeleteUser}
      />
    </>
  );
}
