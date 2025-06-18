import { Pencil } from "lucide-react";
import React from "react";

interface UserHeaderData {
  avatar: string;
  name: string;
  title: string;
}

interface UserProfileHeaderProps {
  user: UserHeaderData; // Use the defined interface
  onEditClick: () => void;
  isEditing: boolean;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  onEditClick,
  isEditing,
}) => {
  return (
    <div className="flex items-center justify-between p-6 pb-4">
      <div className="flex items-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full  shadow-md object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            // Provide a fallback image or text if the avatar fails to load
            (e.target as HTMLImageElement).onerror = null;
            (
              e.target as HTMLImageElement
            ).src = `https://placehold.co/96x96/cccccc/000000?text=${user.name
              .charAt(0)
              .toUpperCase()}`;
          }}
        />
        <div className="ml-5">
          <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-md text-gray-500">{user.title}</p>
        </div>
      </div>
      {!isEditing && (
        <button
          onClick={onEditClick}
          className="flex items-center px-4 py-2 bg-[#4E53B1] text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </button>
      )}
    </div>
  );
};

export default UserProfileHeader;
