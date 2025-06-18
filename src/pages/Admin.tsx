// Import statements
import { Columns3 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { IoFilterOutline } from "react-icons/io5";

import user1 from "../assets/user1.png";
import user2 from "../assets/user2.png";
import user3 from "../assets/user3.png";
import user4 from "../assets/user4.png";
import user5 from "../assets/user5.png";
import user6 from "../assets/user6.png";

// User interface and initial data
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
  { id: "21389", avatar: user1, name: "Cody Fisher", email: "nevaeh.simmons@example.com", phone: "(303) 555-0105", department: "Design", lastLogin: "2/11/12" },
  { id: "21390", avatar: user2, name: "Leslie Alexander", email: "kenzi.lawson@example.com", phone: "(907) 555-0101", department: "Medical", lastLogin: "4/4/18" },
  { id: "21391", avatar: user3, name: "Kristin Watson", email: "georgia.young@example.com", phone: "(316) 555-0116", department: "Trainer", lastLogin: "7/18/17" },
  { id: "21392", avatar: user4, name: "Robert Fox", email: "sara.cruz@example.com", phone: "(219) 555-0114", department: "Medical", lastLogin: "6/21/19" },
  { id: "21393", avatar: user5, name: "Jacob Jones", email: "nathan.roberts@example.com", phone: "(201) 555-0124", department: "Medical", lastLogin: "1/28/17" },
  { id: "21394", avatar: user6, name: "Theresa Webb", email: "deanna.curtis@example.com", phone: "(406) 555-0120", department: "Sales", lastLogin: "8/21/15" },
  { id: "21395", avatar: user1, name: "Guy Hawkins", email: "bill.sanders@example.com", phone: "(629) 555-0122", department: "Marketing", lastLogin: "8/30/14" },
  { id: "21396", avatar: user2, name: "Kathryn Murphy", email: "debra.holt@example.com", phone: "(270) 555-0117", department: "Marketing", lastLogin: "8/15/17" },
  { id: "21397", avatar: user3, name: "Devon Lane", email: "michelle.rivera@example.com", phone: "(704) 555-0127", department: "Medical", lastLogin: "5/7/16" },
  { id: "21398", avatar: user4, name: "Esther Howard", email: "tanya.hill@example.com", phone: "(307) 555-0133", department: "Sales", lastLogin: "1/31/14" },
  { id: "21399", avatar: user5, name: "Arlene McCoy", email: "willie.jennings@example.com", phone: "(229) 555-0109", department: "Design", lastLogin: "9/4/12" },
  { id: "213100", avatar: user6, name: "Dianne Russell", email: "jessica.hanson@example.com", phone: "(205) 555-0100", department: "Medical", lastLogin: "6/19/14" },
  { id: "213101", avatar: user1, name: "Marvin McKinney", email: "debbie.baker@example.com", phone: "(217) 555-0113", department: "Medical", lastLogin: "5/30/14" },
  { id: "213102", avatar: user2, name: "Savannah Nguyen", email: "tim.jennings@example.com", phone: "(405) 555-0128", department: "Medical", lastLogin: "11/7/16" },
  { id: "213103", avatar: user3, name: "Wade Warren", email: "curtis.weaver@example.com", phone: "(239) 555-0108", department: "Sales", lastLogin: "3/4/16" },
];

// Main component
const Admin: React.FC = () => {
  const [users] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [showViewModal, setShowFilterModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState<boolean>(false);
  const [viewModalTopPosition, setFilterModalTopPosition] = useState<number | null>(null);

  const filterModalRef = useRef<HTMLDivElement>(null);
  const actionModalRef = useRef<HTMLDivElement>(null);
  const tableFilterButtonRef = useRef<HTMLButtonElement>(null);
  const threeDotsButtonRef = useRef<HTMLButtonElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target as Node) &&
        tableFilterButtonRef.current &&
        !tableFilterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilterModal(false);
        setFilterModalTopPosition(null);
      }
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

  useEffect(() => {
    setIsAnyModalOpen(showViewModal || showActionModal);
  }, [showViewModal, showActionModal]);

  const toggleFilterModal = () => {
    const newState = !showViewModal;
    setShowFilterModal(newState);
    if (newState && tableFilterButtonRef.current && mainContainerRef.current) {
      const buttonRect = tableFilterButtonRef.current.getBoundingClientRect();
      const containerRect = mainContainerRef.current.getBoundingClientRect();
      setFilterModalTopPosition(buttonRect.bottom - containerRect.top + 10);
    } else {
      setFilterModalTopPosition(null);
    }
    if (showActionModal) setShowActionModal(false);
  };

  const toggleActionModal = () => {
    setShowActionModal(!showActionModal);
    if (showViewModal) {
      setShowFilterModal(false);
      setFilterModalTopPosition(null);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    [user.name, user.department, user.email].some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleHeaderCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allFilteredUserIds = filteredUsers.map((user) => user.id);
      setSelectedUserIds(allFilteredUserIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleUserCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, userId: string) => {
    setSelectedUserIds((prev) =>
      event.target.checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const isHeaderCheckboxChecked =
    filteredUsers.length > 0 &&
    selectedUserIds.length === filteredUsers.length &&
    filteredUsers.every((user) => selectedUserIds.includes(user.id));

  const isHeaderCheckboxIndeterminate =
    selectedUserIds.length > 0 &&
    selectedUserIds.length < filteredUsers.length &&
    filteredUsers.some((user) => selectedUserIds.includes(user.id));

  const filterOptions = [
    { label: "Name", checked: true },
    { label: "Employee ID", checked: false },
    { label: "Email", checked: true },
    { label: "Department", checked: false },
  ];

  return (
    <div ref={mainContainerRef} className="relative w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Users</h1>
        <div className="flex items-center gap-2">
          <button ref={threeDotsButtonRef} onClick={toggleActionModal}>
            <Columns3 />
          </button>
          <button ref={tableFilterButtonRef} onClick={toggleFilterModal}>
            <IoFilterOutline />
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="mt-4 mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3">
              <input
                type="checkbox"
                checked={isHeaderCheckboxChecked}
                ref={(input) => {
                  if (input) input.indeterminate = isHeaderCheckboxIndeterminate;
                }}
                onChange={handleHeaderCheckboxChange}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
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
                  checked={selectedUserIds.includes(user.id)}
                  onChange={(e) => handleUserCheckboxChange(e, user.id)}
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
                        (e.target as HTMLImageElement).src = `https://placehold.co/40x40/cccccc/000000?text=${user.name.charAt(0).toUpperCase()}`;
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
