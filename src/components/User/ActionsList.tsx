// src/components/modals/ActionsList.tsx
import React from "react";
import { ActionOption } from "./interfaces";

const actionOptions: ActionOption[] = [
  { label: "Update user details", icon: "✏️" },
  { label: "Create team chat", icon: "💬" },
  { label: "Send chat message", icon: "📧" },
  { label: "Send text message", icon: "📱" },
  { label: "Create task", icon: "📋" },
  { label: "Delete", icon: "🗑️" },
];

const ActionsList: React.FC = () => {
  return (
    <div className="px-1 py-1">
      {actionOptions.map((option) => (
        <button
          key={option.label}
          className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <span className="mr-2">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ActionsList;