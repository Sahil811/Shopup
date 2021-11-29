import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import userReducer from "../slices/user";
import themeToggleReducer from "../slices/themeToggle";
import cartReducer from "../slices/cart";

export default configureStore({
  reducer: {
    userInfo: userReducer,
    darkMode: themeToggleReducer,
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      process.env.NODE_ENV === "production" ? [] : createLogger()
    ),
  initialState: {},
});
