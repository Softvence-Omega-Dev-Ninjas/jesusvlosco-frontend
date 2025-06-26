
import { FC, useState, useRef } from "react";
import {
    HiOutlineChevronDown,
    HiOutlineBell,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
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

const WeeklyScheduleGrid: FC<WeeklyScheduleGridProps> = ({ publishedShifts }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const gridRef = useRef<HTMLDivElement>(null);

    // Function to get days for the current week
    const getDaysForWeek = (): { day: string; date: string; fullDate: Date }[] => {
        const days = [];
        const startDate = new Date(currentDate);

        // Set to start of week (Monday)
        const dayOfWeek = startDate.getDay();
        const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            days.push({
                day: currentDay.toLocaleString('default', { weekday: 'short' }),
                date: formatDate(currentDay),
                fullDate: new Date(currentDay)
            });
        }

        return days;
    };

    const formatDate = (date: Date): string => {
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const formatDateRange = (): string => {
        const startDate = new Date(currentDate);
        const dayOfWeek = startDate.getDay();
        const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startDate.setDate(diff);

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        return `${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getDate()} - ${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getDate()}`;
    };

    const changeWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -7 : 7));
        setCurrentDate(newDate);
    };

    const getShiftForDay = (dayDate: Date) => {
        return publishedShifts.find(shift => {
            const shiftDate = new Date(shift.date);
            return (
                shiftDate.getFullYear() === dayDate.getFullYear() &&
                shiftDate.getMonth() === dayDate.getMonth() &&
                shiftDate.getDate() === dayDate.getDate()
            );
        });
    };

    const days = getDaysForWeek();

    return (
        <section className="w-full bg-gray-50 p-4 rounded-lg shadow-sm">
            <h1 className="text-indigo-700 mb-2 text-lg font-bold">Weekly Schedule</h1>
            <div className="flex flex-wrap items-center justify-between mb-6 gap-3 min-w-[450px]">
                <div className="flex items-center gap-2 flex-wrap">
                    <button className="flex items-center justify-center border-indigo-300 text-indigo-700 px-2 font-bold py-1.5 rounded-full">
                        <FilterToggleWrapper />
                    </button>
                    <button className="flex items-center gap-1 text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50">
                        Week <HiOutlineChevronDown className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1 bg-white border border-indigo-300 rounded-full px-1">
                        <button
                            className="text-sm text-indigo-700 p-1 rounded-full hover:bg-indigo-50"
                            onClick={() => changeWeek('prev')}
                        >
                            <HiOutlineChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            className="text-sm text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50 whitespace-nowrap"
                        >
                            ‹ {formatDateRange()} ›
                        </button>
                        <button
                            className="text-sm text-indigo-700 p-1 rounded-full hover:bg-indigo-50"
                            onClick={() => changeWeek('next')}
                        >
                            <HiOutlineChevronRight className="w-4 h-4" />
                        </button>
                    </div>
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

            <div className="overflow-x-auto scrollbar-hide pb-4">
                <div className="grid grid-cols-7 gap-2 text-sm font-medium text-indigo-700 mb-2 min-w-max">
                    {days.map((day, i) => (
                        <div
                            key={i}
                            className="text-center text-sm lg:text-lg py-1 whitespace-nowrap"
                        >
                            {day.day} {day.date}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm min-w-max">
                    {days.map((day, i) => {
                        const shift = getShiftForDay(day.fullDate);
                        if (shift) {
                            if (shift.status === 'published') {
                                return (
                                    <div
                                        key={i}
                                        className="bg-indigo-100 border border-indigo-500 rounded-md p-2 min-h-[120px]"
                                    >
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
                                    <div
                                        key={i}
                                        className="border-2 border-indigo-400 rounded-md p-2 min-h-[120px]"
                                    >
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
                                    className="border border-dashed mt-3 mb-2 border-gray-300 rounded-md min-h-[120px] flex items-center justify-center text-xl text-gray-500"
                                >
                                    +
                                </div>
                            );
                        }
                    })}
                </div>

                {/* Additional empty rows */}
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                    <div key={`row-${rowIdx}`} className="grid grid-cols-7 gap-2 text-center text-sm min-w-max">
                        {Array.from({ length: 7 }).map((_, colIdx) => (
                            <div
                                key={`r${rowIdx}-c${colIdx}`}
                                className="border border-dashed mb-2 border-gray-300 rounded-md min-h-[120px] flex items-center justify-center text-xl text-gray-500"
                            >
                                +
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WeeklyScheduleGrid;