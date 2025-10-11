import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Keyboard shortcut to toggle sidebar (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
};
