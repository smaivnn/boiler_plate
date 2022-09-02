import React, { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";

const FetchUser = () => {
  const navigate = useNavigate();
  const [Users, setUsers] = useState([]);
  const effectRan = useRef(false);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const getUsers = async () => {
        try {
          const response = await axiosPrivate.get("/auth/user", {
            signal: controller.signal,
          });
          const userId = response.data.map((user) => user.userId);
          console.log(userId);
          isMounted && setUsers(userId);
        } catch (err) {
          console.error(err);
          navigate("/");
        }
      };

      getUsers();
    }
    return () => {
      isMounted = false;
      effectRan.current = true;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      {Users?.length ? (
        <ul>
          {Users.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </div>
  );
};

export default FetchUser;
