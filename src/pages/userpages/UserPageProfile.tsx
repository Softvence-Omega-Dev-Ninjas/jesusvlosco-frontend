import profile from "../../assets/Ellipse 295.png"


import { BiEditAlt } from "react-icons/bi";

const UserPageProfile = () => {
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
          <input type="date" className="w-full border-2 text-gray-500 border-gray-200 rounded-lg p-2" defaultValue="1998-07-25" />
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
          <input className="w-full border-2 border-gray-200 text-gray-500 rounded-lg p-2" defaultValue="America" />
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
          <input type="date" className="w-full border-2 text-gray-500 border-gray-200 rounded-lg p-2" defaultValue="1998-07-25" />
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
