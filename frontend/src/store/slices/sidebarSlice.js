import { createSlice } from "@reduxjs/toolkit";

// Check if mobile on initial load
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024;
};

// Initial state
const initialState = {
  isCollapsed: isMobileDevice(),
  isMobile: isMobileDevice(),
};

// Sidebar Slice
const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
      // Auto-collapse on mobile
      if (action.payload) {
        state.isCollapsed = true;
      }
    },
    openSidebar: (state) => {
      state.isCollapsed = false;
    },
    closeSidebar: (state) => {
      state.isCollapsed = true;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setIsMobile,
  openSidebar,
  closeSidebar,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
