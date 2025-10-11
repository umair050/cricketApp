import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const { isCollapsed, isMobile } = useSelector((state) => state.sidebar);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <div className="flex pt-16 w-full">
        <Sidebar />
        <main
          className={`flex-1 w-full ${
            isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64"
          } p-4 sm:p-6 min-h-[calc(100vh-4rem)] transition-all duration-300`}
        >
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
