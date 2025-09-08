import { BsStopwatch } from "react-icons/bs";
import EmployeeCardPopup from "./EmployeeCardPopup";
import ShiftTemplateDropdown from "./ShiftTemplateDropdown";
import { ProjectUser } from "@/types/projectType";
import { TShift } from "@/types/shared";

const EmployeeAvailabilityCard = ({
  emp,
  shifts,
}: {
  emp: ProjectUser;
  shifts: TShift[];
}) => {
  const profile = emp.user;
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex gap-2">
        <img
          src={
            profile.profileUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.firstName + " " + profile.lastName
            )}`
          }
          alt={profile.firstName || "User"}
          className="w-10 h-10 rounded-full object-cover mb-1"
        />
        <div>
          <p className="text-xs font-medium text-center text-gray-700 truncate">
            {profile.firstName} {profile.lastName}
          </p>

          <p
            className={`text-[10px] mt-1 ${
              profile.isAvailable || profile.isAvailable === null
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {profile.isAvailable ? "Available" : "Busy"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <BsStopwatch className="text-sm" />
          <ShiftTemplateDropdown shiftTemplates={shifts ?? []} />
          <span className="text-xs font-medium">{shifts?.length ?? 0}</span>
        </div>

        <EmployeeCardPopup
          name={profile.firstName || "Unknown"}
          title={profile?.jobTitle || "No title"}
          department={profile?.department || "No department"}
          email={profile.email || "No email"}
          phone={profile?.phone || "No phone"}
          avatar={
            profile?.profileUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.firstName + " " + profile.lastName
            )}`
          }
          role={"Employee"}
        />
      </div>
    </div>
  );
};

export default EmployeeAvailabilityCard;
