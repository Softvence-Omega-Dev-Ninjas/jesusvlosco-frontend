/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdOutlineDelete } from "react-icons/md";
import { StatusBadge } from "./StatusBadge";
import { UserAvatar } from "./UserAvatar";
import { useDeleteTaskMutation } from "@/store/api/admin/task-and-projects";
import { toast } from "sonner";

interface TaskRowProps {
  task: any;
  // isSelected: boolean;
  // onSelect: () => void;
}

export const formatCustomDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2); // last 2 digits

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
};

export function TaskRow({ task }: TaskRowProps) {
  const [deleteTask] = useDeleteTaskMutation();
  //Formate Custom date
  const handleDeleteTask = async (id: string) => {
    console.log("Task Id=============>", id);
    try {
      const result = await deleteTask(id).unwrap();
      console.log(result);
      if (result?.success) {
        toast.success("Task deleted successfully!");
      }
    } catch (error: any) {
      console.error("Error deleting Task:", error);
      toast.error(error?.data?.message); // Add a toast for failure
    } finally {
      // setIsOvertimeLoading(false);
    }
  };
  return (
    <tr className="hover:bg-gray-50">
      {/* Checkbox */}
      <td className="px-4 py-3 w-28">
        {/* <Checkbox checked={isSelected} onCheckedChange={onSelect} /> */}
        <div className="text-sm font-medium text-gray-900 mb-1">{task?.title}</div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={task?.status} />
      </td>

      {/* Label */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{task?.labels}</span>
      </td>

      {/* Start Time */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-900">{formatCustomDate(task?.startTime)}</span>
      </td>

      {/* Due Date */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-900">{formatCustomDate(task?.endTime)}</span>
      </td>

      {/* Assigned To */}
      <td className="px-4 py-3">
        <UserAvatar user={task?.assignTo} />
      </td>
      {/* Assigned To */}
      <td className="px-4 py-3">
        <button
          className="text-red-500 hover:text-red-700 cursor-pointer"
          onClick={() => {
            handleDeleteTask(task?.id);
          }}
        >
          <MdOutlineDelete size={20} />
        </button>
      </td>
    </tr>
  );
}
