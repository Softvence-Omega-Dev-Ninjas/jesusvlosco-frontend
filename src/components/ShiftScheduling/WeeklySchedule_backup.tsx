// import { useState } from "react";
// import {
//   HiOutlineBell,
//   HiOutlineChevronLeft,
//   HiOutlineChevronRight,
//   HiOutlineChevronUp,
// } from "react-icons/hi";
// import { CiCirclePlus } from "react-icons/ci";
// import { useGetAllShiftsQuery } from "@/store/api/admin/shift-sheduling/CreateShiftApi";
// import { formatTimeFromISO } from "@/utils/formatDateToMDY";
// import { TProject, TProjectUser } from "@/types/projectType";
// import { Tab } from "@headlessui/react";
// import { useForm, Controller } from "react-hook-form";
// import { useCreateShiftMutation } from "@/store/api/admin/shift-sheduling/CreateShiftApi";
// import { useParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import GoogleMapsLocationPicker from "./GoogleMapsLocationPicker";

// // Interfaces for form data
// interface LocationCoordinates {
//   latitude: number;
//   longitude: number;
//   address?: string;
// }

// interface ShiftFormData {
//   currentUserId?: string;
//   currentProjectId?: string;
//   date: string; // Will be "YYYY-MM-DD" format from date input
//   startTime: string; // Will be "HH:MM" format from time input
//   endTime: string; // Will be "HH:MM" format from time input
//   shiftTitle: string;
//   job: string;
//   location: string;
//   locationLng: number;
//   locationLat: number;
//   locationCoordinates?: LocationCoordinates | null;
//   note: string;
//   allDay: boolean;
//   userIds: string[];
//   taskIds: string[];
//   shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
//   saveAsTemplate: boolean;
// }

// interface ShiftAPIData {
//   currentUserId: string;
//   currentProjectId: string;
//   date: string; // "2025-08-07T08:00:00.000Z" format for API
//   shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
//   startTime: string; // "2025-08-07T08:00:00.000Z" format for API
//   endTime: string; // "2025-08-07T16:00:00.000Z" format for API
//   shiftTitle: string;
//   allDay: boolean;
//   job: string;
//   userIds: string[];
//   taskIds: string[];
//   location: string;
//   locationLng: number;
//   locationLat: number;
//   note: string;
//   saveAsTemplate: boolean;
// }

// interface ShiftData {
//   id?: string;
//   allDay: boolean;
//   createdAt: string;
//   date: string; // ISO format: "2025-08-12T08:00:00.000Z"
//   endTime: string; // ISO format: "2025-08-12T16:00:00.000Z"
//   job: string;
//   location: string;
//   note: string;
//   shiftActivity: unknown[];
//   shiftStatus: "PUBLISHED" | "DRAFT" | "TEMPLATE";
//   shiftTask: unknown[];
//   shiftTitle: string;
//   startTime: string; // ISO format: "2025-08-12T08:00:00.000Z"
//   updatedAt: string;
//   users: Array<{
//     createdAt: string;
//     email: string;
//     employeeId: string;
//     id: string;
//     isLogin: boolean;
//     isVerified: boolean;
//     lastLoginAt: string;
//     otpExpiresAt: string | null;
//     password: string;
//     phone: string;
//     pinCode: string;
//     role: string;
//     updatedAt: string;
//     profile: {
//       address: string;
//       city: string;
//       country: string;
//       createdAt: string;
//       department: string;
//       dob: string;
//       firstName: string;
//       gender: string;
//       id: string;
//       jobTitle: string;
//       lastName: string;
//       nationality: string;
//       profileUrl: string;
//       updatedAt: string;
//     };
//   }>;
// }

// const WeeklyScheduleGrid = ({ projectInformation }: { projectInformation: TProject }) => {
//   console.log("Project Information:", projectInformation);
  
//   // State management
//   const [currentDate, setCurrentDate] = useState<Date>(new Date());
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState<string>("");
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  
//   // API hooks
//   const getShifts = useGetAllShiftsQuery({});
//   const [createShift] = useCreateShiftMutation();
//   const { id: projectId } = useParams();
  
//   // Form management with React Hook Form
//   const {
//     control,
//     handleSubmit,
//     setValue,
//     getValues,
//     reset,
//   } = useForm<ShiftFormData>({
//     defaultValues: {
//       currentUserId: "",
//       currentProjectId: projectId || "",
//       date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
//       startTime: "09:00",
//       endTime: "17:00",
//       shiftTitle: "",
//       job: "",
//       location: "",
//       locationLng: 0,
//       locationLat: 0,
//       note: "",
//       allDay: false,
//       userIds: [],
//       taskIds: [],
//       shiftStatus: "PUBLISHED",
//       saveAsTemplate: false,
//     },
//   });

