import { useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import useRefreshToken from "../hooks/useRefreshToken";
import { persistor } from "../index";

const BASE_URL = "http://localhost:3500";

// axios default setting
export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * Used in function that require verification through tokens.
 */
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function AxiosInterceptor({ children }) {
  const accessToken = useSelector(getAccessToken);
  const refresh = useRefreshToken();
  /*
  // getRefresh with localFunction not using hooks.
  const refreshAccessToken = async () => {
    const response = await Axios.get("/auth/refresh");
    const token = response.data.accessToken;
    return token;
  };
*/
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        const token = accessToken;
        console.log(token);
        if (!config.headers["Authorization"] && token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 419 && !prevRequest?.sent) {
          // 419:forbidden
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        } else if (error?.response?.status === 401) {
          await persistor.purge();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);

  return children;
}

export { AxiosInterceptor };
