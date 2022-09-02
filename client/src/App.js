import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RequireAuth from "./components/RequireAuth";
import AllowedPage from "./pages/AllowedPage";
import AdminPage from "./pages/AdminPage";
import ChatPage from "./pages/ChatPage";
import Unauthorized from "./pages/Unauthorized";
import RegisterPage from "./pages/RegisterPage";

import useRefreshToken from "./hooks/useRefreshToken";

const ROLES = {
  Guest: 2001,
  User: 3001,
  Admin: 4001,
};

function App() {
  const refresh = useRefreshToken();
  useEffect(() => {
    async function getToken() {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      }
    }
    getToken();
    return () => {};
  }, []);

  return (
    <Routes>
      {/* <Route element={<PersistLogin />}> */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="auth">
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="allowed" index element={<AllowedPage />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="chat" index element={<ChatPage />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" index element={<AdminPage />} />
        </Route>

        <Route path="unauthorized" index element={<Unauthorized />} />

        {/* <Route path="=unauthorized">
          <Route path="register" element={<Register />} />
        </Route> */}

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      {/* </Route> */}
    </Routes>
  );
}

export default App;