//   const users = projectInformation?.projectUsers || [];
//   const userList = users?.filter((user: TProjectUser) => user.user?.role != "ADMIN") || [];
//   const userIds = userList.map((user: TProjectUser) => user.user?.id).filter(Boolean);
  
//   console.log("User IDs:", userIds);

//   // Utility functions for handling ISO date formats
//   const parseISODate = (isoString: string): Date | null => {
//     try {
//       const date = new Date(isoString);
//       return isNaN(date.getTime()) ? null : date;
//     } catch {
//       return null;
//     }
//   };

//   const isSameDay = (date1: Date, date2: Date): boolean => {
//     // Normalize both dates to local timezone for comparison
//     const normalizeDate = (date: Date) => {
//       const normalized = new Date(date);
//       normalized.setHours(0, 0, 0, 0);
//       return normalized;
//     };

//     const norm1 = normalizeDate(date1);
//     const norm2 = normalizeDate(date2);
    
//     return norm1.getTime() === norm2.getTime();
//   };

//   // Helper function to convert date and time to ISO format
//   const convertToISOFormat = (date: string, time: string): string => {
//     // date is in YYYY-MM-DD format, time is in HH:MM format
//     const [year, month, day] = date.split("-").map(Number);
//     const [hours, minutes] = time.split(":").map(Number);
    
//     // Create date object and convert to ISO string
//     const dateObj = new Date(year, month - 1, day, hours, minutes);
//     return dateObj.toISOString();
//   };

//   // Task management functions
//   const toggleTask = (taskId: string) => {
//     const updatedTasks = checkedTasks.includes(taskId)
//       ? checkedTasks.filter((id) => id !== taskId)
//       : [...checkedTasks, taskId];
//     setCheckedTasks(updatedTasks);
//     setValue("taskIds", updatedTasks);
//   };

//   // Form submission handlers
//   const onSubmit = async (data: ShiftFormData, status: "PUBLISHED" | "DRAFT" | "TEMPLATE") => {
//     try {
//       console.log("Form data before API call:", data);

//       const locationCoordinates = data.locationCoordinates;
      
//       const apiData: ShiftAPIData = {
//         currentUserId: data.userIds[0] || selectedUserId,
//         currentProjectId: projectId || "",
//         date: convertToISOFormat(data.date, data.startTime),
//         shiftStatus: status,
//         startTime: convertToISOFormat(data.date, data.startTime),
//         endTime: convertToISOFormat(data.date, data.endTime),
//         shiftTitle: data.shiftTitle,
//         allDay: data.allDay,
//         job: data.job,
//         userIds: data.userIds.length > 0 ? data.userIds : [selectedUserId],
//         taskIds: data.taskIds,
//         location: locationCoordinates?.address || data.location,
//         locationLng: locationCoordinates?.longitude || data.locationLng,
//         locationLat: locationCoordinates?.latitude || data.locationLat,
//         note: data.note,
//         saveAsTemplate: data.saveAsTemplate,
//       };

//       console.log("API Data being sent:", apiData);

//       const result = await createShift(apiData).unwrap();
//       console.log("Shift created successfully:", result);

//       Swal.fire({
//         title: "Success!",
//         text: `Shift ${status.toLowerCase()} successfully!`,
//         icon: "success",
//         confirmButtonText: "OK",
//       });

//       // Reset form and close modal
//       reset();
//       setCheckedTasks([]);
//       setIsModalOpen(false);
      
//     } catch (error) {
//       console.error("Error creating shift:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to create shift. Please try again.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   const handlePublish = () => {
//     const formData = getValues();
//     onSubmit(formData, "PUBLISHED");
//   };

//   const handleCancel = () => {
//     reset();
//     setCheckedTasks([]);
//     setIsModalOpen(false);
//   };

//   // Updated handleAddShift function to open modal with pre-filled data
//   const handleAddShift = (userId: string, date: Date) => {
//     console.log("Add shift for user:", userId, "on date:", date);
    
//     // Set selected user and date
//     setSelectedUserId(userId);
//     setSelectedDate(date);
    
//     // Format date to YYYY-MM-DD for the form
//     const formattedDate = date.toISOString().split("T")[0];
    
//     // Pre-fill form with selected user and date
//     setValue("userIds", [userId]);
//     setValue("date", formattedDate);
//     setValue("currentUserId", userId);
//     setValue("currentProjectId", projectId || "");
    
