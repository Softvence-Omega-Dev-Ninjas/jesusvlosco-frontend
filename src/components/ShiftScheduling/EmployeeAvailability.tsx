
import {  useState } from "react";
import { BsStopwatch } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { Tab } from "@headlessui/react";
import { RiDeleteBin6Line } from "react-icons/ri";
import ShiftTemplateDropdown from "./ShiftTemplateDropdown";
import EmployeeCardPopup from "./EmployeeCardPopup";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { useCreateShiftMutation } from "@/store/api/admin/shift-sheduling/CreateShiftApi";
import { TUser } from "@/types/usertype";

interface ShiftFormData {
    currentUserId?: string;
    currentProjectId?: string;
    date: string; // Will be "YYYY-MM-DD" format from date input
    startTime: string; // Will be "HH:MM" format from time input  
    endTime: string; // Will be "HH:MM" format from time input
    shiftTitle: string;
    job: string;
    location: string;
    note: string;
    allDay: boolean;
    userIds: string[];
    taskIds: string[];
    shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
    saveAsTemplate: boolean;
}

interface ShiftAPIData {
    currentUserId: string;
    currentProjectId: string;
    date: string; // "2025-08-07T08:00:00.000Z" format for API
    shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
    startTime: string; // "2025-08-07T08:00:00.000Z" format for API
    endTime: string; // "2025-08-07T16:00:00.000Z" format for API
    shiftTitle: string;
    allDay: boolean;
    job: string;
    userIds: string[];
    taskIds: string[];
    location: string;
    note: string;
    saveAsTemplate: boolean;
}

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

