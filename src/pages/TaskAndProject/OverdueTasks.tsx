export default function OverdueTasks() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-[#4E53B1] mb-6">Overdue Tasks</h2>
      <div className="space-y-4">
        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">Metro Shopping Center</h3>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Overdue</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Due: 23/06/25 at 12:00 am</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">JC</div>
            <span className="text-sm">Jane Cooper</span>
          </div>
        </div>
        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">Riverside Apartments</h3>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Overdue</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Due: 23/06/25 at 12:00 am</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">WW</div>
            <span className="text-sm">Wade Warren</span>
          </div>
        </div>
      </div>
    </div>
  );
}
