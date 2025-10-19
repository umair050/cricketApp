import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Trophy,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Swords,
  MapPin,
  Calendar,
  PlusCircle,
  Building2,
  ClipboardList,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  toggleSidebar as toggleSidebarAction,
  setIsMobile,
  closeSidebar,
} from "../../store/slices/sidebarSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isCollapsed, isMobile } = useSelector((state) => state.sidebar);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState(null);
  const [flyoutPosition, setFlyoutPosition] = useState(null);
  const [hideTimeout, setHideTimeout] = useState(null);

  // Auto-expand submenu if current route matches
  useEffect(() => {
    if (
      location.pathname.startsWith("/grounds") ||
      location.pathname.startsWith("/bookings")
    ) {
      setOpenSubmenu("grounds");
    }
  }, [location.pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      dispatch(setIsMobile(mobile));
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const toggleSidebar = () => {
    dispatch(toggleSidebarAction());
  };

  const handleNavClick = () => {
    if (isMobile) {
      dispatch(closeSidebar());
    }
  };

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  // ============================================
  // NAVIGATION CONFIGURATION
  // ============================================
  // To add a submenu to any item, just add a 'submenu' property with array of child items
  // Example:
  // {
  //   key: "myMenu",        // Required for submenu items
  //   label: "Parent",
  //   icon: IconName,
  //   submenu: [
  //     { to: "/path", icon: IconName, label: "Child" }
  //   ]
  // }

  const navigationConfig = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/feed", icon: Newspaper, label: "Feed" },
    { to: "/players", icon: Users, label: "Players" },
    { to: "/teams", icon: Shield, label: "Teams" },
    { to: "/tournaments", icon: Trophy, label: "Tournaments" },
    { to: "/matches", icon: Swords, label: "Matches" },

    // Grounds Menu with Submenu (easily add more submenu items here!)
    {
      key: "grounds",
      label: "Grounds",
      icon: MapPin,
      submenu: [
        { to: "/grounds", icon: MapPin, label: "Browse Grounds" },
        { to: "/grounds/register", icon: PlusCircle, label: "List Ground" },
        {
          to: "/grounds/owner/my-grounds",
          icon: Building2,
          label: "My Grounds",
        },
        {
          to: "/grounds/owner/all-bookings",
          icon: ClipboardList,
          label: "Manage Orders",
        },
        { to: "/bookings/my-bookings", icon: Calendar, label: "My Bookings" },
      ],
    },

    { to: "/invitations", icon: Mail, label: "Invitations" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  // Check if any submenu child is active
  const isAnySubmenuChildActive = (submenuItems) => {
    return submenuItems.some((item) => location.pathname.startsWith(item.to));
  };

  // Render a single nav item (regular or with submenu)
  const renderNavItem = (item, index) => {
    const Icon = item.icon;

    // Item with Submenu
    if (item.submenu) {
      const isOpen = openSubmenu === item.key;
      const isAnyChildActive = isAnySubmenuChildActive(item.submenu);

      return (
        <div
          key={item.key || index}
          className="relative"
          onMouseEnter={(e) => {
            // Clear any existing timeout
            if (hideTimeout) {
              clearTimeout(hideTimeout);
              setHideTimeout(null);
            }
            setHoveredSubmenu(item.key);
            const rect = e.currentTarget.getBoundingClientRect();
            setFlyoutPosition({
              left: rect.right + 8,
              top: rect.top,
            });
          }}
          onMouseLeave={() => {
            // Add a small delay before hiding
            const timeout = setTimeout(() => {
              setHoveredSubmenu(null);
              setFlyoutPosition(null);
            }, 100);
            setHideTimeout(timeout);
          }}
        >
          {/* Parent Menu Button */}
          <button
            onClick={() => toggleSubmenu(item.key)}
            className={`w-full flex items-center ${
              isCollapsed && !isMobile
                ? "justify-center px-3 py-3"
                : "justify-between px-4 py-3"
            } rounded-lg transition-all duration-200 relative ${
              isAnyChildActive
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-l-4 border-green-600 dark:border-green-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </div>
            {(!isCollapsed || isMobile) &&
              (isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>

          {/* Expanded Submenu Items (when sidebar is open) */}
          {isOpen && (!isCollapsed || isMobile) && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-2">
              {item.submenu.map((subItem) => {
                const SubIcon = subItem.icon;
                return (
                  <NavLink
                    key={subItem.to}
                    to={subItem.to}
                    end={subItem.to === "/grounds"}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                      }`
                    }
                  >
                    <SubIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">
                      {subItem.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Regular Nav Item (no submenu)
    return (
      <NavLink
        key={item.to || index}
        to={item.to}
        onClick={handleNavClick}
        className={({ isActive }) =>
          `flex items-center ${
            isCollapsed && !isMobile
              ? "justify-center px-3 py-3"
              : "space-x-3 px-4 py-3"
          } rounded-lg transition-all duration-200 group relative ${
            isActive
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-l-4 border-green-600 dark:border-green-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          }`
        }
        title={isCollapsed && !isMobile ? item.label : ""}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {(!isCollapsed || isMobile) && (
          <span className="font-medium transition-opacity duration-200 whitespace-nowrap">
            {item.label}
          </span>
        )}

        {/* Tooltip for collapsed state - Desktop Only */}
        {isCollapsed && !isMobile && (
          <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
            {item.label}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isMobile
            ? isCollapsed
              ? "-translate-x-full w-64"
              : "translate-x-0 w-64 z-50"
            : isCollapsed
            ? "w-16"
            : "w-64"
        }`}
        style={{ maxWidth: "100vw" }}
      >
        {/* Toggle Button - Desktop Only */}
        {!isMobile && (
          <div className="absolute -right-3 top-4 z-30 hidden lg:block">
            <button
              onClick={toggleSidebar}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              title={`${isCollapsed ? "Expand" : "Collapse"} sidebar (Ctrl+B)`}
              aria-label={`${isCollapsed ? "Expand" : "Collapse"} sidebar`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        )}

        <div
          className={`${
            isCollapsed && !isMobile ? "p-2" : "p-4 sm:p-6"
          } h-full flex flex-col transition-all duration-300 overflow-y-auto overflow-x-hidden`}
        >
          <nav
            className={`space-y-2 ${
              isCollapsed && !isMobile ? "mt-4" : ""
            } flex-shrink-0`}
          >
            {navigationConfig.map((item, index) => renderNavItem(item, index))}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto pt-4 flex-shrink-0">
            {!isCollapsed || isMobile ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <span className="text-base">🏏</span>
                  Cricket Platform
                </h3>
                <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
                  Connect with players, join teams, and participate in
                  tournaments!
                </p>
              </div>
            ) : (
              <div className="flex justify-center p-2">
                <div
                  className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center border border-green-200 dark:border-green-800"
                  title="Cricket Platform"
                >
                  <span className="text-lg">🏏</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Portal Flyout Menu */}
      {isCollapsed &&
        !isMobile &&
        hoveredSubmenu &&
        flyoutPosition &&
        createPortal(
          <div
            className="fixed bg-gray-900 dark:bg-gray-700 text-white rounded-md shadow-xl min-w-[200px] z-[99999]"
            style={{
              position: "fixed",
              left: flyoutPosition.left,
              top: flyoutPosition.top,
              zIndex: 99999,
              minWidth: "200px",
              backgroundColor: "#1f2937",
              color: "white",
            }}
            onMouseEnter={() => {
              // Clear any existing timeout when hovering over flyout
              if (hideTimeout) {
                clearTimeout(hideTimeout);
                setHideTimeout(null);
              }
            }}
            onMouseLeave={() => {
              // Add a small delay before hiding
              const timeout = setTimeout(() => {
                setHoveredSubmenu(null);
                setFlyoutPosition(null);
              }, 100);
              setHideTimeout(timeout);
            }}
          >
            {/* Arrow */}
            <div className="absolute left-0 top-4 transform -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>

            {/* Submenu Header */}
            <div className="px-3 py-2 border-b border-gray-700 dark:border-gray-600">
              <span className="text-sm font-semibold">Grounds</span>
            </div>

            {/* Submenu Items */}
            <div className="py-2">
              {navigationConfig
                .find((item) => item.key === hoveredSubmenu)
                ?.submenu?.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isActive =
                    subItem.to === "/grounds"
                      ? location.pathname === subItem.to
                      : location.pathname === subItem.to ||
                        location.pathname.startsWith(subItem.to + "/");
                  return (
                    <NavLink
                      key={subItem.to}
                      to={subItem.to}
                      onClick={handleNavClick}
                      className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-green-600 text-white"
                          : "hover:bg-gray-800 dark:hover:bg-gray-600"
                      }`}
                    >
                      <SubIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm whitespace-nowrap">
                        {subItem.label}
                      </span>
                    </NavLink>
                  );
                })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Sidebar;
