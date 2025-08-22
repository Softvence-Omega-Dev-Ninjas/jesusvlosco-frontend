import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { ReactNode } from "react";

const AdminRoute = ({ children }: { children?: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);

  // If user is undefined, assume the auth state is still loading (e.g. rehydration)
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="w-10 h-10 text-primary animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  // Check if the user is logged in and is an admin
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return <Navigate to="/" replace />;
  }

  // Render passed children (e.g. <AdminRoute><AdminLayout/></AdminRoute>)
  return <>{children}</>;
};

export default AdminRoute;
