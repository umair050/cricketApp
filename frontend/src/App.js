import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Players from "./pages/Players/Players";
import Teams from "./pages/Teams/Teams";
import Tournaments from "./pages/Tournaments/Tournaments";
import Profile from "./pages/Profile/Profile";
import Invitations from "./pages/Invitations/Invitations";
import Feed from "./pages/Feed/Feed";
import { Provider } from "react-redux";
import store from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";

function AppRoutes() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />

      {/* Protected Routes */}
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="feed" element={<Feed />} />
        <Route path="players" element={<Players />} />
        <Route path="teams" element={<Teams />} />
        <Route path="tournaments" element={<Tournaments />} />
        <Route path="invitations" element={<Invitations />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch all route */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <DarkModeProvider>
        <AuthProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthProvider>
      </DarkModeProvider>
    </Provider>
  );
}

export default App;
