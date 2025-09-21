import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";

interface TimeSheetActionsProps {
  isOvertimeLoading: boolean;
  handleSendOvertimeRequest: (id: string) => void;
  entryId: string;
}

export const TimeSheetActions: React.FC<TimeSheetActionsProps> = ({
  isOvertimeLoading,
  handleSendOvertimeRequest,
  entryId,
}) => (
  <div className="relative">
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none hover:scale-105 active:scale-95 duration-700 cursor-pointer">
        <BsThreeDots className="mt-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        className="bg-[#f7fbfe] border-none shadow-md shadow-secondary-bg-light outline-none p-2 flex flex-col gap-2"
      >
        <span
          className="hover:text-green-700 hover:bg-green-50 border-2 border-[#e9ebec]  py-2 px-5 rounded-lg hover:bg-light-primary-bg dark:hover:bg-dark-secondary-bg font-medium text-sm w-full cursor-pointer flex items-center justify-center"
          onClick={() => handleSendOvertimeRequest(entryId)}
        >
          {isOvertimeLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            "Send Request"
          )}
        </span>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
