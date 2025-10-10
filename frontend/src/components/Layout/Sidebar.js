import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Trophy,
  User,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/players", icon: Users, label: "Players" },
    { to: "/teams", icon: Shield, label: "Teams" },
    { to: "/tournaments", icon: Trophy, label: "Tournaments" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-20 transition-colors duration-300 overflow-y-auto">
      <div className="p-6 h-full flex flex-col">
        <nav className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-r-2 border-green-600 dark:border-green-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="p-4 bg-light-green rounded-lg">
            <h3 className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
              🏏 Cricket Platform
            </h3>
            <p className="text-xs text-green-700 dark:text-green-400">
              Connect with players, join teams, and participate in tournaments!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
