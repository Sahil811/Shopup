import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const userInfo = Cookies.get("userInfo")
  ? JSON.parse(Cookies.get("userInfo"))
  : null;

export const userLoginActionCreator = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    const { data } = await axios.post("/api/users/login", { email, password });
    return data;
  }
);

export const userProfileUpdateActionCreator = createAsyncThunk(
  "users/profile",
  async ({ name, email, password }) => {
    const { data } = await axios.put(
      "/api/users/profile",
      {
        name,
        email,
        password,
      },
      { headers: { authorization: `Bearer ${userInfo.token}` } }
    );
    return data;
  }
);

export const userRegisterActionCreator = createAsyncThunk(
  "users/register",
  async ({ name, email, password }) => {
    const { data } = await axios.post("/api/users/register", {
      name,
      email,
      password,
    });
    return data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null,
  reducers: {
    logout: {
      reducer: () => {
        Cookies.remove("userInfo");
        Cookies.remove("cartItems");
        Cookies.remove("shippinhAddress");
        Cookies.remove("paymentMethod");
        return null;
      },
    },
  },
  extraReducers: {
    // [userLoginActionCreator.pending]: (state, action) => {
    //   state.status = "loading";
    // },
    [userLoginActionCreator.fulfilled]: (state, action) => {
      //state.status = "succeeded";
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return action.payload;
    },
    // [userLoginActionCreator.rejected]: (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message;
    // },

    [userProfileUpdateActionCreator.fulfilled]: (state, action) => {
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return action.payload;
    },
    [userRegisterActionCreator.fulfilled]: (state, action) => {
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { logout: logoutActionCreator } = userSlice.actions;

export default userSlice.reducer;
