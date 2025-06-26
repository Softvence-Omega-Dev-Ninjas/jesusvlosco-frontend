import  { useState } from 'react';

// Main App component
const EmployeeManagement = () => {
  // State for form inputs (optional for this design, but good practice)
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  // Sample employee data for the table
  const employees = [
    { id: '21389', avatar: 'https://placehold.co/40x40/FFD700/000000?text=CF', name: 'Cody Fisher', email: 'nevaeh.simmons@example.com', phone: '(303) 555-0105', lastLogin: '2/11/12' },
    { id: '21389', avatar: 'https://placehold.co/40x40/ADD8E6/000000?text=LA', name: 'Leslie Alexander', email: 'kenzi.lawson@example.com', phone: '(907) 555-0101', lastLogin: '4/4/18' },
    { id: '21389', avatar: 'https://placehold.co/40x40/90EE90/000000?text=KW', name: 'Kristin Watson', email: 'georgia.young@example.com', phone: '(316) 555-0116', lastLogin: '7/18/17' },
    { id: '21389', avatar: 'https://placehold.co/40x40/FFC0CB/000000?text=RF', name: 'Robert Fox', email: 'sara.cruz@example.com', phone: '(219) 555-0114', lastLogin: '6/21/19' },
    { id: '21389', avatar: 'https://placehold.co/40x40/DDA0DD/000000?text=JJ', name: 'Jacob Jones', email: 'nathan.roberts@example.com', phone: '(206) 555-0120', lastLogin: '1/28/17' },
    { id: '21389', avatar: 'https://placehold.co/40x40/FFB6C1/000000?text=TW', name: 'Theresa Webb', email: 'deanna.curtis@example.com', phone: '(406) 555-0120', lastLogin: '8/21/15' },
    { id: '21389', avatar: 'https://placehold.co/40x40/FFA07A/000000?text=GH', name: 'Guy Hawkins', email: 'bill.sanders@example.com', phone: '(629) 555-0129', lastLogin: '8/30/14' },
    { id: '21389', avatar: 'https://placehold.co/40x40/ADD8E6/000000?text=KM', name: 'Kathryn Murphy', email: 'debra.holt@example.com', phone: '(270) 555-0117', lastLogin: '8/15/17' },
    { id: '21389', avatar: 'https://placehold.co/40x40/90EE90/000000?text=DL', name: 'Devon Lane', email: 'michelle.rivera@example.com', phone: '(704) 555-0127', lastLogin: '5/7/16' },
    { id: '21389', avatar: 'https://placehold.co/40x40/FFC0CB/000000?text=EH', name: 'Esther Howard', email: 'tanya.hill@example.com', phone: '(307) 555-0133', lastLogin: '1/31/14' },
    { id: '21389', avatar: 'https://placehold.co/40x40/DDA0DD/000000?text=AM', name: 'Arlene McCoy', email: 'willie.jennings@example.com', phone: '(229) 555-0109', lastLogin: '9/4/12' },
    { id: '21389', avatar: 'https://placehold.co/40x40/FFB6C1/000000?text=DR', name: 'Dianne Russell', email: 'jessica.hanson@example.com', phone: '(205) 555-0100', lastLogin: '6/19/14' },
    { id: '21389', avatar: 'https://placehold.co/40x40/FFA07A/000000?text=MM', name: 'Marvin McKinney', email: 'debbie.baker@example.com', phone: '(217) 555-0113', lastLogin: '5/30/14' },
    { id: '21389', avatar: 'https://placehold.co/40x40/ADD8E6/000000?text=SN', name: 'Savannah Nguyen', email: 'tim.jennings@example.com', phone: '(405) 555-0128', lastLogin: '11/7/16' },
    { id: '21389', avatar: 'https://placehold.co/40x40/90EE90/000000?text=WW', name: 'Wade Warren', email: 'curtis.weaver@example.com', phone: '(239) 555-0108', lastLogin: '3/4/16' },
  ];

  return (
    <div className="min-h-screen   font-inter">
      {/* Header */}
      <header className="flex justify-center py-6">
        <h1 className="text-2xl font-semibold text-gray-800">Employee Management</h1>
      </header>

      <main className="  ">
        {/* Employee Information Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name Input */}
            <div>
              <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <select
                  id="employeeName"
                  name="employeeName"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {/* Dropdown arrow icon */}
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Employee ID Input */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type Here"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Login Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Number Input */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="000-xxx-xxxx"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            {/* E-mail Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type Here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Employee Table Section */}
        <section className="mt-8 overflow-x-auto">
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {/* <img className="h-10 w-10 rounded-full" src={employee.avatar} alt="" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/CCCCCC/000000?text=User'; }} /> */}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="px-4 py-2 rounded-md bg-pink-100 text-pink-600 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-150 ease-in-out">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeManagement;
