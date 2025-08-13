import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const AdminRoute = () => {
  const user = useSelector((state: RootState) => state.user.user);

  // Check if the user is logged in and is an admin
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
