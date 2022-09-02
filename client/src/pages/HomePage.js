import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getLogedIn,
  getUserInfo,
  login,
  logout,
} from "../features/auth/authSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const auth = useSelector(getLogedIn);
  const userInfo = useSelector(getUserInfo);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(login({ userId, password })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      dispatch(logout({ userId: userInfo.userId })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {auth && userInfo ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <>
          <Link to={`/auth/register`}>회원가입</Link>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                autoComplete="off"
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">submit</button>
          </form>
        </>
      )}
      <div>
        <Link to={`/allowed`}>허용됨</Link>
      </div>

      <div>
        <Link to={`/chat`}>비허용됨</Link>
      </div>

      <div>
        <Link to={`/admin`}>관리자</Link>
      </div>
    </div>
  );
};

export default HomePage;
