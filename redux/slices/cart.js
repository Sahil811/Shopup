import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: Cookies.get("cartItems")
      ? JSON.parse(Cookies.get("cartItems"))
      : [],

    shippingAddress: Cookies.get("shippingAddress")
      ? JSON.parse(Cookies.get("shippingAddress"))
      : { location: {} },

    paymentMethod: Cookies.get("paymentMethod")
      ? JSON.parse(Cookies.get("paymentMethod"))
      : null,
  },

  reducers: {
    add: {
      reducer: (state, action) => {
        const newItem = action.payload;
        const existItem = state.cartItems.find(
          (item) => item._id === newItem._id
        );
        const cartItems = existItem
          ? state.cartItems.map((item) =>
              item.name === existItem.name ? newItem : item
            )
          : [...state.cartItems, newItem];

        Cookies.set("cartItems", JSON.stringify(cartItems));
        return { ...state, cartItems };
      },
    },

    remove: {
      reducer: (state, action) => {
        const cartItems = state.cartItems.filter(
          (item) => item._id !== action.payload._id
        );
        Cookies.set("cartItems", JSON.stringify(cartItems));
        return { ...state, cartItems };
      },
    },

    clear: {
      reducer: (state, action) => {
        Cookies.remove("cartItems");
        return { ...state, cartItems: [] };
      },
    },
  },
});

export const {
  add: addCartActionCreator,
  remove: removeCartActionCreator,
  clear: clearCartActionCreator,
} = cartSlice.actions;

export default cartSlice.reducer;
