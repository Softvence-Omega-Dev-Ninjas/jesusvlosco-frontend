import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logoutUser, selectUser } from "@/store/Slices/AuthSlice/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "./UpdateProfileModal";
// import { useGetProfileQuery } from "@/store/api/auth/authApi";

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector(selectUser);
  console.log("Access Token:", user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logout successfull");
    navigate("/email-login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {
              ((user?.profile?.firstName[0] as string) +
                user?.profile?.lastName[0]) as string
            }
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
            {user?.profile?.firstName + " " + user?.profile?.lastName}{" "}
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <ul className="py-1">
            <li>
              <UpdateProfileModal />
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
