/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPollStatisticsQuery } from "@/store/api/admin/pool/pool";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const PollAnalytics = () => {
  const { data: pollStatesData, isLoading: isPollLoading } = useGetPollStatisticsQuery(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Poll</h3>
        <Link to={"/admin/poll-analytics"}>
          <button className="text-[#484848] text-sm font-medium cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-md px-4 py-2">View All</button>
        </Link>
      </div>
      {isPollLoading && (
        <div className="flex items-center justify-center opacity-50 h-44 w-full">
          <FaSpinner className="animate-spin text-4xl" />
        </div>
      )}
      {!isPollLoading && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pollStatesData?.data?.slice(0, 4)?.map((poll: any, index: number) => (
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
      )}
    </div>
  );
};

export default PollAnalytics;
