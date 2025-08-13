import { IBadge } from "@/types/recognation";
import BadgeDeleteModal from "../modal/BadgeDeleteModal";
import { useEffect, useRef, useState } from "react";

export default function RecognationCard({ card, badgeChanged, selectedCard }: { card: IBadge, badgeChanged:(id: string) => void, selectedCard?: IBadge }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (cardRef.current) {
      setMenuPosition({
        top: 30,
        right: 5,
      });
    }

    setIsMenuOpen(!isMenuOpen);
  };

  console.log(selectedCard)
  return (
    <div
      ref={cardRef}
      onClick={() => badgeChanged(card?.id)}
      className={`relative p-4 flex flex-col items-center justify-center  hover:border-2   h-[192px]  bg-[#E8E6FF]  hover:border-[#4E53B1] transition-all duration-200 cursor-pointer rounded-xl  ${selectedCard?.id === card?.id && 'border-[#4E53B1] border-2 '}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className=" w-28 h-28 flex justify-center items-center">
        <img
          src={card?.iconImage}
          className="w-full h-full object-contain "
          alt=""
        />
      </div>
      <span className="text-xs text-center  text-[#4E53B1] font-bold leading-tight px-1 mt-4">
        {card?.title}
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
        card={card}
        onClose={() => setIsMenuOpen(false)}
        // onEdit={handleEdit}
        position={menuPosition}
      />
    </div>
  );
}

function DropdownMenu({
  isOpen,
  card,
  onClose,
  

  position,
}: {
  isOpen: boolean;
  card: IBadge;
    onClose: () => void;
    position: { top: number; right: number }
}) {
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
        // onClick={onEdit}
        className="w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        Edit
      </button>
      <BadgeDeleteModal card={card} />
    </div>
  );
}
