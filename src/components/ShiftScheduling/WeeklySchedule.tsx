
import { FC, useState } from "react";
import {
    HiOutlineChevronDown,
    HiOutlineBell,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineChevronUp,
} from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";

interface WeeklyScheduleGridProps {
    publishedShifts: {
        employeeName: string;
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
    const [isTemplateOpen, setIsTemplateOpen] = useState(false);

    const getDaysForWeek = (): { day: string; date: string; fullDate: Date }[] => {
        const days = [];
        const startDate = new Date(currentDate);
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

    const getShiftForDay = (employeeName: string, dayDate: Date) => {
        return publishedShifts.find(shift => {
            const shiftDate = new Date(shift.date);
            return (
                shift.employeeName === employeeName &&
                shiftDate.getFullYear() === dayDate.getFullYear() &&
                shiftDate.getMonth() === dayDate.getMonth() &&
                shiftDate.getDate() === dayDate.getDate()
            );
        });
    };

    // Exact employee names (must match with EmployeeAvailability)
    const defaultEmployees = [
        "Sarah Johnson", "Mike Chen", "Emma Willson",
        "David Rodriguez", "Lisa Thompson", "Guy Hawkins",
        "Wade Warren", "Esther Howard", "Savannah Nguyen",
    ];

    const uniqueEmployees = defaultEmployees;
    const days = getDaysForWeek();

    return (
        <section className="w-full mb-12 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm overflow-x-auto">
            {isTemplateOpen && (
                <div className="fixed top-0 right-0 h-full w-full sm:w-[320px] bg-white shadow-xl z-50 transition-transform border-l flex flex-col rounded-none sm:rounded-lg">
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-lg font-semibold text-gray-700">Shifts</h2>
                        <button
                            onClick={() => setIsTemplateOpen(false)}
                            className="text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-4 overflow-y-auto flex-1">
                        <p className="text-sm text-gray-500 mb-2">Drag and drop to the schedule</p>
                        <input
                            type="text"
                            placeholder="Search Templates"
                            className="w-full border border-gray-300 px-3 py-2 rounded mb-4 text-sm"
                        />
                        <div className="space-y-3">
                            <div className="bg-[rgba(78,83,177,1)] text-white p-3 rounded cursor-pointer">
                                <p className="text-sm font-medium">9:00 am – 5:00 pm</p>
                                <p className="text-xs">Morning Shift</p>
                            </div>
                            <div className="bg-[rgba(78,83,177,1)] text-white p-3 rounded cursor-pointer">
                                <p className="text-sm font-medium">10:00 am – 6:00 pm</p>
                                <p className="text-xs">Night Shift</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t">
                        <button className="w-full border border-[rgba(78,83,177,1)] text-[rgba(78,83,177,1)] px-4 py-2 rounded hover:bg-indigo-50 text-sm">
                            Add Template
                        </button>
                    </div>
                </div>
            )}

            <h1 className="text-[rgba(78,83,177,1)] mb-2 text-lg font-bold">Weekly Schedule</h1>

            <div className="flex flex-wrap items-center justify-between mb-6 gap-3 min-w-[450px]">
                <div className="flex items-center gap-2 flex-wrap">
                    <button className="flex items-center justify-center border-indigo-300 text-[rgba(78,83,177,1)] px-2 font-bold py-1.5 rounded-full">
                        <img className="rounded-full border  px-2 font-bold py-1  mt-1" src="../src/assets/filter.png" alt="" />
                    </button>
                    <button className="flex items-center gap-1 text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50">
                        Week <HiOutlineChevronDown className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1 bg-white border border-indigo-300 rounded-full px-1">
                        <button
                            className="text-sm text-[rgba(78,83,177,1)] p-1 rounded-full hover:bg-indigo-50"
                            onClick={() => changeWeek('prev')}
                        >
                            <HiOutlineChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="text-sm text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50 whitespace-nowrap">
                            {formatDateRange()}
                        </button>
                        <button
                            className="text-sm text-[rgba(78,83,177,1)] p-1 rounded-full hover:bg-indigo-50"
                            onClick={() => changeWeek('next')}
                        >
                            <HiOutlineChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {!isTemplateOpen && (
                        <div
                            onClick={() => setIsTemplateOpen(true)}
                            className="fixed top-120 right-0 h-34 w-4 sm:w-6 md:w-8 lg:w-8 bg-[rgba(78,83,177,1)] text-white text-[20px] font-semibold flex items-center justify-center cursor-pointer rounded-l-md z-50"
                        >
                            <span className="transform -rotate-90 whitespace-nowrap">Templates</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button className="text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1">
                        Actions <HiOutlineChevronUp className="w-4 h-4 " />
                    </button>
                    <button className="text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50 flex items-center gap-1">
                        Add <HiOutlineChevronUp className="w-4 h-4" />
                    </button>
                    <button className="text-sm bg-[rgba(78,83,177,1)] text-white px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-indigo-800">
                        Publish <HiOutlineBell className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="min-w-max mt-6">
                <div className="grid grid-cols-7 gap-2 text-sm font-medium text-[rgba(78,83,177,1)] mb-2">
                    {days.map((day, i) => (
                        <div key={i} className="text-center whitespace-nowrap">
                            {day.day} {day.date}
                        </div>
                    ))}
                </div>

                {uniqueEmployees.map((emp, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-7 gap-2 mb-2">
                        {days.map((day, colIdx) => {
                            const shift = getShiftForDay(emp, day.fullDate);
                            return (
                                <div
                                    key={colIdx}
                                    className={`min-h-[100px]  lg:w-40 lg:h-32.5 rounded-md p-2 transition-all relative ${shift
                                        ? shift.status === "published"
                                            ? "bg-indigo-200 border border-[rgba(78,83,177,1)]"
                                            : "bg-white border-2 border-indigo-400"
                                        : "border border-dashed border-gray-300 bg-white flex items-center justify-center"
                                        }`}
                                >
                                    {!shift && <CiCirclePlus className="text-2xl text-black" />}
                                    {shift && (
                                        <>
                                            <p className="text-xs mt-4 px-1 font-medium text-indigo-800 mb-3 text-center">
                                                {shift.startTime} - {shift.endTime}
                                            </p>
                                            <p className="text-xs text-center text-gray-500">{shift.location}</p>
                                            {shift.status === "published" && shift.tasksDone && (
                                                <div className="flex "> <div>
                                                    <img className="mt-2.5 lg:ml-6 " src="../src/assets/task.png" alt="" /></div>
                                                    <p className="text-xs  text-center text-[rgba(78,83,177,1)] bg-indigo-200 inline-block px-2 py-0.5 rounded-full mt-2">
                                                        Tasks Done
                                                    </p></div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WeeklyScheduleGrid;


