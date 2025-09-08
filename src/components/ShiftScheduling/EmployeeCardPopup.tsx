import { FC, useState, useRef, useEffect } from "react";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";

interface EmployeeCardProps {
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
}

const EmployeeCardPopup: FC<EmployeeCardProps> = ({
  name,
  title,
  department,
  email,
  phone,
  avatar,
  role,
}) => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popupRef}>
      <span
        onClick={() => {
          console.log("Role clicked, toggling popup");
          setOpen((prev) => !prev);
        }}
        className="cursor-pointer text-[10px] border rounded-full px-2 py-0.5 text-indigo-700 border-indigo-200 hover:bg-indigo-50 bg-white transition-colors"
      >
        {role || "Role"}
      </span>

      {open && (
        <div className="absolute z-50 mt-2 w-64 md:w-66 lg:w-76 bg-white border border-gray-200 shadow-lg rounded-xl p-4 right-0">
          <div>
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-indigo-700">
                  {name || "No name"}
                </p>
                <p className="text-sm text-gray-600">{title || "No title"}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {department || "No department"}
                </p>
              </div>
              <div>
                <img
                  src={avatar}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              <p className="flex items-center gap-1">
                <HiOutlineMail className="w-4 h-4" /> {email}
              </p>
              <p className="flex items-center gap-1">
                <HiOutlinePhone className="w-4 h-4" /> {phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCardPopup;
