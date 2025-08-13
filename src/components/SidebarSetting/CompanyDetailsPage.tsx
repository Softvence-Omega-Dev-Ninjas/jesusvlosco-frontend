import { useGetCompanyQuery, useUpdateCompanyMutation } from '@/store/api/admin/settings/getCompanyApi';
import { useGetUserDataQuery } from '@/store/api/admin/settings/getUser';
import React, { useEffect, useState } from 'react';

interface ManagerOption {
  id: string;
  name: string;
  role: string;
  photo: string;
}

interface Branch {
  id: string;
  location: string;
  manager: ManagerOption | null;
}

const CompanyDetailsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [branches, setBranches] = useState<Branch[]>([]);

  const [activeManagerDropdown, setActiveManagerDropdown] = useState<string | null>(null);
  const [managerSearchTerm, setManagerSearchTerm] = useState<{ [key: string]: string }>({});

  const { data } = useGetCompanyQuery(undefined);
  console.log(data)
  const { data: allUser } = useGetUserDataQuery(undefined);
  const [updateCompany] = useUpdateCompanyMutation();
  console.log(updateCompany)


  // Prepare manager list from allUser API
  const allManagers: ManagerOption[] = Array.isArray(allUser?.data)
    ? allUser.data.map((user: any) => ({
        id: user.id,
        name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
        role: user.jobTitle || '',
        photo:
          user.profileUrl ||
          `https://placehold.co/40x40/cccccc/000000?text=${(user.profile?.firstName?.charAt(0) || 'U').toUpperCase()}`
      }))
    : [];

  // Load company data into state
  useEffect(() => {
    if (data?.data) {
      setCompanyName(data.data.name || '');
      setLocation(data.data.location || '');

      if (Array.isArray(data.data.branches)) {
        setBranches(
          data.data.branches.map((branch: any) => ({
            id: branch.id,
            location: branch.location,
            manager: branch.manager
              ? {
                  id: branch.manager.id,
                  name: `${branch.manager.profile?.firstName || ''} ${branch.manager.profile?.lastName || ''}`.trim(),
                  role: branch.manager.jobTitle || '',
                  photo:
                    branch.manager.profileUrl ||
                    `https://placehold.co/40x40/cccccc/000000?text=${(branch.manager.profile?.firstName?.charAt(0) || 'U').toUpperCase()}`
                }
              : null
          }))
        );
      }
    }
  }, [data]);

  const handleAddBranch = () => {
    setBranches([...branches, { id: `branch-${Date.now()}`, location: '', manager: null }]);
  };

  const handleDeleteBranch = (id: string) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const handleBranchChange = (id: string, field: 'location' | 'manager', value: any) => {
    setBranches(branches.map(branch =>
      branch.id === id ? { ...branch, [field]: value } : branch
    ));
    if (field === 'manager' && activeManagerDropdown === id) {
      setManagerSearchTerm(prev => ({
        ...prev,
        [id]: typeof value === 'string' ? value : value.name
      }));
    }
  };

  const handleManagerSelect = (branchId: string, manager: ManagerOption) => {
    handleBranchChange(branchId, 'manager', manager);
    setActiveManagerDropdown(null);
    setManagerSearchTerm(prev => ({ ...prev, [branchId]: manager.name }));
  };

const filteredManagers = (branchId: string) => {
  const searchTerm = managerSearchTerm[branchId] || '';
  const branch = branches.find(b => b.id === branchId);

  // Check if branch is from API or new
  const isNewBranch = branch && branch.id.startsWith("branch-");

  if (isNewBranch) {
    // NEW branch → show ALL managers
    return allManagers.filter(m =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } else {
    // EXISTING branch → show only the saved manager
    if (branch?.manager) {
      return allManagers
        .filter(m => m.id === branch.manager?.id)
        .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return [];
  }
};


 const handleSaveChanges = async () => {
  const payload = {
    name: companyName, // match your backend key
    location,
    branches: branches.map(branch => ({
      id: branch.id.startsWith("branch-") ? undefined : branch.id, // avoid sending random IDs for new branches
      location: branch.location,
      managerId: branch.manager?.id || null
    }))
  };

  try {
    const response = await updateCompany({
      companyId: data?.data?.id, // pass actual companyId
      body: payload
    }).unwrap();

    console.log("Update response:", response);
    alert("Changes saved successfully!");
  } catch (error) {
    console.error("Error updating company:", error);
    alert("Failed to save changes!");
  }
};


  return (
    <div className="max-w-4xl mx-auto  mb-8">
      <h2 className="text-xl  mb-6 text-primary">Company Details</h2>

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
          <svg className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>

      {/* Branch Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-gray-700 text-base font-semibold">Branch</label>
          <button onClick={handleAddBranch} className="flex items-center text-primary font-semibold text-sm">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Branch
          </button>
        </div>

        <div className='border rounded-lg border-gray-200 p-4'>
          {branches.map((branch) => (
            <div key={branch.id} className="flex flex-col sm:flex-row items-center gap-4 mb-4 bg-gray-50">
              
              {/* Branch Location */}
              <div className="relative w-full sm:w-1/2 flex-grow">
                <label className="block text-gray-700 text-sm font-semibold mb-1">Branch Name</label>
                <input
                  type="text"
                  placeholder="New York City"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  value={branch.location}
                  onChange={(e) => handleBranchChange(branch.id, 'location', e.target.value)}
                />
              </div>

              {/* Manager Dropdown */}
              <div className="relative w-full sm:w-1/2 flex-grow">
                <div className="flex items-center">
                  <label className="block text-gray-700 text-sm font-semibold mr-2 whitespace-nowrap">Manager</label>
                  <input
                    type="text"
                    placeholder="Type Here"
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    value={activeManagerDropdown === branch.id ? (managerSearchTerm[branch.id] || '') : branch.manager?.name || ''}
                    onChange={(e) => {
                      setManagerSearchTerm(prev => ({ ...prev, [branch.id]: e.target.value }));
                      setActiveManagerDropdown(branch.id);
                    }}
                    onFocus={() => setActiveManagerDropdown(branch.id)}
                    onBlur={() => setTimeout(() => setActiveManagerDropdown(null), 200)}
                  />
                  <svg className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          onMouseDown={() => handleManagerSelect(branch.id, manager)}
                        >
                          <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded mr-2"
                            checked={branch.manager?.id === manager.id}
                            readOnly
                          />
                          <img src={manager.photo} alt={manager.name} className="h-8 w-8 rounded-full mr-3 object-cover" />
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

              {/* Delete Button */}
              <button onClick={() => handleDeleteBranch(branch.id)} className="p-2 text-red-500 hover:text-red-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button onClick={handleSaveChanges} className="bg-primary text-white py-3 px-6 rounded-lg shadow-md transition duration-200">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
