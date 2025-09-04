
import { BiEditAlt } from "react-icons/bi";
// import google from "../../assets/google.png"
// import facebook from "../../assets/facebook.png"
// import X from "../../assets/x.png"

import profile from "../../assets/adminprofile.png"


export default function AdminProfile() {
  return (
    <div className=" max-w-7xl mx-auto px-6  ">
      {/* Personal Information Section */}
      <div className=" border border-gray-200 rounded-2xl mb-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#484848]">Personal Information</h2>
              <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
              <BiEditAlt size={16} />
              Edit
            </button>
          </div>
          
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <img 
                src={profile}
                alt="Profile" 
                className="w-64 h-64 rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-[#5B5B5B] mb-2">
                  Full name
                </label>
                <input 
                  type="text" 
                  value="Brooklyn Simmons" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none text-[#5B5B5B]"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#5B5B5B] mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value="(907) 555-0101" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none text-[#5B5B5B]"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#5B5B5B] mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  value="michelle.rivera@example.com" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none text-[#5B5B5B]"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      {/* <div className=" rounded-2xl border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Password</h2>
              <p className="text-sm text-gray-600 mt-1">Change your password to keep your account secure</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Change password
            </button>
          </div>
        </div>
      </div> */}

      {/* Link Accounts Section */}
      {/* <div className=" rounded-2xl  border border-gray-200">
        <div className="p-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-[#484848]">Link accounts</h2>
            <p className="text-sm text-[#5B5B5B] mt-1">Connect your account with social logins</p>
          </div>
          
   
      
            <div className="flex items-center justify-between py-3  rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                   <img src={facebook} alt="facebook" />
                </div>
                <div>
                  <h3 className="font-medium text-[#484848]">Facebook</h3>
                  <p className="text-sm text-[#5B5B5B]">Not connected</p>
                </div>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                Connect
              </button>
            </div>


            <div className="flex items-center justify-between py-3  rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img src={X} alt="x" />
                </div>
                <div>
                  <h3 className="font-medium text-[#484848]">Twitter</h3>
                  <p className="text-sm text-[#5B5B5B]">Not connected</p>
                </div>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                Connect
              </button>
            </div>


            <div className="flex items-center justify-between py-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <img src={google} alt="google" />
                </div>
                <div>
                  <h3 className="font-medium text-[#484848]">Google</h3>
                  <p className="text-sm text-[#5B5B5B]">Connected</p>
                </div>
              </div>
              <button className=" border border-gray text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                Connect
              </button>
            </div>
        
        </div>
      </div> */}
    </div>
  );
}