//     // Open the modal
//     setIsModalOpen(true);
//   };

//   const getDaysForWeek = (): {
//     day: string;
//     date: string;
//     fullDate: Date;
//   }[] => {
//     const days = [];
//     const startDate = new Date(currentDate);
//     const dayOfWeek = startDate.getDay();
//     const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
//     startDate.setDate(diff);

//     for (let i = 0; i < 7; i++) {
//       const currentDay = new Date(startDate);
//       currentDay.setDate(startDate.getDate() + i);
//       days.push({
//         day: currentDay.toLocaleString("default", { weekday: "short" }),
//         date: formatDate(currentDay),
//         fullDate: new Date(currentDay),
//       });
//     }

//     return days;
//   };

//   const formatDate = (date: Date): string => {
//     return `${date.getMonth() + 1}/${date.getDate()}`;
//   };

//   const formatDateRange = (): string => {
//     const startDate = new Date(currentDate);
//     const dayOfWeek = startDate.getDay();
//     const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
//     startDate.setDate(diff);

//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 6);

//     return `${startDate.toLocaleString("default", {
//       month: "short",
//     })} ${startDate.getDate()} - ${endDate.toLocaleString("default", {
//       month: "short",
//     })} ${endDate.getDate()}`;
//   };

//   const goToPreviousWeek = () => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(newDate.getDate() - 7);
//     setCurrentDate(newDate);
//   };

//   const goToNextWeek = () => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(newDate.getDate() + 7);
//     setCurrentDate(newDate);
//   };

//   const days = getDaysForWeek();

//   // Show loading state
//   if (getShifts.isLoading) {
//     return (
//       <section className="w-full mb-12 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
//         <div className="flex items-center justify-center h-32">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
//             <p className="text-gray-600">Loading shifts...</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Show error state
//   if (getShifts.error) {
//     console.error("Error fetching shifts:", getShifts.error);
//     return (
//       <section className="w-full mb-12 bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm">
//         <div className="text-center text-red-600">
//           <p className="font-semibold">Error loading shifts</p>
//           <p className="text-sm">Please try refreshing the page</p>
//         </div>
//       </section>
//     );
//   }

//   const shifts = getShifts.data?.data || [];

//   return (
//     <section className="w-full mb-12 bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-4">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Weekly Schedule
//           </h3>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={goToPreviousWeek}
//               className="p-1 rounded-md hover:bg-gray-200 transition-colors"
//             >
//               <HiOutlineChevronLeft className="w-5 h-5 text-gray-600" />
//             </button>
//             <span className="text-sm text-gray-600 min-w-max">
//               {formatDateRange()}
//             </span>
//             <button
//               onClick={goToNextWeek}
//               className="p-1 rounded-md hover:bg-gray-200 transition-colors"
//             >
//               <HiOutlineChevronRight className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           <button className="hidden text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50  items-center gap-1">
//             Actions <HiOutlineChevronUp className="w-4 h-4" />
//           </button>
//           <button className="hidden text-sm border border-indigo-300 text-[rgba(78,83,177,1)] px-3 py-1.5 rounded-full hover:bg-indigo-50  items-center gap-1">
//             Add <HiOutlineChevronUp className="w-4 h-4" />
//           </button>
//           <button className="hidden text-sm bg-[rgba(78,83,177,1)] text-white px-4 py-1.5 rounded-full  items-center gap-1 hover:bg-indigo-800">
//             Publish <HiOutlineBell className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       <div className="min-w-max mt-6">
//         {/* Header row with day names */}
//         <div className="grid grid-cols-8 gap-2 text-sm font-medium text-[rgba(78,83,177,1)] mb-2">
//           {/* User column header */}
//           <div className="text-center whitespace-nowrap font-semibold">
//             Employee
//           </div>
//           {/* Day columns */}
//           {days.map((day, i) => (
//             <div key={i} className="text-center whitespace-nowrap">
//               {day.day} {day.date}
//             </div>
//           ))}
//         </div>

//         {/* Multiple rows - one for each user */}
//         <div className="space-y-2">
//           {userList.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500 text-lg">No employees found in this project</p>
//               <p className="text-gray-400 text-sm mt-2">Add employees to the project to see their shifts</p>
//             </div>
//           ) : (
//             userList.map((projectUser: TProjectUser, rowIdx: number) => {
//               const user = projectUser.user;
//               if (!user) return null;
              
