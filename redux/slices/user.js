import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    const { data } = await axios.post("/api/users/login", { email, password });
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
    // [userLogin.pending]: (state, action) => {
    //   state.status = "loading";
    // },
    [userLogin.fulfilled]: (state, action) => {
      //state.status = "succeeded";
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return action.payload;
    },
    // [userLogin.rejected]: (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message;
    // },
  },
});

export const { logout: logoutActionCreator } = userSlice.actions;

export default userSlice.reducer;
