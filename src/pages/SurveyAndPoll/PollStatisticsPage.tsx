/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPollStatisticsQuery } from "@/store/api/admin/pool/pool";
import TableLoadingSpinner from "@/utils/TableLoadingSpinner";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
const PollStatisticsPage = () => {
  const { data: pollStatesData, isLoading: isPollLoading } = useGetPollStatisticsQuery(null);
  const navigate = useNavigate();

  if (isPollLoading) return <TableLoadingSpinner />;
  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary mt-6">All Poll</h3>
          <button onClick={() => navigate(-1)} className="text-[#484848] text-sm font-medium cursor-pointer flex items-center gap-1">
            <IoIosArrowBack className="text-lg mt-0.5" />
            <span className="text-lg">Back</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pollStatesData?.data?.map((poll: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-medium text-primary mb-6 text-sm leading-tight">{poll.title}</h4>
              <div className="mb-6">
                <h3 className="text-[#949494]">Response:{poll.response}</h3>
              </div>
              <div className="space-y-4 text-[#484848]">
                {poll?.options.map((pollOptions: any, idx: number) => (
                  <div key={idx} className=" border-b-2 border-gray-300 pb-2 mb-2 ">
                    <div className="flex items-center justify-between mb-1 ">
                      <span className="text-sm ">{pollOptions?.option}</span>
                      <span className="text-sm font-medium ">{pollOptions?.responsePercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full bg-[#4E53B1]`} style={{ width: `${pollOptions?.responsePercentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollStatisticsPage;
