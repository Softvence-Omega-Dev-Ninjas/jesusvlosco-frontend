import { useState } from "react";
import user1 from "@/assets/user1.png";
import { X } from "lucide-react";
import { useGetAllUserQuery } from "@/store/api/admin/user/userApi";
import { TUser } from "@/types/usertype";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserAdd } from "react-icons/hi";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/store/Slices/AuthSlice/authSlice";


export default function UserModal({
  setShowUserModal,
  onChatWithUser
}: {
  setShowUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  onChatWithUser: (userId: string) => void
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
   const user = useAppSelector(selectUser);
  const users = useGetAllUserQuery({});
  const employees = users?.data?.data.filter((user: TUser) => user.role != "ADMIN") || [];
  console.log(employees);

  const handleChat = (userId: string) => {
      console.log(`Starting chat with ${userId}`);
      // Call the parent's chat handler if provided
      if (onChatWithUser) {
        onChatWithUser(userId);
        setShowUserModal(false)
      }
    };

    const filteredEmployees = employees.filter(
    (employee: TUser) =>
      employee.profile?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.profile?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.profile?.department.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 relative">
      <span
        onClick={() => setShowUserModal(false)}
        className="absolute top-3 right-3 cursor-pointer"
      >
        <X />
      </span>
      <div className="p-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">New Message</h2>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <input
            type="text"
            placeholder="Search conversation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

       {
         user?.role === "ADMIN" && (
           <button
             onClick={() => navigate("/admin/add-user")}
             className="flex items-center gap-2 text-primary transition-colors font-semibold cursor-pointer"
           >
             <HiOutlineUserAdd />
             New User
           </button>
         )
       }

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Suggested</h3>
          <div className="space-y-3">
            {filteredEmployees.map((contact: TUser) => (
              <div
                key={contact.id}
                onClick={() => handleChat(contact.id)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div>
                  <img src={contact.profile.profileUrl || user1} alt="" />
                </div>
                {/* On click name will open chat conversation */}
                <span className="text-sm font-medium text-gray-800">
                  {contact.profile?.firstName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
