


import { Outlet } from 'react-router-dom'

import { useState } from 'react';
import { Header } from '../Navbar';
import { Footer } from '../Footer';
import { UserSidebar } from '../UserSidebar';


export default function UserMain() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40  lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className='mt-4'>
                    <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col lg:ml-64 md:mx-4">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 mx-4 ">
                        <Outlet></Outlet>
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    )
}
