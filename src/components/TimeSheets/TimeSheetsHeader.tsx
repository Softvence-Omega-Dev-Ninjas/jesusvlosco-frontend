import { FileText } from "lucide-react";
import { SearchIcon } from "@/components/TimeSheets/Icons";

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExport: () => void;
  pendingCount: number;
  onPendingClick: () => void;
}

const TimeSheetsHeader: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  searchQuery,
  setSearchQuery,
  onExport,
  pendingCount,
  onPendingClick,
}) => (
  <section className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
    <div className="flex items-center space-x-2">
      <span className="text-gray-700 font-medium">Select Date:</span>
      <div className="relative">
        <input
          type="date"
          className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
      </div>
    </div>
    <div className="flex flex-col  sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <button
        onClick={onPendingClick}
        className="relative cursor-pointer flex items-center justify-center px-4 py-2 rounded-full border border-yellow-500 text-yellow-700 font-semibold text-sm bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200 whitespace-nowrap"
      >
        <span className="absolute -top-2 -left-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-orange-500 rounded-full">
          {pendingCount}
        </span>
        <span className="block leading-tight">Pending Requests</span>
      </button>
      <div className="relative w-full bg-white sm:w-auto">
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button
        onClick={onExport}
        className="flex items-center gap-2 bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
      >
        <FileText className="w-6 h-6" />
        <span>Export</span>
      </button>
    </div>
  </section>
);

export default TimeSheetsHeader;
