import profile from "../../assets/Ellipse 295.png"
import distance from "../../assets/distance.png"
import calendar from "../../assets/calendar_month (1).png"


import { BiEditAlt } from "react-icons/bi";
import {  useRef, useState } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";

const UserPageProfile = () => {
  const [readOnly, setReadOnly] = useState(true);
   const user = useAppSelector(selectUser);
  console.log(user)
  const dobInputRef = useRef<HTMLInputElement>(null);

  const [selectedDate, setSelectedDate] = useState("1998-07-25");

  // Form state variables
  const [formData, setFormData] = useState({
    firstName: "Leslie",
    lastName: "Alexander", 
    gender: "Female",
    email: user?.email || "email",
    phoneNumber: "+123 456 789",
    address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    state: "Los Angelos",
    country: "America",
    pinCode: "1203",
    nationality: "American"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    const allFormData = {
      ...formData,
      dateOfBirth: selectedDate
    };
    
    console.log("Form Data:", allFormData);
    
    // Set back to readonly after saving
    setReadOnly(true);
  };

  const handleDobIconClick = () => {
    if (!readOnly) {
      dobInputRef.current?.showPicker();
    }
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };
  return (
    <>
    <div className=" mx-auto p-6 min-h-screen mt-4">

          <div className="flex items-center justify-between pb-4 mb-4">
          <h1 className="text-2xl font-semibold text-primary">My Profile</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between space-x-6 mb-8">
         <div className="flex   items-center gap-6">
             <img
            src={profile}
            alt="User Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leslie Alexander</h2>
            <p className="text-gray-600">Senior Software Engineer</p>
          </div>
         </div>
          <button onClick={() => setReadOnly(false)} className="  bg-primary flex gap-2 items-center text-white py-2 px-4 rounded-lg transition-colors cursor-pointer">
            <BiEditAlt size={24} />
            Edit
          </button>
        </div>


      {/* Section Title */}
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Personal Information</h3>
        <hr className="border-b-2 border-primary mb-6" />
      </div>

      {/* Form Grid */}
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm mb-1 text-[#484848]">First name</label>
          <input 
            readOnly={readOnly} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Last name</label>
          <input 
            readOnly={readOnly} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Gender</label>
          <input 
            readOnly={readOnly} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
          />
        </div>
  {/* ...other fields... */}
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Email ID</label>
          <input 
            readOnly={true} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={user?.email}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Phone Number</label>
          <input 
            readOnly={readOnly} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          />
        </div>
        <div className="">
          <label className="block text-sm mb-1 text-[#484848]">Address</label>
          <input
            readOnly={readOnly}
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">State</label>
          <input 
            readOnly={readOnly} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Country</label>
          <div className="flex justify-between w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2">
                      <input 
                        readOnly={readOnly} 
                        className="" 
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      />
                      <img src={distance} alt="" />

          </div>
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Pin Code</label>
          <input 
            readOnly={readOnly} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={formData.pinCode}
            onChange={(e) => handleInputChange('pinCode', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Nationality</label>
          <input 
            readOnly={readOnly} 
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" 
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Date of Birth</label>
          <div className="relative w-full">
            <input
              type="text"
              value={selectedDate}
              readOnly
              className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2 pr-10"
            />
            <img
              src={calendar}
              alt="calendar icon"
              onClick={handleDobIconClick}
              className={`w-6 h-6 absolute right-3 top-2.5 ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            />
            <input
              ref={dobInputRef}
              type="date"
              value={selectedDate}
              onChange={handleDobChange}
              disabled={readOnly}
              className="absolute inset-0 left-16 md:left-[275px] md:right-0 opacity-0 cursor-pointer"
              style={{ pointerEvents: readOnly ? "none" : "auto" }}
            />
          </div>
        </div>
      </form>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSaveSettings}
          className="bg-primary text-white px-5 py-2 rounded-lg cursor-pointer"
        >
          Save Settings
        </button>
      </div>
    </div>
    </>
  );
};

export default UserPageProfile;
