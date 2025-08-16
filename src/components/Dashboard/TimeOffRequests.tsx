import EmployeeDetailModal from "@/components/TimeOffRequest/EmployeeDetailModal"; // adjust path as needed
import { CalendarDaysIcon } from "lucide-react";
import { useState } from "react";
import { ApproveIcon, DeclineIcon } from "./icons";

type Request = {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  type: string;
  status: "pending" | "approved" | "declined" | string;
  userId: string;
};

type TimeOffRequestsProps = {
  requests: Request[];
  onApprove?: (id: string, adminNote: string) => void;
  onDecline?: (id: string, adminNote: string, status: string) => void;
};

const Avatar = ({
  src,
  initials,
  className = "",
}: {
  src?: string;
  initials: string;
  className?: string;
}) => {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-[#484848]">
          {initials}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "text-[#FF9200] border-[#FF9200]";
      case "approved":
        return "bg-[#1EBD66] text-white border-[#1EBD66]";
      case "declined":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyles()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function TimeOffRequests({
  requests,
  onApprove,
  onDecline,
}: TimeOffRequestsProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(
    ""
  );

  const openModal = (req?: Request) => {
    if (!req) return;

    setSelectedEmployee(req.userId);
    setIsModalOpen(true);
  };
  const shouldScroll = requests.length > 2;

  return (
    <div
      className={`rounded-2xl border border-gray-200 p-4 sm:p-4 w-full mx-auto ${
        shouldScroll ? "max-h-[540px] overflow-y-auto" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-primary">Time-off requests</h3>
      </div>

      {/* Requests List with conditional scroll */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="border border-gray-200 rounded-2xl p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => openModal(request)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={request.avatar}
                  initials={request.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                />
                <div className="font-bold text-base text-[#484848]">
                  {request.name}
                </div>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <CalendarDaysIcon className="h-4 w-4" />
              {request.date}
            </div>

            <div className="text-sm font-medium text-gray-900 mb-4">
              {request.type}
            </div>

            {request.status === "pending" && (
              <div className="flex flex-row flex-wrap gap-3 items-center justify-start xl:justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent modal from opening
                    onDecline?.(request.id, "Declined by admin", "REJECTED");
                    console.log("Decline clicked");
                  }}
                  className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-red-100 rounded-xl text-sm sm:text-base font-medium text-red-600 transition-colors hover:bg-red-200"
                >
                  <DeclineIcon />
                  Decline
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent modal from opening
                    onApprove?.(request.id, "Approved by admin");
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-[#1EBD66] text-white rounded-xl text-sm sm:text-base font-medium transition-colors hover:bg-[#17a957]"
                >
                  <ApproveIcon />
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
        <div className="p-4 border-t border-gray-100">
          <button className="w-full text-center text-primary text-sm transition-colors font-medium">
            End of Requests
          </button>
        </div>
      </div>

      {isModalOpen && selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
