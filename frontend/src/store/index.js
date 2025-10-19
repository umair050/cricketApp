import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./slices/feedSlice";
import invitationReducer from "./slices/invitationSlice";
import sidebarReducer from "./slices/sidebarSlice";
import matchReducer from "./slices/matchSlice";
import groundReducer from "./slices/groundSlice";

export const store = configureStore({
  reducer: {
    feed: feedReducer,
    invitations: invitationReducer,
    sidebar: sidebarReducer,
    match: matchReducer,
    grounds: groundReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["feed/uploadMedia/fulfilled"],
      },
    }),
});

export default store;
