import React from "react";
import jwt_decode from "jwt-decode";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAccessToken, getLogedIn } from "../features/auth/authSlice";
// accessToken을 가져온다. 그안에서 Role을 추처한다.(decoded)
// 만약 역할이 있으면 Outlet
// 역할이 없으면 로그인여부 확인.
// 만약 로그인이 안되어있으면 로그인 페이지로 이동
// 만약 로그인 되어있으면
const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const token = useSelector(getAccessToken);
  const auth = useSelector(getLogedIn);

  const decoded = token ? jwt_decode(token) : undefined;
  const roles = decoded?.userInfo?.roles || [];

  return roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
