import React, { useState } from 'react';
import { LiaDownloadSolid } from "react-icons/lia";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import DateRangePickerModal from '@/components/SurveyModal/DateRangePickerModal';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);
  return (
    <div className="flex text-primary">
      {Array.from({ length: totalStars }).map((_, index) => (
        <span key={index} className={index < filledStars ? 'text-primary' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
};

const SurveyDetails: React.FC = () => {
  const surveyData = [
    {
      dateSubmitted: '8/2/19',
      timeSubmitted: '05:49 pm',
      name: 'Arlene Mccoy',
      currentJobSatisfaction: 'Satisfied',
      managerSupport: 'Satisfied',
      workLifeBalance: 'Satisfied',
      teamLeaderRating: 5,
    },
    {
      dateSubmitted: '5/27/19',
      timeSubmitted: '02:34 am',
      name: 'Savannah Nguyen',
      currentJobSatisfaction: 'Satisfied',
      managerSupport: 'Satisfied',
      workLifeBalance: 'Satisfied',
      teamLeaderRating: 4,
    },
    {
      dateSubmitted: '8/21/19',
      timeSubmitted: '07:38 am',
      name: 'Theresa Webb',
      currentJobSatisfaction: 'Satisfied',
      managerSupport: 'Satisfied',
      workLifeBalance: 'Satisfied',
      teamLeaderRating: 5,
    },
    {
      dateSubmitted: '11/7/19',
      timeSubmitted: '05:51 am',
      name: 'Darrell Steward',
      currentJobSatisfaction: 'Dissatisfied',
      managerSupport: 'Dissatisfied',
      workLifeBalance: 'Dissatisfied',
      teamLeaderRating: 3,
    },
    {
      dateSubmitted: '8/21/19',
      timeSubmitted: '07:38 am',
      name: 'Theresa Webb',
      currentJobSatisfaction: 'Satisfied',
      managerSupport: 'Satisfied',
      workLifeBalance: 'Satisfied',
      teamLeaderRating: 5,
    },
    {
      dateSubmitted: '11/7/19',
      timeSubmitted: '05:51 am',
      name: 'Darrell Steward',
      currentJobSatisfaction: 'Dissatisfied',
      managerSupport: 'Dissatisfied',
      workLifeBalance: 'Dissatisfied',
      teamLeaderRating: 3,
    },
    {
      dateSubmitted: '8/21/19',
      timeSubmitted: '07:38 am',
      name: 'Theresa Webb',
      currentJobSatisfaction: 'Satisfied',
      managerSupport: 'Satisfied',
      workLifeBalance: 'Satisfied',
      teamLeaderRating: 5,
    },
    {
      dateSubmitted: '11/7/19',
      timeSubmitted: '05:51 am',
      name: 'Darrell Steward',
      currentJobSatisfaction: 'Dissatisfied',
      managerSupport: 'Dissatisfied',
      workLifeBalance: 'Dissatisfied',
      teamLeaderRating: 3,
    },
    {
      dateSubmitted: '8/21/19',
      timeSubmitted: '07:38 am',
      name: 'Theresa Webb',
      currentJobSatisfaction: 'Satisfied',
      managerSupport: 'Satisfied',
      workLifeBalance: 'Satisfied',
      teamLeaderRating: 5,
    },
    {
      dateSubmitted: '11/7/19',
      timeSubmitted: '05:51 am',
      name: 'Darrell Steward',
      currentJobSatisfaction: 'Dissatisfied',
      managerSupport: 'Dissatisfied',
      workLifeBalance: 'Dissatisfied',
      teamLeaderRating: 3,
    },
    {
      dateSubmitted: '8/21/19',
      timeSubmitted: '07:38 am',
      name: 'Theresa Webb',
      currentJobSatisfaction: 'Satisfied',
      managerSupport: 'Satisfied',
      workLifeBalance: 'Satisfied',
      teamLeaderRating: 5,
    },
    {
      dateSubmitted: '11/7/19',
      timeSubmitted: '05:51 am',
      name: 'Darrell Steward',
      currentJobSatisfaction: 'Dissatisfied',
      managerSupport: 'Dissatisfied',
      workLifeBalance: 'Dissatisfied',
      teamLeaderRating: 3,
    },
  ];

   const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("");

  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-center mb-6">
        <svg
          className="w-6 h-6 text-primary cursor-pointer mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <h1 className="text-xl md:text-2xl font-semibold text-primary flex-1">
          Employee Satisfaction Survey Report
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4 mt-4 md:mt-0">
          <button
          onClick={() => setIsModalOpen(true)} className="flex items-center px-3 py-2 bg-white rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Date
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button className="flex items-center px-3 py-2 border text-[#5B5B5B] border-gray-300 rounded-md ">
            <LiaDownloadSolid className="text-xl mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative w-full">
        {/* Scrollable wrapper */}
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-400  border-2 border-gray-300  rounded-xl p-4">
          <table className="min-w-[1200px] w-full">
            <thead className="  border-b-2 border-gray-300 ">
              <tr className='text-primary'>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">What is your name?</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">How satisfied are you with your current job?</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">How supportive is your manager helping you achieve your goals?</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Do you feel you have a good work-life balance?</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Team leader rating</th>
              </tr>
            </thead>
            <tbody>
              {surveyData.map((row, index) => (
                <tr key={index} className="">
                  <td className="px-6 py-4 flex gap-4 whitespace-nowrap text-sm text-gray-900">
                    {row.dateSubmitted} <span>{row.timeSubmitted}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.currentJobSatisfaction}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.managerSupport}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.workLifeBalance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <StarRating rating={row.teamLeaderRating} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-5 z-10 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 shadow-md">
          <HiOutlineChevronLeft className="text-2xl text-gray-700" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-5 z-10 p-2 bg-primary rounded-full cursor-pointer shadow-md">
          <HiOutlineChevronRight className="text-2xl text-white" />
        </div>
      </div>

      {selectedRange && (
        <p className="mt-4 text-gray-700">
          Selected Range: <span className="font-medium">{selectedRange}</span>
        </p>
      )}

      <DateRangePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDateChange={(range) => setSelectedRange(range)}
      />
    </div>
  );
};

export default SurveyDetails;
