import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const themeToggleSlice = createSlice({
  name: "themeToggle",
  initialState: Cookies.get("darkMode") === "true",
  reducers: {
    toggle: {
      reducer: (state) => {
        Cookies.set("darkMode", !state ? "true" : "false");
        return !state;
      },
    },
  },
});

export const { toggle: themeToggleActionCreator } = themeToggleSlice.actions;

export default themeToggleSlice.reducer;
