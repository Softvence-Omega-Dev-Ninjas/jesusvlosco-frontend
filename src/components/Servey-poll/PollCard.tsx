import { FaRegTrashAlt } from "react-icons/fa";

type PollCardProps = {
  poll: any;
  index: number;
  handleDeletePoll: (pollId: string) => void;
};

const PollCard = ({ poll, index, handleDeletePoll }: PollCardProps) => {
  return (
    <div
      key={index}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-primary text-sm leading-tight">
          {poll.title}
        </h4>
        <button onClick={() => handleDeletePoll(poll.id)}>
          <FaRegTrashAlt className="text-xl text-red-500" />
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-[#949494]">Response:{poll.response}</h3>
      </div>
      <div className="space-y-4 text-[#484848]">
        {poll?.options.map((pollOptions: any, idx: number) => (
          <div key={idx} className=" border-b-2 border-gray-300 pb-2 mb-2 ">
            <div className="flex items-center justify-between mb-1 ">
              <span className="text-sm ">{pollOptions?.option}</span>
              <span className="text-sm font-medium ">
                {pollOptions?.responsePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-[#4E53B1]`}
                style={{
                  width: `${pollOptions?.responsePercentage}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollCard;
