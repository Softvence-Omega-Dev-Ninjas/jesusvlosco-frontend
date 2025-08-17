import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react"; // Using Search from lucide-react for consistency
import { IoFilterOutline } from "react-icons/io5";

// Import user images
import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";
import user4 from "../assets/user4.png";
import user5 from "../assets/user5.png";
import user6 from "../assets/user6.png";

// Import components
import ActionDropdown from "@/components/Admin/ActionDropdown";
import UsersTable from "@/components/Admin/UsersTable";
import FilterColumnModal from "@/components/Admin/FilterColumnModal";
import { Link } from "react-router-dom";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import Pagination from "@/utils/Pagination";

// --- START: New definitions for Filter Options ---

export interface FilterOption {
  label: string;
  checked: boolean;
}

// Define the array of filter options
// export const filterOptions: FilterOption[] = [
//   { label: "ID", checked: true },
//   { label: "User", checked: true },
//   { label: "Email", checked: true },
//   { label: "Phone No", checked: true },
//   { label: "Department", checked: true },
//   { label: "Last Login", checked: true },
//   // Add more filter options here as needed
// ];

// Define the type for a User (exported for use in other components)
export interface User {
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
    id: "21390",
    avatar: user2,
    name: "Leslie Alexander",
    email: "kenzi.lawson@example.com",
    phone: "(907) 555-0101",
    department: "Medical",
    lastLogin: "4/4/18",
  },
  {
    id: "21391",
    avatar: user3,
    name: "Kristin Watson",
    email: "georgia.young@example.com",
    phone: "(316) 555-0116",
    department: "Trainer",
    lastLogin: "7/18/17",
  },
  {
    id: "21392",
    avatar: user4,
    name: "Robert Fox",
    email: "sara.cruz@example.com",
    phone: "(219) 555-0114",
    department: "Medical",
    lastLogin: "6/21/19",
  },
  {
    id: "21393",
    avatar: user5,
    name: "Jacob Jones",
    email: "nathan.roberts@example.com",
    phone: "(201) 555-0124",
    department: "Medical",
    lastLogin: "1/28/17",
  },
  {
    id: "21394",
    avatar: user6,
    name: "Theresa Webb",
    email: "deanna.curtis@example.com",
    phone: "(406) 555-0120",
    department: "Sales",
    lastLogin: "8/21/15",
  },
  {
    id: "21395",
    avatar: user1,
    name: "Guy Hawkins",
    email: "bill.sanders@example.com",
    phone: "(629) 555-0122",
    department: "Marketing",
    lastLogin: "8/30/14",
  },
  {
    id: "21396",
    avatar: user2,
    name: "Kathryn Murphy",
    email: "debra.holt@example.com",
    phone: "(270) 555-0117",
    department: "Marketing",
    lastLogin: "8/15/17",
  },
  {
    id: "21397",
    avatar: user3,
    name: "Devon Lane",
    email: "michelle.rivera@example.com",
    phone: "(704) 555-0127",
    department: "Medical",
    lastLogin: "5/7/16",
  },
  {
    id: "21398",
    avatar: user4,
    name: "Esther Howard",
    email: "tanya.hill@example.com",
    phone: "(307) 555-0133",
    department: "Sales",
    lastLogin: "1/31/14",
  },
  {
    id: "21399",
    avatar: user5,
    name: "Arlene McCoy",
    email: "willie.jennings@example.com",
    phone: "(229) 555-0109",
    department: "Design",
    lastLogin: "9/4/12",
  },
  {
    id: "213100",
    avatar: user6,
    name: "Dianne Russell",
    email: "jessica.hanson@example.com",
    phone: "(205) 555-0100",
    department: "Medical",
    lastLogin: "6/19/14",
  },
  {
    id: "213101",
    avatar: user1,
    name: "Marvin McKinney",
    email: "debbie.baker@example.com",
    phone: "(217) 555-0113",
    department: "Medical",
    lastLogin: "5/30/14",
  },
  {
    id: "213102",
    avatar: user2,
    name: "Savannah Nguyen",
    email: "tim.jennings@example.com",
    phone: "(405) 555-0128",
    department: "Medical",
    lastLogin: "11/7/16",
  },
  {
    id: "213103",
    avatar: user3,
    name: "Wade Warren",
    email: "curtis.weaver@example.com",
    phone: "(239) 555-0108",
    department: "Sales",
    lastLogin: "3/4/16",
  },
];

