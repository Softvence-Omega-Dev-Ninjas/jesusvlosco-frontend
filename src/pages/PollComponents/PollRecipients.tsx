import React, { useState, ChangeEvent } from 'react';

// Define the type for a User object
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  lastLogin: string;
  avatar: string;
}

// Sample data for the table
const users: User[] = [
  {
    id: '21389-1', // Made IDs unique for better React key management and selection
    name: 'Cody Fisher',
    email: 'nevaeh.simmons@example.com',
    phone: '(303) 555-0105',
    department: 'Design',
    lastLogin: '2/11/12',
    avatar: 'https://placehold.co/40x40/FFD700/000?text=CF',
  },
  {
    id: '21389-2',
    name: 'Leslie Alexander',
    email: 'kenzi.lawson@example.com',
    phone: '(907) 555-0104',
    department: 'Medical',
    lastLogin: '4/4/18',
    avatar: 'https://placehold.co/40x40/FFA07A/000?text=LA',
  },
  {
    id: '21389-3',
    name: 'Kristin Watson',
    email: 'georgia.young@example.com',
    phone: '(316) 555-0116',
    department: 'Trainer',
    lastLogin: '7/18/17',
    avatar: 'https://placehold.co/40x40/ADD8E6/000?text=KW',
  },
  {
    id: '21389-4',
    name: 'Robert Fox',
    email: 'sara.cruz@example.com',
    phone: '(219) 555-0114',
    department: 'Medical',
    lastLogin: '6/21/19',
    avatar: 'https://placehold.co/40x40/90EE90/000?text=RF',
  },
  {
    id: '21389-5',
    name: 'Jacob Jones',
    email: 'nathan.roberts@example.com',
    phone: '(201) 555-0124',
    department: 'Medical',
    lastLogin: '1/28/17',
    avatar: 'https://placehold.co/40x40/FFB6C1/000?text=JJ',
  },
  {
    id: '21389-6',
    name: 'Theresa Webb',
    email: 'deanna.curtis@example.com',
    phone: '(406) 555-0120',
    department: 'Sales',
    lastLogin: '8/21/15',
    avatar: 'https://placehold.co/40x40/F0E68C/000?text=TW',
  },
  {
    id: '21389-7',
    name: 'Guy Hawkins',
    email: 'bill.sanders@example.com',
    phone: '(629) 555-0129',
    department: 'Marketing',
    lastLogin: '8/30/14',
    avatar: 'https://placehold.co/40x40/DDA0DD/000?text=GH',
  },
  {
    id: '21389-8',
    name: 'Kathryn Murphy',
    email: 'debra.holt@example.com',
    phone: '(270) 555-0117',
    department: 'Marketing',
    lastLogin: '8/15/17',
    avatar: 'https://placehold.co/40x40/B0C4DE/000?text=KM',
  },
  {
    id: '21389-9',
    name: 'Devon Lane',
    email: 'michelle.rivera@example.com',
    phone: '(704) 555-0127',
    department: 'Medical',
    lastLogin: '5/7/16',
    avatar: 'https://placehold.co/40x40/E0FFFF/000?text=DL',
  },
  {
    id: '21389-10',
    name: 'Esther Howard',
    email: 'tanya.hill@example.com',
    phone: '(307) 555-0133',
    department: 'Sales',
    lastLogin: '1/31/14',
    avatar: 'https://placehold.co/40x40/F5DEB3/000?text=EH',
  },
];

const PollRecipients = () => {
  const [selectedUsers, setSelectedUsers] = useState<Record<string, boolean>>({});

  const isAllSelected = users.every((user) => selectedUsers[user.id]);

  const handleCheckboxChange = (id: string): void => {
    setSelectedUsers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAllChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const checked = e.target.checked;
    const newSelected: Record<string, boolean> = {};
    if (checked) {
      users.forEach((user) => {
        newSelected[user.id] = true;
      });
    }
    setSelectedUsers(newSelected);
  };

  return (
    // Removed 'bg-gray-100' from this outer div
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans w-full overflow-x-auto">
      {/* Main container - Removed 'bg-white' */}
      <div className="rounded-xl  sm:p-8 lg:p-10 w-full max-w-full overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Select user from the list</h2>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full sm:w-auto flex-grow">
            <input
              type="text"
              placeholder="Search names, roles, department..."
              className="w-1/3 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <button className="flex-shrink-0 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filter
          </button>
        </div>

        {/* Table Section - Configured for horizontal and vertical scrolling on small/medium screens */}
       <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
  <div className="min-w-[768px]">
    <table className="w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 rounded"
              checked={isAllSelected}
              onChange={handleSelectAllChange}
            />
          </th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">ID</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap flex items-center">
            Last login
            <svg className="ml-1 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user: User) => (
          <tr key={user.id}>
            <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                checked={selectedUsers[user.id] || false}
                onChange={() => handleCheckboxChange(user.id)}
              />
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{user.id}</td>
            <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/40x40/cccccc/000000?text=NA';
                    }}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{user.email}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{user.phone}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{user.department}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{user.lastLogin}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Navigation Buttons section removed */}
      </div>
    </div>
  );
};

export default PollRecipients;
