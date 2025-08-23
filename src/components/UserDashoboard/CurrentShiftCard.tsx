/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlarmIcon } from "./icons";
import { Shift } from "./types";

interface CurrentShiftCardProps {
  shift: Shift;
  team: any[]; 
}

const CurrentShiftCard: React.FC<CurrentShiftCardProps> = ({ shift, team }) => {
  return (
    <div className="bg-[#EDEEF7] h-full rounded-2xl p-7 mb-6">
      <div className="flex items-center justify-between mb-5">
        <AlarmIcon />
        <button className="text-[#484848] cursor-pointer font-medium">
          Todays Schedule
        </button>
      </div>
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-[#484848] mb-3">
          {shift?.startTime} - {shift?.endTime}
        </h2>
        <p className="text-[#484848] mb-3">{shift?.date}</p>
        <button className="text-primary cursor-pointer font-medium">
          {shift?.location}
        </button>
      </div>
      <div className="text-center">
        <p className="text-gray-600 mb-5">Your Team members</p>
        <div className="flex justify-center space-x-2">
          {team?.map((member : any, index: number) => (
            <div
              key={index}
              className="w-14 h-14 bg-[#C8CAE7] rounded-full flex items-center justify-center text-[#484848] font-bold text-2xl"
            >
              <img className="rounded-full" src={member.profileUrl || "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(
                member.firstName +
                  " " +
                  member.lastName
              )} alt="Default Profile" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-5 py-5">
          <button className="px-5 py-3 rounded-md border-1 border-gray-400 bg-green-500 text-white font-bold">Clock In </button>
          <button className="px-5 py-3 rounded-md border-1 border-gray-400 bg-red-500 text-white font-bold">Clock Out</button>
        </div>
      </div>
    </div>
  );
};

export default CurrentShiftCard;