const Admin: React.FC = () => {
  const [users] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, isLoading, isFetching } = useGetAllUserQuery({
    role: "ADMIN",
    page: currentPage,
    limit,
    searchTerm,
  });
  const allUsers = data?.data;
  console.log({ allUsers, isLoading });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetch new data here from API using `page`
  };
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // State for column filter modal
  const [showFilterColumnModal, setShowFilterColumnModal] =
    useState<boolean>(false);
  const [filterModalPosition, setFilterModalPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  // State for action dropdown modal
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);
  const [, setActionDropdownPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const filterColumnButtonRef = useRef<HTMLButtonElement>(null); // Ref for the button that opens the filter modal
  const actionDropdownButtonRef = useRef<HTMLButtonElement>(null); // Ref for the button that opens the action dropdown
  const filterColumnModalRef = useRef<HTMLDivElement>(null); // Ref for the filter modal itself
  const actionDropdownRef = useRef<HTMLDivElement>(null); // Ref for the action dropdown itself

  // --- Close modals when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close Filter Column Modal
      if (
        filterColumnModalRef.current &&
        !filterColumnModalRef.current.contains(event.target as Node) &&
        filterColumnButtonRef.current &&
        !filterColumnButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterColumnModal(false);
        setFilterModalPosition(null);
      }

      // Close Action Dropdown
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(event.target as Node) &&
        actionDropdownButtonRef.current &&
        !actionDropdownButtonRef.current.contains(event.target as Node)
      ) {
        setShowActionDropdown(false);
        setActionDropdownPosition(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFilterColumnModal = () => {
    const newState = !showFilterColumnModal;
    setShowFilterColumnModal(newState);
    setShowActionDropdown(false); // Close other dropdown if open

    if (newState && filterColumnButtonRef.current && mainContainerRef.current) {
      const buttonRect = filterColumnButtonRef.current.getBoundingClientRect();
      const containerRect = mainContainerRef.current.getBoundingClientRect();

      setFilterModalPosition({
        top: buttonRect.bottom - containerRect.top + 10, // 10px below the button
        right: containerRect.right - buttonRect.right, // Align right edge of modal with right edge of button
      });
    } else {
      setFilterModalPosition(null);
    }
  };

  const toggleActionDropdown = () => {
    const newState = !showActionDropdown;
    setShowActionDropdown(newState);
    setShowFilterColumnModal(false); // Close other dropdown if open
    setFilterModalPosition(null);

    if (
      newState &&
      actionDropdownButtonRef.current &&
      mainContainerRef.current
    ) {
      const buttonRect =
        actionDropdownButtonRef.current.getBoundingClientRect();
      const containerRect = mainContainerRef.current.getBoundingClientRect();

      setActionDropdownPosition({
        top: buttonRect.bottom - containerRect.top + 10, // 10px below the button
        right: containerRect.right - buttonRect.right, // Align right edge of dropdown with right edge of button
      });
    } else {
      setActionDropdownPosition(null);
    }
  };

  // --- Search filter logic ---
  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerSearch) ||
      user.department.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch)
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
      const allFilteredUserIds = filteredUsers.map((user) => user.id);
      setSelectedUserIds(allFilteredUserIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleUserCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => {
    if (event.target.checked) {
      setSelectedUserIds((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedUserIds((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    }
  };

  const isAnyModalOpen = showFilterColumnModal || showActionDropdown;
  console.log({ data });
  return (
    <div
      ref={mainContainerRef}
      className="min-h-screen px-2 font-sans antialiased relative"
    >
      {/* Header Section */}
      <header className="flex items-center justify-between p-4 mb-3">
        <div>
          <h1 className="text-[24px] font-bold text-[#4E53B1]">Admins list</h1>
          <p className="text-xl text-gray-400">
            All Admins Information In One Place
          </p>
        </div>
        <Link
          to={"/admin/add-user?role=ADMIN"}
          className="flex items-center px-4 py-2 bg-[#4E53B1] text-white rounded-lg shadow  focus:outline-none  focus:ring-offset-2 cursor-pointer"
        >
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
          Add User
        </Link>
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
            <Search className="w-5 h-5 text-gray-400" />
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

          {/* Action Dropdown Component */}
          <ActionDropdown
            showActionDropdown={showActionDropdown}
            toggleActionDropdown={toggleActionDropdown}
            actionDropdownRef={actionDropdownRef}
            actionDropdownButtonRef={actionDropdownButtonRef}
          />
        </div>
      </div>

      {/* Users Table Component */}
      <UsersTable
        users={allUsers}
        isLoading={isLoading}
        isFetching={isFetching}
        selectedUserIds={selectedUserIds}
        handleHeaderCheckboxChange={handleHeaderCheckboxChange}
        handleUserCheckboxChange={handleUserCheckboxChange}
        isAnyModalOpen={isAnyModalOpen}
        toggleFilterColumnModal={toggleFilterColumnModal}
        filterColumnButtonRef={filterColumnButtonRef}
      />

      {!isLoading && allUsers?.length !== 0 && (
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={data?.metadata?.totalPage}
        />
      )}

      {/* Filter Column Modal Component */}
      <FilterColumnModal
        showFilterColumnModal={showFilterColumnModal}
        filterModalPosition={filterModalPosition}
        filterColumnModalRef={filterColumnModalRef}
      />
    </div>
  );
};

export default Admin;
