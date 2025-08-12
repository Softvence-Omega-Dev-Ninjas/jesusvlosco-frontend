
import { FC, useState } from "react";
import { BsStopwatch } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { Tab } from "@headlessui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import ShiftTemplateDropdown from "./ShiftTemplateDropdown";
import EmployeeCardPopup from "./EmployeeCardPopup";

interface EmployeeAvailabilityProps {
    addPublishedShift: (shift: any) => void;
}

const employees = [
    { name: "Sarah Johnson", status: "Available", role: "Manager", offDay: "Friday", avatar: 1 },
    { name: "Mike Chen", status: "Busy", role: "Superintendent", offDay: "Sunday", avatar: 2 },
    { name: "Emma Willson", status: "Available", role: "Associate", offDay: "Friday", avatar: 3 },
    { name: "David Rodriguez", status: "Available", role: "Sales", offDay: "Sunday", avatar: 4 },
    { name: "Lisa Thompson", status: "Busy", role: "Team Lead", offDay: "Friday", avatar: 5 },
    { name: "Guy Hawkins", status: "Available", role: "Supervisor", offDay: "Sunday", avatar: 6 },
    { name: "Wade Warren", status: "Busy", role: "Coordinator", offDay: "Friday", avatar: 7 },
    { name: "Esther Howard", status: "Available", role: "Manager", offDay: "Friday", avatar: 8 },
    { name: "Savannah Nguyen", status: "Busy", role: "Manager", offDay: "Friday", avatar: 9 },
];

const tasksList = [
    "Metro Shopping Center",
    "City Bridge Renovations",
    "Golden Hills Estates",
    "Riverside Apartments",
    "The Commerce Hub"
];

const activityLog = [
    {
        type: "publish",
        user: "Emma Willson",
        date: "17/06/2025",
        time: "11:20 am",
        avatar: 3,
        icon: "📢",
        message: "Shift published by"
    },
    {
        type: "complete",
        user: "Emma Willson",
        date: "06/04/2025",
        time: "01:20 am",
        avatar: 3,
        icon: "✅",
        message: "completed a task"
    },
    {
        type: "complete",
        user: "Emma Willson",
        date: "02/03/2025",
        time: "03:20 am",
        avatar: 3,
        icon: "✅",
        message: "completed a task"
    },
    {
        type: "complete",
        user: "Emma Willson",
        date: "02/03/2025",
        time: "04:30 am",
        avatar: 3,
        icon: "✅",
        message: "completed a task"
    },
    {
        type: "create",
        user: "Marley Stanton",
        date: "17/06/2025",
        time: "11:20 am",
        avatar: 6,
        icon: "📝",
        message: "Shift created by"
    }
];

