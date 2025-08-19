import { FC } from "react";
import { HiX } from "react-icons/hi";
import { ResponseCard } from "./ResponseCard";
import { Announcement } from "./AnnouncementList";

// interface Announcement {
//   id: number;
//   title: string;
//   time: string;
//   tags: string[];
// }

interface ResponsePanelProps {
  announcement: Announcement;
  onClose: () => void;
}

const totalUsers = 250;
const viewedUsers = 210;
const likes = 200;

const dummyUsers = Array.from({ length: 12 }).map((_, i) => ({
  name: `Cody Fisher ${i + 1}`,
  phone: "(702) 555‑0122",
  like: 1,
  date: "6/9/14",
  status: "Viewed" as const,
  confirmed: i % 3 === 1 ? "Cancelled" : "Confirmed",
  profile: `https://i.pravatar.cc/40?img=${i + 1}`,
}));

export const ResponsePanel: FC<ResponsePanelProps> = ({
  announcement,
  onClose,
}) => {
  const users = dummyUsers; // swap in live data

  return (
    // <section className="w-full max-w-8xl bg-white  rounded-xl p-4 md:p-6 overflow-hidden">
    <section className="w-full max-w-8xl bg-white rounded-xl p-3 sm:p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-indigo-700 truncate">
            {announcement.title}
          </h1>
          <p className="text-sm text-gray-500">{announcement.time}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          <HiX className="h-6 w-6" />
        </button>
      </header>

      {/* Summary card */}
      <ResponseCard total={totalUsers} viewed={viewedUsers} likes={likes} />

      {/* Users table */}
      <div className="w-full overflow-x-auto pb-2 mt-6 -mx-2 sm:mx-0">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["", "Name", "Phone", "Like", "Date", "Status", "Confirmed"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-gray-500 whitespace-nowrap"
                  >
                    {h || (
                      <input
                        type="checkbox"
                        className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    )}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {/* Checkbox */}
                {/* <td className="px-3 py-2 sm:px-4 sm:py-3"> */}
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-[11px] sm:text-sm">
                  <input
                    type="checkbox"
                    className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                {/* Name */}
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                  <div className="flex items-center gap-2">
                    <img
                      src={u.profile}
                      alt={u.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                    />
                    <span>{u.name}</span>
                  </div>
                </td>
                {/* Phone */}
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                  {u.phone}
                </td>
                {/* Like */}
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                  {u.like}
                </td>
                {/* Date */}
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                  {u.date}
                </td>
                {/* Status */}
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.status === "Viewed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                {/* Confirmed */}
                <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.confirmed === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.confirmed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile pagination */}
      <div className="md:hidden flex justify-center mt-4">
        <button className="px-4 py-2 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
          Load More
        </button>
      </div>
    </section>
  );
};
