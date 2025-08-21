import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Mail,
    Award,
    BarChart3,
    Calendar,
    FolderOpen,

    LogOut,
    ChevronDown,
    ChevronRight,
    User,
} from 'lucide-react';
import { useAppDispatch } from '@/hooks/useRedux';
import { logoutUser } from '@/store/Slices/AuthSlice/authSlice';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavigationItem {
    name: string;
    icon: React.ComponentType<any>;
    path?: string;
    hasSubmenu?: boolean;
    submenu?: {
        name: string;
        icon: React.ComponentType<any>;
        path: string;
    }[];
    badge?: number;
}

const navigation: NavigationItem[] = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/user',
    },
    {
        name: 'Communication',
        icon: MessageSquare,
        hasSubmenu: true,
        submenu: [
            { name: 'Messages', icon: Award, path: '/user/communication/userchat' },
            { name: 'Recognition', icon: Mail, path: '/user/communication/user-recognition' },
        ],
    },

    {
        name: 'user',
        icon: User,
        path: '/user/user-profile',
    },


    {
        name: 'Scheduling',
        icon: Calendar,
        hasSubmenu: true,
        submenu: [
            { name: 'Shift Scheduling', icon: Calendar, path: '/user/user-schedule/user-shiftschedule' },
            { name: 'Time Clock', icon: Calendar, path: '/user/user-schedule/user-timeclock' },

            { name: 'TimeOff Request', icon: Calendar, path: '/user/user-schedule/user-timeoffrequest' },
        ],
    },


    {
        name: 'Survey & Poll',
        icon: BarChart3,
        path: '/user/survey',
    },
    {
        name: 'Tasks & Projects',
        icon: FolderOpen,
        path: '/user/user-task',
        badge: 1,
    },

];

export const UserSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
     const dispatch = useAppDispatch();
      const navigate = useNavigate();
      const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
      };
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['Communication']);

    const toggleSubmenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        );
    };

    const handleNavClick = (hasSubmenu?: boolean) => {
        if (!hasSubmenu && window.innerWidth < 1024) {
            onClose();
        }
    };

    const isSubmenuActive = (submenu: { path: string }[]) =>
        submenu.some(item => location.pathname === item.path);

    const renderNavigationItem = (item: NavigationItem) => {
        const isExpanded = expandedMenus.includes(item.name);
        const isSubmenuItemActive = item.submenu ? isSubmenuActive(item.submenu) : false;

        return (
            <div key={item.name}>
                {item.hasSubmenu ? (
                    <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`
              group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg mb-1 transition-all duration-200
              ${isSubmenuItemActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }
            `}
                    >
                        <div className="flex items-center">
                            <item.icon className={`mr-3 h-5 w-5 ${isSubmenuItemActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                            <span>{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {item.badge && (
                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                            {isExpanded ? (
                                <ChevronDown className={`h-4 w-4 ${isSubmenuItemActive ? 'text-blue-600' : 'text-gray-500'}`} />
                            ) : (
                                <ChevronRight className={`h-4 w-4 ${isSubmenuItemActive ? 'text-blue-600' : 'text-gray-500'}`} />
                            )}
                        </div>
                    </button>
                ) : (
                    <NavLink
                        to={item.path!}
                        onClick={() => handleNavClick()}
                        className={({ isActive }) => `
              group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg mb-1 transition-all duration-200
              ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center">
                                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full bg-blue-500 text-white">
                                        {item.badge}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                )}

                {item.hasSubmenu && item.submenu && (
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-6 mt-1 space-y-1">
                            {item.submenu.map(subItem => (
                                <NavLink
                                    key={subItem.name}
                                    to={subItem.path}
                                    onClick={() => handleNavClick()}
                                    className={({ isActive }) => `
                    group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <subItem.icon className={`mr-3 h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                            {subItem.name}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 py-14">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
                    <nav className="flex-grow mt-6 pb-4 overflow-y-auto">
                        <div className="px-3 space-y-1">
                            {navigation.map(renderNavigationItem)}
                        </div>
                    </nav>
                    <div className="flex-shrink-0 px-3 pb-4 border-t border-gray-200 pt-4">
                        <button onClick={handleLogout} className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                            Log out
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div className={`
                lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out border-r border-gray-200 shadow-xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <nav className="mt-6 pb-20 overflow-y-auto h-full">
                    <div className="px-3 space-y-1">
                        {navigation.map(renderNavigationItem)}
                    </div>
                </nav>
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-4 border-t border-gray-200 pt-4 bg-white">
                    <button className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                        <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                        Log out
                    </button>
                </div>
            </div>
        </>
    );
};