const EmployeeAvailability: FC<EmployeeAvailabilityProps> = ({ addPublishedShift }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [checkedTasks, setCheckedTasks] = useState<string[]>(["Metro Shopping Center", "Riverside Apartments"]);
    const [newTask, setNewTask] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [shiftDetails, setShiftDetails] = useState({
        date: "2025-06-10",
        startTime: "09:00",
        endTime: "17:00",
        title: "",
        job: "",
        location: "Parksid Retreat",
        description: ""
    });

    const toggleTask = (task: string) => {
        setCheckedTasks(prev =>
            prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
        );
    };

    const handleAddTask = () => {
        if (newTask) {
            tasksList.push(newTask);
            setNewTask("");
            setShowInput(false);
        }
    };

    const handleSaveDraft = () => {
        const employeeName = openIndex !== null ? employees[openIndex].name : "Unknown";
        const newShift = {
            employeeName,
            date: shiftDetails.date,
            startTime: `${shiftDetails.startTime}am`,
            endTime: `${shiftDetails.endTime}pm`,
            location: shiftDetails.location,
            tasksDone: checkedTasks.length > 0,
            status: 'draft'
        };

        addPublishedShift(newShift);
        setOpenIndex(null);
    };

    const handlePublish = () => {
        const employeeName = openIndex !== null ? employees[openIndex].name : "Unknown";
        const newShift = {
            employeeName,
            date: shiftDetails.date,
            startTime: `${shiftDetails.startTime}am`,
            endTime: `${shiftDetails.endTime}pm`,
            location: shiftDetails.location,
            tasksDone: checkedTasks.length > 0,
            status: 'published'
        };

        addPublishedShift(newShift);
        setOpenIndex(null);
    };

    const handleSaveTemplate = () => {
        alert("Shift saved as template");
    };

    const handleDelete = () => {
        alert("Shift deleted");
        setOpenIndex(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShiftDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <aside className="w-full mt-10 mb-12 rounded-2xl lg:w-1/3 xl:w-1/4 bg-white border-r border-gray-200 p-4 relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[rgba(78,83,177,1)] text-lg font-bold">Employee Availability</h2>
                <span className="text-xs text-green-600 bg-green-100 rounded-full px-2 py-0.5">
                    {employees.filter(e => e.status === 'Available').length} active
                </span>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <ul className="space-y-3">
                {employees.map((emp, idx) => (
                    <li
                        key={idx}
                        className="relative flex items-start mt-4 gap-3 border border-gray-300 rounded-lg p-3 hover:shadow-sm"
                    >
                        <img
                            src={`https://i.pravatar.cc/40?img=${emp.avatar}`}
                            alt={emp.name}
                            className="w-10 h-10 lg:mt-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold mb-1 text-sm text-gray-700 truncate">{emp.name}</span>
                                {/* <span className="text-[10px] border rounded-full px-2 py-0.5 text-indigo-700 border-indigo-200">
                                {emp.role}
                            </span> */}
                                <EmployeeCardPopup
                                    name={emp.name}
                                    title={emp.role}
                                    department="Sales"
                                    email={`${emp.name.split(" ").join(".")}@company.com`}
                                    phone="+1 (555) 234-5678"
                                    avatar={`https://i.pravatar.cc/100?img=${emp.avatar}`}
                                    role={emp.role}
                                />
                            </div>
                            
                            <p
                                className={`text-xs mb-1 ${emp.status === 'Available' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {emp.status === 'Available' ? '' : ''} {emp.status}
                            </p>


                            {/* Floating Templates tab */}
                            {/* <div className="fixed top-120 right-0 h-34 w-4 sm:w-6 md:w-8 lg:w-8 bg-[rgba(78,83,177,1)] text-white text-[20px] font-semibold flex items-center justify-center cursor-pointer rounded-l-md">
                                <span className="transform -rotate-90 whitespace-nowrap">Templates</span>
                            </div> */}


                            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 mt-1">
                                <button onClick={() => setOpenIndex(idx)} className="text-lg">
                                    <BsStopwatch />
                                </button>
                                {/* <TiEqualsOutline className="text-lg" /> */}
                                <ShiftTemplateDropdown />
                                <span className="text-lg font-medium">1</span>
                            </div>
                            <p className="text-sm text-[rgba(78,83,177,1)]">Off Day: {emp.offDay}</p>
                        </div>

                        {openIndex === idx && (
                            <div className="absolute top-14 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[560px]">
                                <button
                                    onClick={() => setOpenIndex(null)}
                                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                                >
                                    &times;
                                </button>
                                <Tab.Group className="p-1">
                                    <Tab.List className="flex space-x-4 mb-4">
                                        {['Shift Details', 'Shift Tasks', 'Shift Activity'].map((tab, tabIdx) => (
                                            <Tab
                                                key={tabIdx}
                                                className={({ selected }) =>
                                                    `px-3 py-1.5 text-sm font-medium border-b-2 ${selected ? 'border-[rgba(78,83,177,1)] text-[rgba(78,83,177,1)]' : 'border-transparent text-gray-500'}`
                                                }
                                            >
                                                {tab}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                    <Tab.Panels>
                                        <Tab.Panel>
                                            <div className="space-y-3 mt-12 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <label>Date</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={shiftDetails.date}
                                                        onChange={handleInputChange}
                                                        className="border border-gray-300 px-2 py-1 rounded-md"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <span>All Day</span>
                                                        <input type="checkbox" checked className="accent-[rgba(78,83,177,1)] w-4 h-4" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 mt-12 mb-6 items-center">
                                                    <label>Start</label>
                                                    <input
                                                        type="time"
                                                        name="startTime"
                                                        value={shiftDetails.startTime}
                                                        onChange={handleInputChange}
                                                        className="border border-gray-300 px-2 py-1 rounded-md"
                                                    />
                                                    <label>End</label>
                                                    <input
                                                        type="time"
                                                        name="endTime"
                                                        value={shiftDetails.endTime}
                                                        onChange={handleInputChange}
                                                        className="border border-gray-300 px-2 py-1 rounded-md"
                                                    />
                                                    <span className="ml-auto">08:00 Hours</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    placeholder="Shift Title"
                                                    value={shiftDetails.title}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                    type="text"
                                                    name="job"
                                                    placeholder="Job"
                                                    value={shiftDetails.job}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Select Users"
                                                    className="w-full border border-gray-300 rounded-md p-2"
                                                />
                                                <a href="#" className="text-[rgba(78,83,177,1)] text-sm underline">Add User</a>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    placeholder="Type location"
                                                    value={shiftDetails.location}
                                                    onChange={handleInputChange}
                                                    className="w-full border mt-2 border-gray-300 rounded-md p-2"
                                                />
                                                <textarea
                                                    name="description"
                                                    placeholder="Type Description"
                                                    value={shiftDetails.description}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full border border-gray-300 rounded-md p-2"
                                                ></textarea>
                                                <div className="text-gray-400 text-sm italic">📎 Attachment</div>
                                                <div className="flex items-center mt-8 justify-between">
                                                    <p>Shift Tasks <span className="text-gray-400 ml-4">No tasks created</span></p>
                                                    <a href="#" className="text-[rgba(78,83,177,1)] text-sm">View shift tasks</a>
                                                </div>
                                                <div className="flex mt-12 gap-2">
                                                    <button
                                                        className="bg-[rgba(78,83,177,1)] text-white px-4 py-2 rounded-lg text-sm"
                                                        onClick={handlePublish}
                                                    >
                                                        Publish
                                                    </button>
                                                    <button
                                                        className="border border-indigo-300 px-4 py-2 text-[rgba(78,83,177,1)] rounded-lg min-w-max text-sm"
                                                        onClick={handleSaveDraft}
                                                    >
                                                        Save Draft
                                                    </button>
                                                    <button
                                                        className="border border-indigo-300 px-4 text-[rgba(78,83,177,1)]  min-w-max py-2 rounded-lg text-sm"
                                                        onClick={handleSaveTemplate}
                                                    >
                                                        Save as Template
                                                    </button>
                                                    <button
                                                        className="text-red-500 ml-auto text-xl"
                                                        onClick={handleDelete}
                                                    >
                                                        <RiDeleteBin6Line />
                                                    </button>
                                                </div>
                                            </div>
                                        </Tab.Panel>

                                        <Tab.Panel>
                                            <ul className="text-sm mt-6 space-y-2">
                                                {tasksList.map((task, index) => (
                                                    <li key={index} className="flex items-center mt-6 justify-between">
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedTasks.includes(task)}
                                                                onChange={() => toggleTask(task)}
                                                                className="accent-green-600"
                                                            />
                                                            <span className={checkedTasks.includes(task) ? "line-through" : ""}>
                                                                {task}
                                                            </span>
                                                        </label>
                                                        <img
                                                            src={`https://i.pravatar.cc/30?img=${index + 1}`}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                            alt="profile"
                                                        />
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                className="mb-3 px-3 py-1 text-sm rounded-lg mt-10 border border-gray-300 text-black hover:bg-indigo-200"
                                                onClick={() => setShowInput(true)}
                                            >
                                                Add Task +
                                            </button>

                                            {showInput && (
                                                <div className="flex gap-2 mt-3">
                                                    <input
                                                        type="text"
                                                        value={newTask}
                                                        onChange={(e) => setNewTask(e.target.value)}
                                                        placeholder="Enter new task"
                                                        className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                                    />
                                                    <button
                                                        onClick={handleAddTask}
                                                        className="px-3 py-1 bg-green-500 text-white rounded-md"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            )}
                                        </Tab.Panel>

                                        <Tab.Panel>
                                            <ul className="text-sm space-y-3">
                                                {activityLog.map((entry, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <img
                                                            src={`https://i.pravatar.cc/30?img=${entry.avatar}`}
                                                            className="w-6 h-6 rounded-full object-cover"
                                                            alt="avatar"
                                                        />
                                                        <div>
                                                            <p>{entry.icon} <span className="font-medium text-gray-700">{entry.message} {entry.user}</span></p>
                                                            <p className="text-xs text-gray-500">{entry.date} at {entry.time}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    
    );
};

export default EmployeeAvailability;
