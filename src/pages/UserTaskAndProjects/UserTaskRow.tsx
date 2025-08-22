import { Button } from "@/components/ui/button";
import { StatusBadge } from "../TasksAndProjects/StatusBadge";
import { Link } from "react-router-dom";

interface TaskRowProps {
  task: any;
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

export function UserTaskRow({ task }: TaskRowProps) {
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
      <Link to={`/user/user-task/${task?.id}`}>
        <Button className="bg-[#4E53B1] text-white w-fit cursor-pointer mt-4">View Task</Button>
      </Link>
    </tr>
  );
}
