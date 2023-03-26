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

// User roles
const ROLES = {
  Guest: 2001,
  User: 3001,
  Admin: 4001,
};

function App() {
  const refresh = useRefreshToken();

  // when page refresh, save new accessToken and UserInfo to the Redux store.
  /*
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
*/
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* main Page */}
        <Route index element={<HomePage />} />

        {/* auth Page */}
        <Route path="auth">
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* allowed Page, all user can use it */}
        <Route path="allowed" index element={<AllowedPage />} />

        {/* not allowed page, need login and ROLES */}
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}> */}
        <Route path="chat" index element={<ChatPage />} />
        {/* </Route> */}

        {/* admin Page, need admin role */}
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}> */}
        <Route path="admin" index element={<AdminPage />} />
        {/* </Route> */}

        {/* show unathorize */}
        <Route path="unauthorized" index element={<Unauthorized />} />

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
