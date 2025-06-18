import { Columns3 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { IoFilterOutline } from "react-icons/io5";

import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";
import user4 from "../assets/user4.png";
import user5 from "../assets/user5.png";
import user6 from "../assets/user6.png";

// Define the type for a User
interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  lastLogin: string;
}

const initialUsers: User[] = [
  {
    id: "21389",
    avatar: user1,
    name: "Cody Fisher",
    email: "nevaeh.simmons@example.com",
    phone: "(303) 555-0105",
    department: "Design",
    lastLogin: "2/11/12",
  },
  {
    id: "21389",
    avatar: user2,
    name: "Leslie Alexander",
    email: "kenzi.lawson@example.com",
    phone: "(907) 555-0101",
    department: "Medical",
    lastLogin: "4/4/18",
  },
  {
    id: "21389",
    avatar: user3,
    name: "Kristin Watson",
    email: "georgia.young@example.com",
    phone: "(316) 555-0116",
    department: "Trainer",
    lastLogin: "7/18/17",
  },
  {
    id: "21389",
    avatar: user4,
    name: "Robert Fox",
    email: "sara.cruz@example.com",
    phone: "(219) 555-0114",
    department: "Medical",
    lastLogin: "6/21/19",
  },
  {
    id: "21389",
    avatar: user5,
    name: "Jacob Jones",
    email: "nathan.roberts@example.com",
    phone: "(201) 555-0124",
    department: "Medical",
    lastLogin: "1/28/17",
  },
  {
    id: "21389",
    avatar: user6,
    name: "Theresa Webb",
    email: "deanna.curtis@example.com",
    phone: "(406) 555-0120",
    department: "Sales",
    lastLogin: "8/21/15",
  },
  {
    id: "21389",
    avatar: user1,
    name: "Guy Hawkins",
    email: "bill.sanders@example.com",
    phone: "(629) 555-0122",
    department: "Marketing",
    lastLogin: "8/30/14",
  },
  {
    id: "21389",
    avatar: user2,
    name: "Kathryn Murphy",
    email: "debra.holt@example.com",
    phone: "(270) 555-0117",
    department: "Marketing",
    lastLogin: "8/15/17",
  },
  {
    id: "21389",
    avatar: user3,
    name: "Devon Lane",
    email: "michelle.rivera@example.com",
    phone: "(704) 555-0127",
    department: "Medical",
    lastLogin: "5/7/16",
  },
  {
    id: "21389",
    avatar: user4,
    name: "Esther Howard",
    email: "tanya.hill@example.com",
    phone: "(307) 555-0133",
    department: "Sales",
    lastLogin: "1/31/14",
  },
  {
    id: "21389",
    avatar: user5,
    name: "Arlene McCoy",
    email: "willie.jennings@example.com",
    phone: "(229) 555-0109",
    department: "Design",
    lastLogin: "9/4/12",
  },
  {
    id: "21389",
    avatar: user6,
    name: "Dianne Russell",
    email: "jessica.hanson@example.com",
    phone: "(205) 555-0100",
    department: "Medical",
    lastLogin: "6/19/14",
  },
  {
    id: "21389",
    avatar: user1,
    name: "Marvin McKinney",
    email: "debbie.baker@example.com",
    phone: "(217) 555-0113",
    department: "Medical",
    lastLogin: "5/30/14",
  },
  {
    id: "21389",
    avatar: user2,
    name: "Savannah Nguyen",
    email: "tim.jennings@example.com",
    phone: "(405) 555-0128",
    department: "Medical",
    lastLogin: "11/7/16",
  },
  {
    id: "21389",
    avatar: user3,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(239) 555-0108",
    department: "Sales",
    lastLogin: "3/4/16",
  },
];

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [searchTerm, setSearchTerm] = useState<string>(""); // ✅ search term state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); // New state for selected user IDs
  const [showViewModal, setShowFilterModal] = useState<boolean>(false);

  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState<boolean>(false);
  const [filterModalTopPosition, setFilterModalTopPosition] = useState<
    number | null
  >(null);

  const filterModalRef = useRef<HTMLDivElement>(null);
  const actionModalRef = useRef<HTMLDivElement>(null);
  const tableFilterButtonRef = useRef<HTMLButtonElement>(null);
  const threeDotsButtonRef = useRef<HTMLButtonElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null); 

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
     
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target as Node) &&
        tableFilterButtonRef.current &&
        !tableFilterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterModal(false);
        setFilterModalTopPosition(null); // Clear position when closing
      }
      // Close action modal
      if (
        actionModalRef.current &&
        !actionModalRef.current.contains(event.target as Node) &&
        threeDotsButtonRef.current &&
        !threeDotsButtonRef.current.contains(event.target as Node)
      ) {
        setShowActionModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Effect to update isAnyModalOpen whenever modal states change
  useEffect(() => {
    setIsAnyModalOpen(showFilterModal || showActionModal);
  }, [showFilterModal, showActionModal]);

  const toggleFilterModal = () => {
    const newState = !showFilterModal;
    setShowFilterModal(newState);
    if (newState && tableFilterButtonRef.current && mainContainerRef.current) {
      const buttonRect = tableFilterButtonRef.current.getBoundingClientRect();
      const containerRect = mainContainerRef.current.getBoundingClientRect();
      // Calculate top position relative to the main container's top
      setFilterModalTopPosition(buttonRect.bottom - containerRect.top + 10); // +10 for margin
    } else {
      setFilterModalTopPosition(null);
    }
    // Close other modal if open
    if (showActionModal) setShowActionModal(false);
  };

  const toggleActionModal = () => {
    setShowActionModal(!showActionModal);
    // Close other modal if open
    if (showFilterModal) {
      setShowFilterModal(false);
      setFilterModalTopPosition(null); // Clear position when closing
    }
  };



  // --- Search filter logic ---
  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerSearch) ||
      user.department.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch) // can be used as "role" or similar
    );
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // --- Checkbox selection logic ---

  const handleHeaderCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      // If header checkbox is checked, select all users
      const allUserIds = users.map((user) => user.id);
      setSelectedUserIds(allUserIds);
    } else {
      // If header checkbox is unchecked, deselect all users
      setSelectedUserIds([]);
    }
  };

  const handleUserCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => {
    if (event.target.checked) {
      // If user checkbox is checked, add user ID to selectedUserIds
      setSelectedUserIds((prevSelected) => [...prevSelected, userId]);
    } else {
      // If user checkbox is unchecked, remove user ID from selectedUserIds
      setSelectedUserIds((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };

  const isHeaderCheckboxChecked =
    selectedUserIds.length > 0 && selectedUserIds.length === users.length;
  const isHeaderCheckboxIndeterminate =
    selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  // --- End Checkbox selection logic ---


  const filterOptions = [
    { label: "Name", checked: true },
    { label: "Employee ID", checked: false },
    { label: "Email", checked: true },
    { label: "Group/ Team", checked: false },
    { label: "Mobile number", checked: true },
    { label: "Gender", checked: false },
    { label: "User type", checked: false },
    { label: "Department", checked: true },
    { label: "Last login", checked: false },
    { label: "Roles", checked: false },
    { label: "Employment start date", checked: false },
  ];

  const actionOptions = [
    {
      label: "Update user details",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          ></path>
        </svg>
      ),
    },
    {
      label: "Create team chat",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2M5 20h2a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm12-7l-4 4m0 0l-4-4m4 4V7"
          ></path>
        </svg>
      ),
    },
    {
      label: "Send chat message",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.702 9.702 0 0112 4c4.97 0 9 3.582 9 8z"
          ></path>
        </svg>
      ),
    },
    {
      label: "Send text message",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586L6 15.414V12H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v2z"
          ></path>
        </svg>
      ),
    },
    {
      label: "Create task",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 12h.01"
          ></path>
        </svg>
      ),
    },
    {
      label: "Delete",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={mainContainerRef}
      className="min-h-screen px-2 font-sans antialiased relative"
    >
      {/* Header Section */}
      <header className="flex items-center justify-between p-4  mb-3">
        <div>
          <h1 className="text-[24px] font-bold text-[#4E53B1]">Users list</h1>
          <p className="text-xl text-gray-400">
            All Employee Information In One Place
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#4E53B1] text-white rounded-lg shadow  focus:outline-none  focus:ring-offset-2 cursor-pointer">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add Admin
        </button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
       
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search names, roles, department..."
            value={searchTerm}
        onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <button className="flex cursor-pointer items-center px-6 py-2 bg-[#4E53B1] text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-[#3f44a0] transition">
            All Categories
          </button>

          <button className="flex items-center cursor-pointer gap-2 px-6 py-2 text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none">
            <IoFilterOutline className="text-xl" />
            Filter
          </button>

          <div className="relative">
            <button
              ref={threeDotsButtonRef}
              className="flex items-center px-2 py-2 cursor-pointer bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={toggleActionModal}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>

            {/* Dropdown Modal */}
            {showActionModal && (
              <div
                ref={actionModalRef}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200"
              >
                <div className="px-1 py-1">
                  {actionOptions.map((option) => (
                    <button
                      key={option.label}
                      className="flex items-center w-full gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => {
                        /* Add your click handler here */
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div
        className={`bg-white rounded-lg shadow overflow-hidden transition-opacity duration-300 ${
          isAnyModalOpen ? "opacity-50" : "opacity-100"
        }`}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded-sm"
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative rounded-tr-lg"
              >
                {" "}
                {/* Added relative positioning */}
                <button
                  ref={tableFilterButtonRef} // Assign ref to the new button
                  className="ml-2 flex items-center justify-center p-1 rounded-md hover:bg-gray-100 focus:outline-none cursor-pointer"
                  onClick={toggleFilterModal} // Click handler to show modal
                >
                  <Columns3 className="h-5 w-5" />
                  {/* Replaced with a more appropriate icon from a library or custom SVG for accuracy */}
                  {/* Using a generic SVG for a "columns and dropdown" like icon */}
                  <svg
                    className="w-5 h-5 ml-1 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">

                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.avatar}
                        alt={`Avatar of ${user.name}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (
                            e.target as HTMLImageElement
                          ).src = `https://placehold.co/40x40/cccccc/000000?text=${user.name
                            .charAt(0)
                            .toUpperCase()}`;
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter Modal - now a direct child of the main container, right-aligned */}
      {showFilterModal && filterModalTopPosition !== null && (
        <div
          ref={filterModalRef}
          className="absolute bg-white w-72 rounded-lg shadow-lg py-2 z-20 border border-gray-200 opacity-100 right-2"
          style={{ top: filterModalTopPosition }}
        >
          <div className="px-4 py-2">
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search members"
                className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto pr-2">
              {filterOptions.map((option) => (
                <label
                  key={option.label}
                  className="flex items-center text-sm text-gray-700 py-1"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded-sm mr-2"
                    defaultChecked={option.checked}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin ;
