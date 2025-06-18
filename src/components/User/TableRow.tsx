import React from "react";
import { User } from "./interfaces";

interface TableRowProps {
  user: User;
  selectedIds: string[];
  onSelectUser: (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  user,
  selectedIds,
  onSelectUser,
}) => (
  <tr key={user.id} className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded-sm"
        checked={selectedIds.includes(user.id)}
        onChange={(e) => onSelectUser(e, user.id)}
      />
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {user.id}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <img
            className="h-10 w-10 rounded-full"
            src={user.avatar}
            alt={user.name}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.name}&background=cccccc&color=000000&size=40`;
            }}
          />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.email}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.phone}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.department}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.lastLogin}
    </td>
    <td></td>
  </tr>
);

export default TableRow;