//               return (
//                 <div key={rowIdx} className="grid grid-cols-8 gap-2 bg-white rounded-lg p-3 border border-gray-200">
//                   {/* User column */}
//                   <div className="flex flex-col items-center justify-center">
//                     <img
//                       src={
//                         user.profile?.profileUrl ||
//                         `https://i.pravatar.cc/40?img=${rowIdx + 1}`
//                       }
//                       alt={`${user.profile?.firstName || 'User'} ${user.profile?.lastName || ''}`}
//                       className="w-10 h-10 rounded-full object-cover mb-1"
//                     />
//                     <p className="text-xs font-medium text-center text-gray-700">
//                       {user.profile?.firstName || 'N/A'} {user.profile?.lastName || ''}
//                     </p>
//                   </div>

//                   {/* Day columns */}
//                   {days.map((day, colIdx) => {
//                     // Find shifts for this user on this day
//                     const shiftsForUserAndDay = shifts.filter((shift: ShiftData) => {
//                       if (!shift.users || shift.users.length === 0) return false;
                      
//                       const shiftDate = parseISODate(shift.date);
//                       if (!shiftDate) return false;
                      
//                       // Check if current user is assigned to this shift
//                       const isUserAssigned = shift.users.some(shiftUser => shiftUser.id === user.id);
                      
//                       // Check if shift date matches current day
//                       const isDateMatch = isSameDay(shiftDate, day.fullDate);
                      
//                       return isUserAssigned && isDateMatch;
//                     });

//                     // Get only the last shift if multiple shifts exist for this user on this day
//                     const lastShift =
//                       shiftsForUserAndDay.length > 0
//                         ? shiftsForUserAndDay[shiftsForUserAndDay.length - 1]
//                         : null;
//                     return (
//                       <div key={`${rowIdx}-${colIdx}`} className="space-y-2">
//                         {lastShift ? (
//                           <div
//                             className={`min-h-[100px] lg:w-40 lg:h-32.5 rounded-md p-2 transition-all relative flex flex-col justify-center items-center gap-2 ${
//                               lastShift.shiftStatus === "PUBLISHED"
//                                 ? "bg-indigo-200 border border-[rgba(78,83,177,1)]"
//                                 : "bg-white border-2 border-indigo-400"
//                             }`}
//                           >
//                             <p className="text-xs mt-2 px-1 font-medium text-indigo-800 mb-2 text-center">
//                               {formatTimeFromISO(lastShift.startTime)} -{" "}
//                               {formatTimeFromISO(lastShift.endTime)}
//                             </p>

//                             <p className="text-sm text-center font-semibold text-purple-800">
//                               {lastShift.shiftTitle}
//                             </p>

//                             <p className="text-xs text-center text-gray-600">
//                               {lastShift.location}
//                             </p>
//                           </div>
//                         ) : (
//                           /* Empty cell with consistent styling */
//                           <div className="min-h-[100px] lg:w-40 lg:h-32.5 rounded-md p-2 border border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
//                             <CiCirclePlus onClick={() => handleAddShift(user.id, day.fullDate)} className="text-2xl text-gray-400 hover:text-gray-600" />
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Shift Scheduling Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-800">Schedule Shift</h2>
//               <button
//                 onClick={handleCancel}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 &times;
//               </button>
//             </div>

//             <Tab.Group className="p-1">
//               <Tab.List className="flex space-x-4 mb-4">
//                 {["Shift Details", "Shift Tasks", "Shift Activity"].map((tab, tabIdx) => (
//                   <Tab
//                     key={tabIdx}
//                     className={({ selected }) =>
//                       `px-3 py-1.5 text-sm font-medium border-b-2 ${
//                         selected
//                           ? "border-[rgba(78,83,177,1)] text-[rgba(78,83,177,1)]"
//                           : "border-transparent text-gray-500"
//                       }`
//                     }
//                   >
//                     {tab}
//                   </Tab>
//                 ))}
//               </Tab.List>

//               <Tab.Panels>
//                 {/* Shift Details Panel */}
//                 <Tab.Panel>
//                   <form onSubmit={handleSubmit((data) => onSubmit(data, "PUBLISHED"))}>
//                     <div className="space-y-4 text-sm">
//                       {/* Date and All Day Toggle */}
//                       <div className="flex items-center justify-between">
//                         <label className="font-medium">Date</label>
//                         <Controller
//                           name="date"
//                           control={control}
//                           render={({ field }) => (
//                             <input
//                               type="date"
//                               {...field}
//                               className="border border-gray-300 px-3 py-2 rounded-md"
//                             />
//                           )}
//                         />
//                         <div className="flex items-center gap-2">
//                           <span>All Day</span>
//                           <Controller
//                             name="allDay"
//                             control={control}
//                             render={({ field }) => (
//                               <input
//                                 type="checkbox"
//                                 checked={field.value}
//                                 onChange={field.onChange}
//                                 className="accent-[rgba(78,83,177,1)] w-4 h-4"
//                               />
//                             )}
//                           />
//                         </div>
//                       </div>

