import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import jwt_decode from "jwt-decode";
import { PURGE } from "redux-persist";

const initialState = {
  status: "idle", //'idle' | 'loading' |'succeeded' | 'failed'
  logedIn: false,
  error: null,
};

export const regist = createAsyncThunk("auth/regist", async (initialUser) => {
  try {
    const response = await axios.post("/auth/regist", initialUser);
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const login = createAsyncThunk("auth/login", async (initialUser) => {
  try {
    const response = await axios.post("/auth/login", initialUser);
    const accessToken = response?.data?.accessToken;
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const logout = createAsyncThunk("auth/logout", async (initialUser) => {
  try {
    const response = await axios.post("/auth/logout", initialUser);
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const setAccessToken = createAsyncThunk(
  "auth/setAccessToken",
  async (accessToken) => {
    try {
      return accessToken;
    } catch (error) {
      return console.error(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth", // A name, used in action types
  initialState, // the initial state for the reducer
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(regist.fulfilled, (state, action) => {
        if (action.payload.success) {
          window.alert(`${action.payload.message}`);
          window.location.replace("/");
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        // console.log(action.payload);
        const { accessToken } = action.payload;
        const { userInfo } = jwt_decode(accessToken);
        state.logedIn = true;
        state.userInfo = userInfo;
        state.accessToken = accessToken;
      })
      .addCase(logout.fulfilled, (state, action) => {
        if (action.payload.success) {
          return initialState;
        }
      })
      .addCase(setAccessToken.fulfilled, (state, action) => {
        const accessToken = action.payload.accessToken;
        const { userInfo } = jwt_decode(accessToken);
        state.logedIn = true;
        state.userInfo = userInfo;
        state.accessToken = accessToken;
      })
      .addCase(PURGE, () => {
        return initialState;
      });
  },
});

export const getLogedIn = (state) => state.auth.logedIn;
export const getAccessToken = (state) => state.auth.accessToken;
export const getUserInfo = (state) => state.auth.userInfo;

// export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
