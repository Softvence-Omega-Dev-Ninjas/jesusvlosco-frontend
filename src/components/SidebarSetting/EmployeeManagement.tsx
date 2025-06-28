import  { useState } from 'react';

import user1 from "../../assets/user1.png"
import user2 from "../../assets/user2.png"
import user3 from "../../assets/user3.png"
import user4 from "../../assets/user4.png"
import user5 from "../../assets/user5.png"
import user6 from "../../assets/user6.png"

// Main App component
const EmployeeManagement = () => {
  // State for form inputs (optional for this design, but good practice)
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');

  // Sample employee data for the table
  const employees = [
    { id: '21389', avatar: user1, name: 'Cody Fisher', email: 'nevaeh.simmons@example.com', phone: '(303) 555-0105', lastLogin: '2/11/12' },
    { id: '21389', avatar: user2, name: 'Leslie Alexander', email: 'kenzi.lawson@example.com', phone: '(907) 555-0101', lastLogin: '4/4/18' },
    { id: '21389', avatar: user3, name: 'Kristin Watson', email: 'georgia.young@example.com', phone: '(316) 555-0116', lastLogin: '7/18/17' },
    { id: '21389', avatar: user4, name: 'Robert Fox', email: 'sara.cruz@example.com', phone: '(219) 555-0114', lastLogin: '6/21/19' },
    { id: '21389', avatar: user5, name: 'Jacob Jones', email: 'nathan.roberts@example.com', phone: '(206) 555-0120', lastLogin: '1/28/17' },
    { id: '21389', avatar: user6, name: 'Theresa Webb', email: 'deanna.curtis@example.com', phone: '(406) 555-0120', lastLogin: '8/21/15' },
    { id: '21389', avatar: user1, name: 'Guy Hawkins', email: 'bill.sanders@example.com', phone: '(629) 555-0129', lastLogin: '8/30/14' },
    { id: '21389', avatar: user2, name: 'Kathryn Murphy', email: 'debra.holt@example.com', phone: '(270) 555-0117', lastLogin: '8/15/17' },
    { id: '21389', avatar: user3, name: 'Devon Lane', email: 'michelle.rivera@example.com', phone: '(704) 555-0127', lastLogin: '5/7/16' },
    { id: '21389', avatar: user4, name: 'Esther Howard', email: 'tanya.hill@example.com', phone: '(307) 555-0133', lastLogin: '1/31/14' },
    { id: '21389', avatar: user5, name: 'Arlene McCoy', email: 'willie.jennings@example.com', phone: '(229) 555-0109', lastLogin: '9/4/12' },
    { id: '21389', avatar: user6, name: 'Dianne Russell', email: 'jessica.hanson@example.com', phone: '(205) 555-0100', lastLogin: '6/19/14' },
    { id: '21389', avatar: user1, name: 'Marvin McKinney', email: 'debbie.baker@example.com', phone: '(217) 555-0113', lastLogin: '5/30/14' },
    { id: '21389', avatar: user2, name: 'Savannah Nguyen', email: 'tim.jennings@example.com', phone: '(405) 555-0128', lastLogin: '11/7/16' },
    { id: '21389', avatar: user3, name: 'Wade Warren', email: 'curtis.weaver@example.com', phone: '(239) 555-0108', lastLogin: '3/4/16' },
  ];

  return (
    <div className="min-h-screen   font-inter">
      {/* Header */}
      <header className="flex justify-center py-6">
        <h1 className="text-2xl font-semibold text-primary">Employee Management</h1>
      </header>

      <main className="  ">
        {/* Employee Information Section */}
        <section className=" max-w-3xl mx-auto mb-8">
          <div className=" gap-6 mb-6">
            {/* Name Input */}
            <div className='mb-6'>
              <label htmlFor="employeeName" className="block text-sm font-medium text-primary mb-1">Name</label>
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
                
              </div>
            </div>

            {/* Employee ID Input */}
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-primary mb-1">Employee ID</label>
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
          <div className="  mb-10">
            {/* Contact Number Input */}
            <div className='mb-6'>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-primary mb-1">Contact Number</label>
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
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none  focus:border-indigo-500 sm:text-sm"
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
                    <input type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded" />
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
                      <input type="checkbox" className=" h-4 w-4 text-primary border-gray-300 rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img src={employee.avatar} alt="" />
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
                      <button className="px-4 py-2 rounded-md bg-pink-100 text-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-150 ease-in-out">
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
