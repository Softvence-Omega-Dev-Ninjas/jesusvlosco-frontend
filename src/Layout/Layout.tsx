import React, { useState } from "react";

import AdminLayout from "./Admin/AdminLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = () => {


  return <AdminLayout></AdminLayout>;
};
