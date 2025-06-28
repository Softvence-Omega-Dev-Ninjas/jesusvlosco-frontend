const TimesheetSummary: React.FC = () => {
  return (
    <div className="p-4  flex justify-between gap-2 mb-5  ">
   <div className="flex gap-10">
       <div>
        <p className="text-xl font-bold text-gray-900">183.75</p>
        <p className="text-sm text-gray-500">Regular</p>
      </div>
    <div className="flex items-center">
        +
    </div>
      <div>
        <p className="text-xl font-bold text-gray-900">11</p>
        <p className="text-sm text-gray-500">1.5 X Overtime</p>
      </div>
       <div className="flex items-center">
        +
    </div>
      <div>
        <p className="text-xl font-bold text-gray-900">8</p>
        <p className="text-sm text-gray-500">Paid time off</p>
      </div>
       <div className="flex items-center">
        =
    </div>
      <div>
        <p className="text-xl font-bold text-gray-900">202.75</p>
        <p className="text-sm text-gray-500">Total Paid Hours</p>
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">0</p>
        <p className="text-sm text-gray-500">Unpaid time off</p>
      </div>
   </div>
      <div className="flex flex-col items-center justify-center border-l border-gray-200 pl-4">
        <p className="text-xl font-bold text-gray-900">2340,58 US$</p>
        <p className="text-sm text-gray-500">Pay per dates</p>
      </div>
    </div>
  );
};

export default TimesheetSummary