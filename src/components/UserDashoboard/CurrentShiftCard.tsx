import { AlarmIcon } from "./icons";
import { Shift } from "./types";

interface CurrentShiftCardProps {
  shift: Shift;
}

const CurrentShiftCard: React.FC<CurrentShiftCardProps> = ({ shift }) => {
  return (
    <div className="bg-[#EDEEF7] h-full rounded-2xl p-7 mb-6">
      <div className="flex items-center justify-between mb-5">
        <AlarmIcon />
        <button className="text-[#484848] cursor-pointer font-medium">
          View Schedule
        </button>
      </div>
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-[#484848] mb-3">
          {shift.startTime} - {shift.endTime}
        </h2>
        <p className="text-[#484848] mb-3">{shift.date}</p>
        <button className="text-primary cursor-pointer font-medium">
          {shift.location}
        </button>
      </div>
      <div className="text-center">
        <p className="text-gray-600 mb-5">Your Team</p>
        <div className="flex justify-center space-x-2">
          {shift.team.map((member, index) => (
            <div
              key={index}
              className="w-14 h-14 bg-[#C8CAE7] rounded-full flex items-center justify-center text-[#484848] font-bold text-2xl"
            >
              {member}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentShiftCard;
