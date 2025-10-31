/* eslint-disable @typescript-eslint/no-explicit-any */
import PollCard from "@/components/Servey-poll/PollCard";
import {
  useDeletePollMutation,
  useGetPollStatisticsQuery,
} from "@/store/api/admin/pool/pool";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const PollAnalytics = () => {
  const { data: pollStatesData, isLoading: isPollLoading, refetch } =
    useGetPollStatisticsQuery(null);
  const [deletePoll] = useDeletePollMutation();
  const handleDeletePoll = async (pollId: string) => {
    console.log("Delete poll with ID:", pollId);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deletePoll(pollId);
        refetch();
        Swal.fire("Deleted!", "Poll has been deleted.", "success");
        
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the poll.", "error");
      }
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Poll</h3>
        <Link to={"/admin/poll-analytics"}>
          <button className="text-[#484848] text-sm font-medium cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-md px-4 py-2">
            View All
          </button>
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
            {pollStatesData?.data
              ?.slice(0, 4)
              ?.map((poll: any, index: number) => (
                <PollCard
                  key={index}
                  poll={poll}
                  index={index}
                  handleDeletePoll={handleDeletePoll}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollAnalytics;
