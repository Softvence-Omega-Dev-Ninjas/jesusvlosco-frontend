import React from 'react';
import { Link } from 'react-router-dom';

interface ChartDataItem {
  label: string;
  percentage: number;
  color: string;
}

const SurveyFirstCard: React.FC = () => {
  const departmentData: ChartDataItem[] = [
    { label: 'Sales', percentage: 30, color: '#22C55E' },
    { label: 'HR', percentage: 25, color: '#8B5CF6' },
    { label: 'IT', percentage: 20, color: '#3B82F6' },
    { label: 'Marketing', percentage: 25, color: '#F97316' },
  ];

  const generateConicGradient = (data: ChartDataItem[]) => {
    let currentAngle = 0;
    const gradientParts = data
      .map((item) => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + (item.percentage / 100) * 360;
        currentAngle = endAngle;
        return `${item.color} ${startAngle}deg ${endAngle}deg`;
      })
      .join(', ');
    return `conic-gradient(${gradientParts})`;
  };

  

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Employee Satisfaction Survey Response
          </h1>
          <p className="text-[#5B5B5B] mt-1">
            View and manage all surveys currently active. Monitor participation and status at a glance
          </p>
        </div>
        <div className="flex space-x-3 ">
        <Link to="survey-details" >  <button className="px-5 py-2 bg-primary rounded-md text-white cursor-pointer ">
            View Response
          </button></Link>
          <button className="px-5 py-2 text-primary outline rounded-md cursor-pointer">
            Delete survey
          </button>
        </div>
      </div>

      {/* Survey Info */}
      <div className="mb-8 text-[#5B5B5B]">
        <p>
          <span className="font-medium">Owner:</span> Admin{' '}
          <span className="mx-2">|</span> <span className="font-medium">Status:</span> Active{' '}
          <span className="mx-2">|</span> <span className="font-medium">Duration:</span> May 1 - May 15, 2025
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completed Survey Card */}
        <div className=" p-6 border border-[#C5C5C5] rounded-lg flex items-center justify-center relative">
          <div className="w-40 h-40">
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-center font-bold text-2xl text-gray-800"
              style={{
                background: 'conic-gradient(#22C55E 0% 33%, #D1D5DB 33% 100%)',
              }}
            >
              <div className="bg-gray-100 w-[60%] text-[#484848] h-[60%] rounded-full flex items-center justify-center shadow-inner">
                33%
              </div>
            </div>
          </div>
          <div className="ml-6  text-lg">
            <span className="font-semibold text-2xl text-[#22C55E]">80 / </span> <span className='text-[#5B5B5B]'>200 users</span> 
            <p className='text-[#5B5B5B]'>completed</p>
          </div>
        </div>

        {/* Not Started Survey Card */}
        <div className="border border-[#C5C5C5] rounded-lg p-6  flex items-center justify-center relative">
          <div className="w-40 h-40">
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-center font-bold text-2xl text-gray-800"
              style={{
                background: 'conic-gradient(#EF4444 0% 67%, #D1D5DB 67% 100%)',
              }}
            >
              <div className="bg-gray-100 text-[#484848] w-[60%] h-[60%] rounded-full flex items-center justify-center shadow-inner">
                67%
              </div>
            </div>
          </div>
          <div className="ml-6  text-lg">
            <span className="font-semibold text-2xl text-[#EF4444]">120 /</span>  <span className='text-[#5B5B5B]'>200 users</span>
            <p className='text-[#5B5B5B]'>Not started</p>
          </div>
        </div>

        {/* Participation by Department Card (Updated) */}
        <div className="border border-[#C5C5C5] rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-primary mb-6">
            Participation by department
          </h3>

          <div className="flex items-center space-x-6">
            {/* Updated Pie/Progress Chart */}
            <div className="w-40 h-40 relative">
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: generateConicGradient(departmentData),
                }}
              >
                <div className="bg-gray-100 w-[60%] h-[60%] rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-xl font-bold text-gray-800">
                    
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col space-y-2 text-sm">
              {departmentData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyFirstCard;
