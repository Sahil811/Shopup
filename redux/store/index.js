import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user";
import themeToggleReducer from "../slices/themeToggle";
import cartReducer from "../slices/cart";

export default configureStore({
  reducer: {
    userInfo: userReducer,
    darkMode: themeToggleReducer,
    cart: cartReducer,
  },
});
