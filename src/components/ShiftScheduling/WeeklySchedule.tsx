
import { FC } from "react";
import {
    HiOutlineChevronDown,
    HiOutlineBell,
   
} from "react-icons/hi";
import FilterToggleWrapper from "./FilterDropdownPanel";

interface WeeklyScheduleGridProps {
    publishedShifts: {
        date: string;
        startTime: string;
        endTime: string;
        location: string;
        tasksDone: boolean;
        status: 'published' | 'draft';
    }[];
}

const days = ["Mon 6/9", "Tue 6/10", "Wed 6/11", "Thu 6/12", "Fri 6/13", "Sat 6/14", "Sun 6/15"];

const WeeklyScheduleGrid: FC<WeeklyScheduleGridProps> = ({ publishedShifts }) => {
    const getShiftForDay = (day: string) => {
        const dayNumber = day.split('/')[1];
        return publishedShifts.find(shift => {
            const shiftDay = shift.date.split('-')[2];
            return shiftDay === dayNumber;
        });
    };

    return (
        <section className="w-full bg-gray-50 p-4 rounded-lg shadow-sm">
            <h1 className="text-indigo-700 mb-2 text-lg font-bold">Weekly Schedule</h1>
            <div className="flex flex-wrap items-center justify-between mb-6 gap-3 min-w-[450px]">
                <div className="flex items-center gap-2 flex-wrap">
                    <button className="flex items-center justify-center  border-indigo-300 text-indigo-700 px-2 font-bold py-1.5 rounded-full ">
                        <FilterToggleWrapper />
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

            <div className="grid grid-cols-7 gap-2 text-sm font-medium text-indigo-700 mb-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-sm lg:text-lg py-1">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {days.map((day, i) => {
                    const shift = getShiftForDay(day);
                    if (shift) {
                        if (shift.status === 'published') {
                            return (
                                <div key={i} className="bg-indigo-100 border border-indigo-500 rounded-md p-2">
                                    <p className="text-xs font-medium mt-4 mb-4 text-indigo-800">
                                        {shift.startTime} - {shift.endTime}
                                    </p>
                                    <p className="text-xs text-indigo-700">{shift.location}</p>
                                    {shift.tasksDone && (
                                        <p className="text-xs text-indigo-700 bg-indigo-200 inline-block px-2 py-0.5 rounded-full mt-4">
                                            Tasks Done
                                        </p>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <div key={i} className="border-2 border-indigo-400 rounded-md p-2">
                                    <p className="text-xs font-medium mt-6 mb-6 text-gray-800">
                                        {shift.startTime} - {shift.endTime}
                                    </p>
                                    <p className="text-xs text-gray-600">{shift.location}</p>
                                </div>
                            );
                        }
                    } else {
                        return (
                            <div
                                key={i}
                                className="border border-dashed rounded-md aspect-square min-w-[40px] flex items-center justify-center text-xl text-gray-500"
                            >
                                +
                            </div>
                        );
                    }
                })}

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