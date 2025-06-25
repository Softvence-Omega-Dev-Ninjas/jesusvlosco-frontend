import React, { useState } from 'react';

// Define the interfaces for common use cases
interface Branch {
  id: string;
  location: string;
  manager: string; // Storing manager name for now
}

interface ManagerOption {
  id: string;
  name: string;
  role: string;
  photo: string; // Added photo field for manager's profile picture
}

// Dummy Manager Data with Placeholder Images
const allManagers: ManagerOption[] = [
  { id: 'm1', name: 'Jane Cooper', role: 'Project Manager', photo: 'https://placehold.co/40x40/FF7F50/FFFFFF?text=JC' },
  { id: 'm2', name: 'Robert Fox', role: 'Construction Site Manager', photo: 'https://placehold.co/40x40/6A5ACD/FFFFFF?text=RF' },
  { id: 'm3', name: 'Esther Howard', role: 'Coordinator', photo: 'https://placehold.co/40x40/3CB371/FFFFFF?text=EH' },
  { id: 'm4', name: 'Desirae Botosh', role: 'Superintendent', photo: 'https://placehold.co/40x40/FFD700/000000?text=DB' },
  { id: 'm5', name: 'Marley Stanton', role: 'Project Manager', photo: 'https://placehold.co/40x40/87CEEB/FFFFFF?text=MS' },
  { id: 'm6', name: 'Brandon Vaccaro', role: 'Operations Manager', photo: 'https://placehold.co/40x40/DA70D6/FFFFFF?text=BV' },
  { id: 'm7', name: 'Erin Press', role: 'Estimating Manager', photo: 'https://placehold.co/40x40/F08080/FFFFFF?text=EP' },
  { id: 'm8', name: 'Makenna Dorwart', role: 'Structural Engineer', photo: 'https://placehold.co/40x40/20B2AA/FFFFFF?text=MD' },
  { id: 'm9', name: 'Ann Gouse', role: 'Mechanical Engineer', photo: 'https://placehold.co/40x40/DDA0DD/FFFFFF?text=AG' },
  { id: 'm10', name: 'Emery Westervelt', role: 'Site Engineer', photo: 'https://placehold.co/40x40/BDB76B/FFFFFF?text=EW' },
];

// --- CompanyDetailsPage Component ---
const CompanyDetailsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [branches, setBranches] = useState<Branch[]>([
    { id: 'branch-1', location: 'New York City', manager: '' },
    { id: 'branch-2', location: 'New York City', manager: '' },
    { id: 'branch-3', location: 'New York City', manager: '' },
    { id: 'branch-4', location: 'New York City', manager: '' }, // Added Branch 4
  ]);

  // State to manage visibility and search for each manager dropdown
  const [activeManagerDropdown, setActiveManagerDropdown] = useState<string | null>(null);
  const [managerSearchTerm, setManagerSearchTerm] = useState<{ [key: string]: string }>({});

  const handleAddBranch = () => {
    setBranches([...branches, { id: `branch-${Date.now()}`, location: '', manager: '' }]);
  };

  const handleDeleteBranch = (id: string) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const handleBranchChange = (id: string, field: 'location' | 'manager', value: string) => {
    setBranches(branches.map(branch =>
      branch.id === id ? { ...branch, [field]: value } : branch
    ));
    // If the field is manager, and dropdown is open, update search term
    if (field === 'manager' && activeManagerDropdown === id) {
        setManagerSearchTerm(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleManagerSelect = (branchId: string, managerName: string) => {
    handleBranchChange(branchId, 'manager', managerName);
    setActiveManagerDropdown(null); // Close dropdown on selection
    setManagerSearchTerm(prev => ({ ...prev, [branchId]: managerName })); // Update search term to selected name
  };

  const filteredManagers = (branchId: string) => {
    const searchTerm = managerSearchTerm[branchId] || '';
    return allManagers.filter(manager =>
      manager.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", { companyName, location, branches });
    alert("Changes Saved! (Check console for data)");
  };

  return (
    <div className="container mx-auto mb-8">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Company Details</h2>

      {/* Company Name */}
      <div className="mb-6">
        <label htmlFor="companyName" className="block text-gray-700 text-base font-semibold mb-2">Company Name</label>
        <input
          type="text"
          id="companyName"
          placeholder="Type Here"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="mb-6">
        <label htmlFor="location" className="block text-gray-700 text-base font-semibold mb-2">Location</label>
        <div className="relative">
          <input
            type="text"
            id="location"
            placeholder="Type Here"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <svg className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>

      {/* Branch Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-gray-700 text-base font-semibold">Branch</label>
          <button
            onClick={handleAddBranch}
            className="flex items-center text-primary  font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Branch
          </button>
        </div>

        <div className='border border-gray-200'>
          {branches.map((branch) => (
            <div key={branch.id} className="flex flex-col sm:flex-row items-center gap-4 mb-4 p-4 bg-gray-50">
              {/* Branch Location */}
              <div className="relative w-full sm:w-1/2 flex-grow"> {/* Added flex-grow */}
                <label htmlFor={`branch-location-${branch.id}`} className="block text-gray-700 text-sm font-semibold mb-1">Branch Name</label>
                <input
                  type="text"
                  id={`branch-location-${branch.id}`}
                  placeholder="New York City"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  value={branch.location}
                  onChange={(e) => handleBranchChange(branch.id, 'location', e.target.value)}
                />
                <svg className="h-5 w-5 text-gray-400 absolute right-3 bottom-6 translate-y-1/2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>

              {/* Manager Custom Dropdown */}
              <div className="relative w-full sm:w-1/2 flex-grow"> {/* Added flex-grow */}
                <div className="flex items-center">
                  <label htmlFor={`manager-${branch.id}`} className="block text-gray-700 text-sm font-semibold mr-2 whitespace-nowrap">Manager</label>
                  <input
                    type="text"
                    id={`manager-${branch.id}`}
                    placeholder="Type Here"
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    value={activeManagerDropdown === branch.id ? (managerSearchTerm[branch.id] || '') : branch.manager}
                    onChange={(e) => {
                        handleBranchChange(branch.id, 'manager', e.target.value);
                        setManagerSearchTerm(prev => ({ ...prev, [branch.id]: e.target.value }));
                    }}
                    onFocus={() => setActiveManagerDropdown(branch.id)}
                    onBlur={() => setTimeout(() => setActiveManagerDropdown(null), 200)}
                  />
                  <svg className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>

                {activeManagerDropdown === branch.id && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredManagers(branch.id).length > 0 ? (
                      filteredManagers(branch.id).map((manager) => (
                        <div
                          key={manager.id}
                          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => handleManagerSelect(branch.id, manager.name)}
                        >
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
                            checked={branch.manager === manager.name}
                            readOnly
                          />
                          {/* Profile Image */}
                          <img
                            src={manager.photo}
                            alt={manager.name}
                            className="h-8 w-8 rounded-full mr-3 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/40x40/cccccc/000000?text=${manager.name.charAt(0).toUpperCase()}`;
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{manager.name}</span>
                            <span className="text-sm text-gray-500">{manager.role}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No managers found.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Delete Branch Button */}
              <button onClick={() => handleDeleteBranch(branch.id)} className="p-2 text-red-500 hover:text-red-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveChanges}
          className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 ease-in-out"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
