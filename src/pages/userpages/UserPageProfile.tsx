import profile from "../../assets/Ellipse 295.png"
import distance from "../../assets/distance.png"
import calendar from "../../assets/calendar_month (1).png"


import { BiEditAlt } from "react-icons/bi";
import {  useRef, useState } from "react";

const UserPageProfile = () => {

   const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  const [selectedDate1, setSelectedDate1] = useState("1998-07-25");
  const [selectedDate2, setSelectedDate2] = useState("1998-07-25");

  const handleIconClick1 = () => inputRef1.current?.showPicker();
  const handleIconClick2 = () => inputRef2.current?.showPicker();

  const handleDateChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate1(e.target.value);
  };

  const handleDateChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate2(e.target.value);
  };
  return (
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
          <button className="  bg-primary flex gap-2 items-center text-white py-2 px-4 rounded-lg transition-colors cursor-pointer">
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
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="Leslie" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Last name</label>
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="Alexander" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Gender</label>
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="Female" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Date of Birth</label>
  <div className="relative w-full">
          <input
            type="text"
            value={selectedDate1}
            readOnly
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2 pr-10"
          />
          <img
            src={calendar}
            alt="calendar icon"
            onClick={handleIconClick1}
            className="w-6 h-6 absolute right-3 top-2.5 cursor-pointer"
          />
          <input
            ref={inputRef1}
            type="date"
            value={selectedDate1}
            onChange={handleDateChange1}
            className="absolute inset-0 left-16 md:left-[275px] md:right-0 opacity-0 cursor-pointer"
            style={{ pointerEvents: "none" }}
          />
        </div>
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Email ID</label>
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="info@example.com" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Phone Number</label>
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="+123 456 789" />
        </div>
        <div className="">
          <label className="block text-sm mb-1 text-[#484848]">Address</label>
          <input
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2"
            defaultValue="1901 Thornridge Cir. Shiloh, Hawaii 81063"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">State</label>
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="Los Angelos" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Country</label>
          <div className="flex justify-between w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2">
                      <input className="" defaultValue="America" />
                      <img src={distance} alt="" />

          </div>
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Pin Code</label>
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="1203" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Nationality</label>
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="American" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#484848]">Date of Birth</label>
  <div className="relative w-full">
          <input
            type="text"
            value={selectedDate2}
            readOnly
            className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2 pr-10"
          />
          <img
            src={calendar}
            alt="calendar icon"
            onClick={handleIconClick2}
            className="w-6 h-6 absolute right-3 top-2.5 cursor-pointer"
          />
          <input
            ref={inputRef2}
            type="date"
            value={selectedDate2}
            onChange={handleDateChange2}
            className="absolute inset-0 left-16 md:left-[275px] md:right-0 opacity-0 cursor-pointer"
            style={{ pointerEvents: "none" }}
          />
        </div>
   </div>
      </form>

      <div className="mt-8  flex justify-end">
        <button className="bg-primary text-white px-5 py-2  rounded-lg cursor-pointer ">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default UserPageProfile;
