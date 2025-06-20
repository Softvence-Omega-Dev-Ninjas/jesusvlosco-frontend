
import { FC } from "react";
import {
    HiOutlineChevronDown,
    HiOutlineBell,
    HiOutlineFilter
} from "react-icons/hi";

const days = ["Mon 6/9", "Tue 6/10", "Wed 6/11", "Thu 6/12", "Fri 6/13", "Sat 6/14", "Sun 6/15"];

const WeeklyScheduleGrid: FC = () => {
    return (
        <section className="w-full bg-gray-50 p-4 rounded-lg shadow-sm">
           
            <h1 className="text-indigo-700 mb-2 text-lg font-bold">Weekly Schedule</h1>
            <div className="flex flex-wrap items-center justify-between mb-6 gap-3 min-w-[450px]">

                <div className="flex items-center gap-2 flex-wrap">
                    <button className="flex items-center justify-center border border-indigo-300 text-indigo-700 px-2 py-1.5 rounded-full hover:bg-indigo-50">
                        <HiOutlineFilter className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-1 text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50">
                        Week <HiOutlineChevronDown className="w-4 h-4" />
                    </button>
                    <button className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50">
                        ‹ Jul 28 - Aug 3 ›
                    </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1">
                        Actions <HiOutlineChevronDown className="w-4 h-4" />
                    </button>
                    <button className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1">
                        Add <HiOutlineChevronDown className="w-4 h-4" />
                    </button>
                    <button className="text-sm bg-indigo-700 text-white px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-indigo-800">
                        Publish <HiOutlineBell className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-2 text-sm font-medium text-indigo-700 mb-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-sm lg:text-lg py-1">{day}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {/* Row 1 */}
                <div className="border-2 border-indigo-300  rounded-md p-2">
                    <p className="text-xs font-medium mt-6 mb-6">9:00am - 5:00pm</p>
                    <p className="text-xs text-gray-600">Parksid Retreat</p>
                </div>
                <div className="bg-indigo-100 border border-indigo-500 rounded-md p-2">
                    <p className="text-xs font-medium mt-4 mb-4 text-indigo-800">9:00am - 5:00pm</p>
                    <p className="text-xs text-indigo-700">Parksid Retreat</p>
                    <p className=" text-xs text-indigo-700 bg-indigo-200 inline-block px-2 py-0.5 rounded-full mt-4">Tasks Done</p>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={`r1-${i}`}
                        className="border border-dashed rounded-md aspect-square min-w-[40px] flex items-center justify-center text-xl text-gray-500"
                    >
                        +
                    </div>
                ))}

                {/* Rows 2–6 placeholder */}
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                    <>
                        {Array.from({ length: 7 }).map((_, colIdx) => (
                            <div
                                key={`r${rowIdx + 2}-c${colIdx}`}
                                className="border border-dashed rounded-md aspect-square min-w-[40px] flex items-center justify-center text-xl text-gray-500"
                            >
                                +
                            </div>
                        ))}
                    </>
                ))}
            </div>
        </section>
    );
};

export default WeeklyScheduleGrid;


