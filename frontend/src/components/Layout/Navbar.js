import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Search, User, LogOut, Moon, Sun, Menu } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { toggleSidebar as toggleSidebarAction } from "../../store/slices/sidebarSlice";
import { selectPendingReceivedCount } from "../../store/slices/invitationSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuthContext();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isMobile } = useSelector((state) => state.sidebar);
  const pendingReceivedCount = useSelector(selectPendingReceivedCount);

  const toggleSidebar = () => {
    dispatch(toggleSidebarAction());
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-0 z-30 transition-colors duration-300">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Section: Mobile Menu + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors lg:hidden"
                title="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
                <span className="text-white font-bold text-lg sm:text-xl">
                  🏏
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Cricket Platform
              </h1>
            </div>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players, teams, tournaments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {pendingReceivedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {pendingReceivedCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
              <div className="bg-green-600 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
