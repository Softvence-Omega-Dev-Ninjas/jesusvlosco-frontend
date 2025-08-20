import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import type { ReactNode } from "react";

const AdminRoute = ({ children }: { children?: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);

  // Check if the user is logged in and is an admin
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return <Navigate to="/" replace />;
  }

  // Render passed children (e.g. <AdminRoute><AdminLayout/></AdminRoute>)
  return <>{children}</>;
};

export default AdminRoute;