const EmployeeAvailability = () => {
    const currentProjectId = useParams().id;
    
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [checkedTasks, setCheckedTasks] = useState<string[]>(["e8b962e7-467f-46f2-a9e6-c927adadba32"]);
    const [newTask, setNewTask] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [userIds, setUserIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [createShift] = useCreateShiftMutation();

    // React Hook Form setup
    const { 
        control, 
        handleSubmit, 
        setValue, 
        getValues, 
        reset 
    } = useForm<ShiftFormData>({
        defaultValues: {
            currentUserId: userIds[0] || "",
            currentProjectId: currentProjectId || "",
            date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            startTime: "08:00", // Time input format
            endTime: "16:00", // Time input format
            shiftTitle: "",
            job: "",
            location: "",
            note: "",
            allDay: false,
            userIds: [], // Use the same initial value
            taskIds: [],
            shiftStatus: "DRAFT",
            saveAsTemplate: false
        }
    });

    const users = useGetAllUserQuery({});
    const userList = users?.data?.data.filter((user: TUser) => user.role != "ADMIN") || [];
    
    // Filter users based on search term
    const filteredUserList = userList.filter((user: TUser) => {
        if (!searchTerm) return true; // If no search term, show all users
        
        const firstName = user.profile?.firstName?.toLowerCase() || "";
        const jobTitle = user.profile?.jobTitle?.toLowerCase() || "";
        const searchLower = searchTerm.toLowerCase();
        
        return firstName.includes(searchLower) || jobTitle.includes(searchLower);
    });
    
    console.log("UserList data:", userList);
    console.log("UserList length:", userList.length);
    console.log("Filtered UserList length:", filteredUserList.length);

    const toggleTask = (task: string) => {
        setCheckedTasks(prev => {
            const newTasks = prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task];
            setValue("taskIds", newTasks);
            return newTasks;
        });
    };

    const handleAddTask = () => {
        if (newTask) {
            tasksList.push(newTask);
            setNewTask("");
            setShowInput(false);
        }
    };

    // Form submission handlers
    const onSubmit = (data: ShiftFormData, status: "PUBLISHED" | "DRAFT" | "TEMPLATE") => {
        // Helper function to convert date and time to ISO format
        const convertToISOString = (date: string, time: string) => {
            // Combine date (YYYY-MM-DD) and time (HH:MM) into ISO format
            return `${date}T${time}:00.000Z`;
        };

        // Convert form data to API format
        const formData: ShiftAPIData = {
            currentUserId: userIds[0] || "", // Use the first userId as currentUserId
            currentProjectId: currentProjectId || data.currentProjectId || "",
            date: convertToISOString(data.date, data.startTime), // Use start time for date
            shiftStatus: status,
            startTime: convertToISOString(data.date, data.startTime),
            endTime: convertToISOString(data.date, data.endTime),
            shiftTitle: data.shiftTitle,
            allDay: data.allDay,
            job: data.job,
            location: data.location,
            note: data.note,
            saveAsTemplate: status === "TEMPLATE",
            taskIds: checkedTasks,
            userIds: userIds, // Use the current state to ensure latest values
        };
        
        console.log(`Submitting form with status: ${status}`, formData);
        // Call the mutation trigger to create the shift
        createShift(formData);
        setOpenIndex(null);
        
        // Optionally reset form after submission
        if (status === "PUBLISHED") {
            reset();
            setCheckedTasks([]);
        }
        setUserIds([]); // Clear userIds after submission
    };

    const handleSaveDraft = () => {
        const formData = getValues();
        onSubmit(formData, "DRAFT");
    };

    const handlePublish = () => {
        const formData = getValues();
        onSubmit(formData, "PUBLISHED");
    };

    const handleAssignUser = (userId: string, idx: number) => {
        console.log("handleAssignUser called with:", userId, idx);
        
        // Check if user is already assigned
        if (userIds.includes(userId)) {
            console.log("User already assigned:", userId);
            setOpenIndex(idx); // Still open the popup even if already assigned
            return;
        }
        
        // Update local state
        const newUserIds = [...userIds, userId];
        setUserIds(newUserIds);
        
        // Update React Hook Form field with the new array
        setValue("userIds", newUserIds);
        
        // Set the open index to show the popup
        setOpenIndex(idx);
        
        console.log("User assigned successfully:", userId, "New userIds:", newUserIds);
    };

    const handleSaveTemplate = () => {
        const formData = getValues();
        onSubmit(formData, "TEMPLATE");
    };

    const handleDelete = () => {
        reset();
        setCheckedTasks([]);
        setOpenIndex(null);
        alert("Form cleared");
    };

    return (
        <aside className="w-full  rounded-2xl lg:w-1/3 xl:w-1/4 bg-white border-r border-gray-200 p-4 relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[rgba(78,83,177,1)] text-lg font-bold">Employee Availability</h2>
                <span className="text-xs text-green-600 bg-green-100 rounded-full px-2 py-0.5">
                    {filteredUserList.length} active
                </span>
            </div>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search by name or job title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-0"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <ul className="space-y-3 mt-10 h-full">
                {filteredUserList.length === 0 && searchTerm ? (
                    <li className="text-center py-8 text-gray-500">
                        <p>No employees found matching "{searchTerm}"</p>
                        <p className="text-sm mt-1">Try searching by first name or job title</p>
                    </li>
                ) : (
                    filteredUserList?.map((emp: TUser, idx: number) => (
                    <li
                        key={idx}
                        className="relative flex items-center mt-3 gap-3 border border-gray-300 rounded-lg min-h-[100px] px-3 py-3.5 hover:shadow-sm "
                    >
                        <img
                            src={emp.profile.profileUrl || 'https://i.pravatar.cc/100?img=1'}
                            alt={emp.profile.firstName || "User"}
                            className="w-10 h-10  rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="font-bold mb-1 text-sm text-gray-700 truncate">{emp.profile?.firstName}</span>
                                <EmployeeCardPopup
                                    name={emp.profile?.firstName ||  "Unknown"}
                                    title={emp.profile?.jobTitle || "No title"}
                                    department={emp.profile?.department ||  "No department"}
                                    email={emp.email || "No email"}
                                    phone={emp.phone || "No phone"}
                                    avatar={emp.profile.profileUrl || `https://i.pravatar.cc/100?img=1`}
                                    role={emp.role || "Employee"}
                                />
                            </div>
                            
                            <p
                                className={`text-xs mb-1 ${emp.shift.length === 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {emp.shift.length === 0 ? 'Available' : 'Busy'} 
                            </p>


                            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600 mt-1">
                                <button onClick={() => handleAssignUser(emp.id as string, idx)} className="text-lg">
                                    <BsStopwatch />
                                </button>
                                {/* <TiEqualsOutline className="text-lg" /> */}
                                <ShiftTemplateDropdown shiftTemplates={emp.shift} />
                                <span className="text-lg font-medium">{emp.shift.length}</span>
                            </div>
                            <p className="text-sm text-[rgba(78,83,177,1)]">Off Day: {emp.payroll?.offDay.map((day: string) => day).join(", ") || "Update Info"}</p>
                        </div>

                        {openIndex === idx && (
                            <div className="absolute -top-50 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[560px]">
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

                                            {/* React Hook Form implementation */}
                                            <form onSubmit={handleSubmit((data) => onSubmit(data, "PUBLISHED"))}>
                                                <div className="space-y-3 mt-12 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <label>Date</label>
                                                        <Controller
                                                            name="date"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                // Date input accepts YYYY-MM-DD format and will be converted to 2025-08-07T08:00:00.000Z format on submission
                                                                    type="date" 
                                                                    {...field}
                                                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                                                />
                                                            )}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <span>All Day</span>
                                                            <Controller
                                                                name="allDay"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={field.value}
                                                                        onChange={field.onChange}
                                                                        className="accent-[rgba(78,83,177,1)] w-4 h-4" 
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 mt-12 mb-6 items-center">
                                                        <label>Start</label>
                                                        <Controller
                                                            name="startTime"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                    type="time"
                                                                    {...field}
                                                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                                                />
                                                            )}
                                                        />
                                                        <label>End</label>
                                                        <Controller
                                                            name="endTime"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <input
                                                                    type="time"
                                                                    {...field}
                                                                    className="border border-gray-300 px-2 py-1 rounded-md"
                                                                />
                                                            )}
                                                        />
                                                        <span className="ml-auto">08:00 Hours</span>
                                                    </div>
                                                    <Controller
                                                        name="shiftTitle"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="text"
                                                                placeholder="Shift Title"
                                                                {...field}
                                                                className="w-full border border-gray-300 rounded-md p-2"
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name="job"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="text"
                                                                placeholder="Job"
                                                                {...field}
                                                                className="w-full border border-gray-300 rounded-md p-2"
                                                            />
                                                        )}
                                                    />
                                
                                                    <Controller
                                                        name="location"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <input
                                                                type="text"
                                                                placeholder="Type location"
                                                                {...field}
                                                                className="w-full border mt-2 border-gray-300 rounded-md p-2"
                                                            />
                                                        )}
                                                    />
                                                    <Controller
                                                        name="note"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <textarea
                                                                placeholder="Type Description"
                                                                {...field}
                                                                rows={3}
                                                                className="w-full border border-gray-300 rounded-md p-2"
                                                            />
                                                        )}
                                                    />
                                                    <div className="text-gray-400 text-sm italic">📎 Attachment</div>
                                                    <div className="flex items-center mt-8 justify-between">
                                                        <p>Shift Tasks <span className="text-gray-400 ml-4">{checkedTasks.length > 0 ? `${checkedTasks.length} tasks selected` : "No tasks created"}</span></p>
                                                        <a href="#" className="text-[rgba(78,83,177,1)] text-sm">View shift tasks</a>
                                                    </div>
                                                    <div className="flex mt-12 gap-2">
                                                        <button
                                                            type="button"
                                                            className="bg-[rgba(78,83,177,1)] text-white px-4 py-2 rounded-lg text-sm"
                                                            onClick={handlePublish}
                                                        >
                                                            Publish
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="border border-indigo-300 px-4 py-2 text-[rgba(78,83,177,1)] rounded-lg min-w-max text-sm"
                                                            onClick={handleSaveDraft}
                                                        >
                                                            Save Draft
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="border border-indigo-300 px-4 text-[rgba(78,83,177,1)]  min-w-max py-2 rounded-lg text-sm"
                                                            onClick={handleSaveTemplate}
                                                        >
                                                            Save as Template
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-red-500 ml-auto text-xl"
                                                            onClick={handleDelete}
                                                        >
                                                            <RiDeleteBin6Line />
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
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
                    ))
                )}
            </ul>
        </aside>
    
    );
};

export default EmployeeAvailability;
