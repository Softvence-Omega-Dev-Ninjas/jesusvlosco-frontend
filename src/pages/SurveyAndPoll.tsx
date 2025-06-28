// SurveyPollSelector.tsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";


const SurveyAndPoll: React.FC = () => {
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value.toLowerCase();
        navigate(`/survey-poll-page/${selected}`);
    };

    return (
        <div className="bg-[#f9f9fc] p-6 rounded-lg ">
            <h2 className="text-xl md:text-2xl font-semibold text-[rgba(78,83,177,1)] mb-2">
                Create New Survey & Poll
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
                Design your survey or poll by adding questions, choosing response types,
                and setting audience and scheduling options
            </p>

            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <label htmlFor="type" className="text-gray-700 text-sm mb-1">
                        Type
                    </label>
                    <select
                        id="type"
                        className="w-48 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B3BDB]"
                        onChange={handleChange}
                    >
                        <option>Survey</option>
                        <option>Poll</option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
                        <Eye size={18} />
                    </button>
                    <button className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
                        <Pencil size={18} />
                    </button>
                </div>
                
            </div>
            <div className="mt-6">
                
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default SurveyAndPoll;
