import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatCustomDate } from "./UserTaskRow";

interface TaskRowProps {
  task: any;
}

export function SubmittedTaskRow({ task }: TaskRowProps) {
  //Formate Custom date

  return (
    <tr className="hover:bg-gray-50">
      {/* Checkbox */}
      <td className="px-4 py-3 w-28">
        {/* <Checkbox checked={isSelected} onCheckedChange={onSelect} /> */}
        <div className="text-sm font-medium text-gray-900 mb-1">{task?.title}</div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className="bg-[#D9F0E4] text-green-800 inline-flex items-center px-3 py-2 rounded-full text-xs font-medium">
          {task?.status === "DONE" && "COMPLETED"}
        </span>
        {/* <StatusBadge status= /> */}
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
      <Link to={`/user/user-task/${task?.id}`}>
        <Button className="bg-[#4E53B1] text-white w-fit cursor-pointer mt-4">View Task</Button>
      </Link>
    </tr>
  );
}
