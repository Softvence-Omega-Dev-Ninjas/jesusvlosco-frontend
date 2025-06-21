import { NavLink, Outlet } from "react-router-dom";

export default function TimeSheet() {
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Time Clock</h2>

            {/* Tab Navigation */}
            <div className="flex gap-4  pb-2 mb-4">
                <NavLink
                    to="time"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                            : "text-gray-600 hover:text-blue-600"
                    }
                >
                    TimeOut
                </NavLink>

                <NavLink
                    to="payroll"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                            : "text-gray-600 hover:text-blue-600"
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