//                       {/* Start and End Time */}
//                       <div className="flex gap-4 items-center">
//                         <label className="font-medium">Start</label>
//                         <Controller
//                           name="startTime"
//                           control={control}
//                           render={({ field }) => (
//                             <input
//                               type="time"
//                               {...field}
//                               className="border border-gray-300 px-3 py-2 rounded-md"
//                             />
//                           )}
//                         />
//                         <label className="font-medium">End</label>
//                         <Controller
//                           name="endTime"
//                           control={control}
//                           render={({ field }) => (
//                             <input
//                               type="time"
//                               {...field}
//                               className="border border-gray-300 px-3 py-2 rounded-md"
//                             />
//                           )}
//                         />
//                         <span className="ml-auto text-gray-600">08:00 Hours</span>
//                       </div>

//                       {/* Shift Title */}
//                       <Controller
//                         name="shiftTitle"
//                         control={control}
//                         render={({ field }) => (
//                           <input
//                             type="text"
//                             placeholder="Shift Title"
//                             {...field}
//                             className="w-full border border-gray-300 rounded-md p-3"
//                           />
//                         )}
//                       />

//                       {/* Job */}
//                       <Controller
//                         name="job"
//                         control={control}
//                         render={({ field }) => (
//                           <input
//                             type="text"
//                             placeholder="Job"
//                             {...field}
//                             className="w-full border border-gray-300 rounded-md p-3"
//                           />
//                         )}
//                       />

//                       {/* Location Picker */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Location
//                         </label>
//                         <Controller
//                           name="locationCoordinates"
//                           control={control}
//                           render={({ field }) => (
//                             <GoogleMapsLocationPicker
//                               value={field.value}
//                               onChange={field.onChange}
//                               placeholder="Click to select location on map"
//                               className="w-full"
//                               apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
//                             />
//                           )}
//                         />
//                       </div>

//                       {/* Notes */}
//                       <Controller
//                         name="note"
//                         control={control}
//                         render={({ field }) => (
//                           <textarea
//                             placeholder="Type Description"
//                             {...field}
//                             rows={3}
//                             className="w-full border border-gray-300 rounded-md p-3"
//                           />
//                         )}
//                       />

//                       {/* Action Buttons */}
//                       <div className="flex gap-3 pt-4">
//                         <button
//                           type="button"
//                           className="bg-[rgba(78,83,177,1)] text-white px-6 py-2 rounded-lg text-sm hover:bg-indigo-800"
//                           onClick={handlePublish}
//                         >
//                           Publish
//                         </button>
//                         <button
//                           type="button"
//                           className="text-red-500 border border-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-red-50"
//                           onClick={handleCancel}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </Tab.Panel>

//                 {/* Shift Tasks Panel */}
//                 <Tab.Panel>
//                   <div className="text-sm mt-6 space-y-3">
//                     <h3 className="font-medium text-gray-800 mb-4">Select Tasks for this Shift</h3>
//                     {projectInformation?.tasks?.map((task, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
//                         <label className="flex items-center gap-3">
//                           <input
//                             type="checkbox"
//                             checked={checkedTasks.includes(task.id)}
//                             onChange={() => toggleTask(task.id)}
//                             className="accent-green-600"
//                           />
//                           <img
//                             src={task.attachment || `https://i.pravatar.cc/30?img=${index + 1}`}
//                             className="w-8 h-8 rounded-full object-cover"
//                             alt="Task"
//                           />
//                           <div>
//                             <p className="font-medium">{task.taskTitle}</p>
//                             <p className="text-gray-500 text-xs">{task.description}</p>
//                           </div>
//                         </label>
//                       </div>
//                     )) || (
//                       <p className="text-gray-500 text-center py-6">No tasks available for this project</p>
//                     )}
//                   </div>
//                 </Tab.Panel>

//                 {/* Shift Activity Panel */}
//                 <Tab.Panel>
//                   <div className="text-sm mt-6">
//                     <h3 className="font-medium text-gray-800 mb-4">Recent Activity</h3>
//                     <p className="text-gray-500 text-center py-6">No activity to display</p>
//                   </div>
//                 </Tab.Panel>
//               </Tab.Panels>
//             </Tab.Group>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default WeeklyScheduleGrid;
