/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDeletePollMutation, useGetPollStatisticsQuery } from "@/store/api/admin/pool/pool";
import TableLoadingSpinner from "@/utils/TableLoadingSpinner";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Swal from "sweetalert2";
import PollCard from "@/components/Servey-poll/PollCard";
const PollStatisticsPage = () => {
  const { data: pollStatesData, isLoading: isPollLoading, refetch } = useGetPollStatisticsQuery(null);
  const navigate = useNavigate();
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
          {pollStatesData?.data?.map((poll: any, index: number) => <PollCard key={index} poll={poll} index={index} handleDeletePoll={handleDeletePoll} />)}
        </div>
      </div>
    </div>
  );
};

export default PollStatisticsPage;
