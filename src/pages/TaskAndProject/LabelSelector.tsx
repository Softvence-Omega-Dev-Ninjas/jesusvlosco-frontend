export default function LabelSelector() {
  return (
    <div className="flex items-center gap-4">
      <label className="w-24 text-gray-700 font-medium">Labels</label>
      <div className="flex-1 relative">
        <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4E53B1]">
          <option>Select</option>
          <option>General Tasks</option>
          <option>Urgent</option>
          <option>Low Priority</option>
        </select>
      </div>
    </div>
  );
}
