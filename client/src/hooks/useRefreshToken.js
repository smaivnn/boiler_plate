import { useDispatch } from "react-redux";
import axios from "../api/axios";
import { setAccessToken } from "../features/auth/authSlice";
import { persistor } from "../index";

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh");
      const accessToken = response.data.accessToken;
      dispatch(setAccessToken({ accessToken }));
      return accessToken;
    } catch (error) {
      if (error?.response?.status === 401) {
        await persistor.purge();
      }
    }
  };
  return refresh;
};

export default useRefreshToken;
