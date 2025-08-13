import { NavLink, Outlet } from "react-router-dom";

export default function TimeSheet() {
  // Define your color codes as constants for easier management and readability
  const primaryColor = "#4E53B1";
  const primaryDarkHover = "#3C419C"; // A slightly darker shade for hover effect
  const primaryLightHover = "rgba(78, 83, 177, 0.05)"; // primaryColor with 5% opacity for inactive hover

  const activeStyles = `px-24 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out bg-[${primaryColor}] hover:bg-[${primaryDarkHover}] text-white shadow-md`;
  const inactiveStyles = `px-24 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out bg-transparent border border-[${primaryColor}] text-[${primaryColor}] hover:bg-[${primaryLightHover}] hover:text-[${primaryColor}]`;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Time Clock</h2>

      {/* Tab Navigation */}
      <div className="flex gap-4 pb-2 mb-4">
        <NavLink
          to="time"
          className={({ isActive }) =>
            isActive ? activeStyles : inactiveStyles
          }
        >
          TimeOut
        </NavLink>

        <NavLink
          to="payroll"
          className={({ isActive }) =>
            isActive ? activeStyles : inactiveStyles
          }
        >
          Payroll
        </NavLink>
      </div>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}
