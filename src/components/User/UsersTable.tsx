import React from "react";
import { User } from "./interfaces";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface UsersTableProps {
  users: User[];
  selectedIds: string[];
  onSelectUser: (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => void;
  onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onColumnToggle: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  selectedIds,
  onSelectUser,
  onSelectAll,
  isAllSelected,
  isSomeSelected,
  onColumnToggle,
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <TableHeader
        onSelectAll={onSelectAll}
        isAllSelected={isAllSelected}
        isSomeSelected={isSomeSelected}
        onColumnToggle={onColumnToggle}
      />
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <TableRow
            key={user.id}
            user={user}
            selectedIds={selectedIds}
            onSelectUser={onSelectUser}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
