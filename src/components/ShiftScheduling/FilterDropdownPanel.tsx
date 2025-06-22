

// import { FC, useState } from "react";
// import { HiOutlineFilter, HiOutlinePlus } from "react-icons/hi";
// import AssignedFilterDropdown from "./AssignedFilterDropdown";
// import PublishedFilterDropdown from "./PublishdFilterDropdown";
// import StatusFilterDropdown from "./StatusFilterDropdown";
// import GroupFilterDropdown from "./GroupFilterDropdown";
// import WidthDropdown from "./WidthShift";
// import AvailableDropdown from "./AvailableDropdown";

// // The FilterDropdownPanel Component
// const FilterDropdownPanel: FC = () => {
//       return (
//             <div className="w-full bg-white border border-indigo-200 shadow-md rounded-xl p-4 space-y-6 mt-3">
//                   {/* Filter Shifts */}
//                   <div className="flex flex-wrap items-center gap-2">
//                         <span className="min-w-[100px] text-sm text-gray-600 font-medium">Filter Shifts</span>

//                         {/* <select className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white focus:outline-none">
//                               <option>Assigned/Unassigned</option>
//                         </select> */}

//                         <AssignedFilterDropdown />


//                         {/* <select className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white focus:outline-none">
//                               <option>Published/Draft</option>
//                         </select> */}
//                         <PublishedFilterDropdown/>

//                         {/* <select className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white focus:outline-none">
//                               <option>Status</option>
//                         </select> */}

//                         <StatusFilterDropdown />


//                         <button className="ml-auto text-indigo-700 border border-indigo-300 rounded-full p-1.5 hover:bg-indigo-50">
//                               <HiOutlinePlus className="w-4 h-4" />
//                         </button>
//                   </div>

//                   {/* Filter Users */}
//                   <div className="flex flex-wrap items-center gap-2">
//                         <span className="min-w-[100px] text-sm text-gray-600 font-medium">Filter Users</span>

//                         {/* <select className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white focus:outline-none">
//                               <option>Group</option>
//                         </select> */}
//                         <GroupFilterDropdown/>

//                         {/* <select className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white focus:outline-none">
//                               <option>With Shifts</option>
//                         </select> */}

//                         <WidthDropdown/>

//                         {/* <select className="text-sm border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full bg-white focus:outline-none">
//                               <option>Available Users</option>
//                         </select> */}
//                         <AvailableDropdown/>

//                         <button className="ml-auto text-indigo-700 border border-indigo-300 rounded-full p-1.5 hover:bg-indigo-50">
//                               <HiOutlinePlus className="w-4 h-4" />
//                         </button>
//                   </div>
//             </div>
//       );
// };

// // Wrapper with toggle button
// const FilterToggleWrapper: FC = () => {
//       const [showFilterPanel, setShowFilterPanel] = useState(false);

//       return (
//             <div className="w-full">
//                   {/* Filter Button */}
//                   <button
//                         onClick={() => setShowFilterPanel(prev => !prev)}
//                         className="flex items-center justify-center border border-indigo-300 text-indigo-700 px-2 py-1.5 rounded-full hover:bg-indigo-50"
//                   >
//                         <HiOutlineFilter className="w-4 h-4" />
//                   </button>

//                   {/* Conditionally show panel */}
//                   {showFilterPanel && <FilterDropdownPanel />}
//             </div>
//       );
// };

// export default FilterToggleWrapper;



import { FC, useState } from "react";
import { HiOutlineFilter, HiOutlinePlus } from "react-icons/hi";
import AssignedFilterDropdown from "./AssignedFilterDropdown";
import PublishedFilterDropdown from "./PublishdFilterDropdown";
import StatusFilterDropdown from "./StatusFilterDropdown";
import GroupFilterDropdown from "./GroupFilterDropdown";
import WidthDropdown from "./WidthShift";
import AvailableDropdown from "./AvailableDropdown";

const FilterDropdownPanel: FC = () => {
      return (
            <div className="w-full bg-white border border-indigo-200 shadow-md rounded-xl p-4 space-y-6 mt-3">
                  {/* Filter Shifts */}
                  <div className="flex flex-wrap items-center gap-2">
                        <span className="min-w-[100px] text-sm text-gray-600 font-medium">
                              Filter Shifts
                        </span>

                        <AssignedFilterDropdown />
                        <PublishedFilterDropdown />
                        <StatusFilterDropdown />

                        <div className="ml-auto">
                              <button className="text-indigo-700 border border-indigo-300 rounded-full p-1.5 hover:bg-indigo-50">
                                    <HiOutlinePlus className="w-4 h-4" />
                              </button>
                        </div>
                  </div>

                  {/* Filter Users */}
                  <div className="flex flex-wrap items-center gap-2">
                        <span className="min-w-[100px] text-sm text-gray-600 font-medium">
                              Filter Users
                        </span>

                        <GroupFilterDropdown />
                        <WidthDropdown />
                        <AvailableDropdown />

                        <div className="ml-auto">
                              <button className="text-indigo-700 border border-indigo-300 rounded-full p-1.5 hover:bg-indigo-50">
                                    <HiOutlinePlus className="w-4 h-4" />
                              </button>
                        </div>
                  </div>
            </div>
      );
};

const FilterToggleWrapper: FC = () => {
      const [showFilterPanel, setShowFilterPanel] = useState(false);

      return (
            <div className="w-full">
                  {/* Filter Toggle Button */}
                  <div className="flex justify-start mt-3 lg:justify-between mb-3">
                        <button
                              onClick={() => setShowFilterPanel(prev => !prev)}
                              className="flex items-center justify-center border border-indigo-300 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-50 text-sm"
                        >
                              <HiOutlineFilter className="w-4 h-4 mr-1" />
                            
                        </button>
                  </div>

                  {/* Filter Panel */}
                  {showFilterPanel && (
                        <div className="transition-all duration-200 ease-in-out">
                              <FilterDropdownPanel />
                        </div>
                  )}
            </div>
      );
};

export default FilterToggleWrapper;

