import React, { useState } from 'react';
import { Header } from './Navbar';

import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import AdminLayout from './Admin/AdminLayout';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminLayout></AdminLayout>
  );
};