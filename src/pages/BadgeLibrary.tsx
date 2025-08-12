
import type React from "react";
import Swal from "sweetalert2";
import { useState, useRef, useEffect } from "react";
import bage1 from "@/assets/bage-1.png";
import bage2 from "@/assets/bage2.png";
import bage3 from "@/assets/bage3.png";
import bage4 from "@/assets/bage4.png";
import bage5 from "@/assets/bage5.png";
import bage6 from "@/assets/bage6.png";
import bage7 from "@/assets/bage7.png";
import bage8 from "@/assets/bage8.png";
import { ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const achievementCards = [
  {
    id: "promotion",
    name: "Promotion",
    icon: bage1,
    bgColor: "bg-pink-100",
  },
  {
    id: "creative",
    name: "Creative",
    icon: bage2,
    bgColor: "bg-purple-100",
  },
  {
    id: "well-done",
    name: "Well-done!",
    icon: bage3,
    bgColor: "bg-blue-100",
  },
  {
    id: "happy-holiday",
    name: "Happy holiday",
    icon: bage4,
    bgColor: "bg-purple-100",
  },
  {
    id: "top-performer",
    name: "Top performer",
    icon: bage5,
    bgColor: "bg-purple-100",
  },
  {
    id: "creative-star",
    name: "Creative",
    icon: bage6,
    bgColor: "bg-purple-100",
  },
  {
    id: "outstanding",
    name: "Outstanding services",
    icon: bage7,
    bgColor: "bg-purple-100",
  },
  {
    id: "employee-month",
    name: "Employee of the month",
    icon: bage8,
    bgColor: "bg-purple-100",
  },
];

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: { top: number; right: number };
}

function DropdownMenu({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  position,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[100px]"
      style={{
        top: position.top,
        right: position.right,
      }}
    >
      <button
        onClick={onEdit}
        className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 cursor-pointer text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

interface AchievementCardProps {
  icon: string;
  label: string;
  onEdit: () => void;
  onDelete: () => void;
}

function AchievementCard({
  icon,
  label,
  onEdit,
  onDelete,
}: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (cardRef.current) {
      setMenuPosition({
        top: 30, // Position below the three dots
        right: 5, // Small margin from right edge
      });
    }

    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    onEdit();
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(); // 🔥 Your delete callback
        setIsMenuOpen(false); // ✅ Close the dropdown/menu

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative p-4 flex flex-col items-center justify-center  hover:border-4   h-[192px]  bg-[#E8E6FF]  hover:border-[#4E53B1] transition-all duration-200 cursor-pointer rounded-xl  "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className=" w-20 h-20 flex justify-center items-center">
        <img src={icon} className="w-full h-full object-contain " alt="" />
      </div>
      <span className="text-xs text-center  text-[#4E53B1] font-bold leading-tight px-1 mt-4">
        {label}
      </span>

      {/* Three dots menu */}
      <button
        onClick={handleMenuClick}
        className={`absolute top-2 right-2 w-6 h-6 cursor-pointer flex items-center justify-center transition-opacity duration-200 ${
          isHovered || isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Vertical 3-dot icon using SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
          className="w-5 h-5 text-gray-600"
        >
          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <DropdownMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        position={menuPosition}
      />
    </div>
  );
}

interface SectionGridProps {
  cards: typeof achievementCards;
}

function SectionGrid({ cards }: SectionGridProps) {
  const navigate = useNavigate();
  const handleEdit = (cardId: string) => {
    console.log("Edit clicked for:", cardId);
    navigate(`/admin/edit-badge`); // 👈 Replace with your actual route
  };

  const handleDelete = (cardLabel: string) => {
    console.log("Delete clicked for:", cardLabel);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4  xl:grid-cols-6 gap-6">
      {cards.map((card) => (
        <AchievementCard
          key={card.id}
          icon={card.icon}
          label={card.name}
          onEdit={() => handleEdit(card.id)}
          onDelete={() => handleDelete(card.id)}
        />
      ))}
    </div>
  );
}

// main component satrt here
export default function BadgeLibrary() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen pb-10">
      {/* header section  */}
      <div className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-between md:items-center">
        {/* Left side - Title and subtitle */}
        <div className="flex flex-col">
          <h1 className="text-2xl text-center md:text-left font-semibold text-[#4E53B1] mb-1">
            Recognition
          </h1>
          <p className="text-gray-600 text-sm">
            Celebrate achievements & keep them motivated
          </p>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:mt-0 mt-4">
          <button
            onClick={() => {
              window.location.href = "/admin/send-recognition";
            }}
            className="px-4 cursor-pointer  bg-gray-100 text-black hover:text-white text-sm py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Send recognition
          </button>
          <button className="px-4 py-3 bg-[#4E53B1] cursor-pointer  text-white text-sm  rounded-md hover:bg-[#343768] transition-colors">
            Badge library
          </button>
          <button className="px-4 py-3 cursor-pointer bg-gray-100 text-gray-700 text-sm  rounded-md hover:bg-gray-200 transition-colors">
            <ListFilter />
          </button>
        </div>
      </div>
      <div className=" bg-white p-6 shadow-md rounded-xl space-y-6 sm:space-y-8">
        {/* Milestones Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-base sm:text-lg font-semibold ttext-[#4E53B1]">
              Milestones
            </h2>
            <button className="flex items-center cursor-pointer gap-2 px-6 py-3 text-sm text-gray-600 border border-gray-300 bg-transparent rounded-md hover:bg-gray-100 transition-colors">
              <span className="text-lg mr-3">+</span>
              <span className="hidden sm:inline">Add Topic</span>
            </button>
          </div>
          <SectionGrid cards={achievementCards} />
        </div>

        {/* Good Job Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#4E53B1]">
              Good Job !
            </h2>
            <button className="flex items-center cursor-pointer gap-2 px-6 py-3 text-sm text-gray-600 border border-gray-300 bg-transparent rounded-md hover:bg-gray-100 transition-colors">
              <span className="text-lg mr-3">+</span>
              <span className="hidden sm:inline">Add Topic</span>
            </button>
          </div>
          <SectionGrid cards={achievementCards} />
        </div>

        {/* Anniversary Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#4E53B1]">
              Anniversary :
            </h2>
            <button className="flex items-center cursor-pointer gap-2 px-6 py-3 text-sm text-gray-600 border border-gray-300 bg-transparent rounded-md hover:bg-gray-100 transition-colors">
              <span className="text-lg mr-3">+</span>
              <span className="hidden sm:inline">Add Topic</span>
            </button>
          </div>
          <SectionGrid cards={achievementCards} />
        </div>
      </div>
    </div>
  );
}
