
import { FC, useState, useRef, useEffect } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegThumbsUp } from "react-icons/fa";
import { BsBell } from "react-icons/bs";

interface GaugeProps {
  value: number;
  max: number;
  color: string;
  label: string;
}

const Gauge: FC<GaugeProps> = ({ value, max, color, label }) => {
  const pct = Math.round((value / max) * 100);
  const bgStyle = {
    background: `conic-gradient(${color} ${pct * 3.6}deg, #f3f3f3 0deg)`
  } as const;

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 sm:gap-6">
      {/* Circle */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
        <div className="absolute inset-0 rounded-full" style={bgStyle} />
        <div className="absolute inset-[6px] rounded-full bg-white flex items-center justify-center">
          <span className="text-[10px] xs:text-xs md:text-sm font-semibold" style={{ color }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Value + label */}
      <div className="flex flex-col">
        <p className="text-xs md:text-sm font-medium whitespace-nowrap">
          <span style={{ color }}>{value}</span>
          <span className="text-gray-500">/{max}</span>
        </p>
        <p className="text-[10px] md:text-xs text-gray-500 leading-tight max-w-[6rem]">{label}</p>
      </div>
    </div>
  );
};

interface ResponseCardProps {
  total: number;
  viewed: number;
  likes: number;
}

export const UserResponseCard: FC<ResponseCardProps> = ({ total, viewed, likes }) => {
  const notViewed = total - viewed;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <article className="w-full rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm relative">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Title */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-indigo-600 shrink-0">
          Response
        </h2>

        {/* Gauges + likes */}
        <div className="flex-1 order-3 sm:order-none">
          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-20"> */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 lg:flex-nowrap lg:gap-20">

            <Gauge value={viewed} max={total} color="#16a34a" label="Users viewed" />
            <Gauge value={notViewed} max={total} color="#ef4444" label="Not viewed" />

            {/* Likes */}
            <div className="flex items-center justify-center gap-2 text-gray-500 sm:ml-auto">
              <FaRegThumbsUp className="text-sm sm:text-base md:text-xl" />
              <span className="text-xs sm:text-sm font-medium">{likes} likes</span>
            </div>
          </div>
          
        </div>

        {/* Overflow menu */}
        <div className="relative ml-auto order-2 sm:order-none" ref={dropdownRef}>
          <button
            type="button"
            className="shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Options"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <HiDotsVertical className="h-5 w-5" />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-36 rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-10">
              <button
                className="w-full px-4 py-2 flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
              >
                <BsBell className="text-base" />
                Notify user
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
