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
// import UpdateRoleModal from "@/components/modals/UpdateRoleModal";
// import DeleteUserModal from "@/components/modals/DeleteUserModal";

interface UserRoleDropdownProps {
  id: string;
  role: string;
  setRole: (role: string) => void;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function UserRoleDropdown({
  id,
  role,
  setRole,
  firstName,
  lastName,
  email,
}: UserRoleDropdownProps) {
  const [updateRoleOpen, setUpdateRoleOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role);

  const handleUpdateRole = () => {
    console.log(
      `Updating role for ${firstName} ${lastName} (${email}) → ${selectedRole}`
    );
    setUpdateRoleOpen(false);
  };

  const handleDeleteUser = () => {
    console.log(`Deleting user: ${firstName} ${lastName} (${email})`);
    setDeleteUserOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setUpdateRoleOpen(true)}>
            <UserCog className="mr-2 h-4 w-4" />
            Update Role
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteUserOpen(true)}
            className="text-destructive focus:text-destructive"
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
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onConfirm={handleUpdateRole}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        open={deleteUserOpen}
        setOpen={setDeleteUserOpen}
        onConfirm={handleDeleteUser}
      />
    </>
  );
}
