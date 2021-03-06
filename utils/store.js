import Cookies from "js-cookie";
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  darkMode: Cookies.get("darkMode") === "true",

  cart: {
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

  userInfo: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo"))
    : null,
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "TOGGLE_DARK_MODE":
        return {
          ...state,
          darkMode: !state.darkMode,
        };

      case "CART_ADD_ITEM": {
        const newItem = action.payload;
        const existItem = state.cart.cartItems.find(
          (item) => item._id === newItem._id
        );
        const cartItems = existItem
          ? state.cart.cartItems.map((item) =>
              item.name === existItem.name ? newItem : item
            )
          : [...state.cart.cartItems, newItem];
        Cookies.set("cartItems", JSON.stringify(cartItems));
        return { ...state, cart: { ...state.cart, cartItems } };
      }

      case "CART_REMOVE_ITEM": {
        const cartItems = state.cart.cartItems.filter(
          (item) => item._id !== action.payload._id
        );
        Cookies.set("cartItems", JSON.stringify(cartItems));
        return { ...state, cart: { ...state.cart, cartItems } };
      }

      case "USER_LOGIN":
        Cookies.set("userInfo", JSON.stringify(action.payload));
        return { ...state, userInfo: action.payload };

      case "USER_LOGOUT":
        Cookies.remove("userInfo");
        Cookies.remove("cartItems");
        Cookies.remove("shippinhAddress");
        Cookies.remove("paymentMethod");
        return {
          ...state,
          userInfo: null,
          cart: {
            cartItems: [],
            shippingAddress: { location: {} },
            paymentMethod: "",
          },
        };

      case "SAVE_SHIPPING_ADDRESS":
        Cookies.set("shippingAddress", JSON.stringify(action.payload));
        return {
          ...state,
          cart: {
            ...state.cart,
            shippingAddress: {
              ...state.cart.shippingAddress,
              ...action.payload,
            },
          },
        };

      case "SAVE_SHIPPING_ADDRESS_MAP_LOCATION":
        return {
          ...state,
          cart: {
            ...state.cart,
            shippingAddress: {
              ...state.cart.shippingAddress,
              location: action.payload,
            },
          },
        };

      case "SAVE_PAYMENT_METHOD":
        Cookies.set("paymentMethod", JSON.stringify(action.payload));
        return {
          ...state,
          cart: { ...state.cart, paymentMethod: action.payload },
        };

      case "CART_CLEAR":
        Cookies.remove("cartItems");
        return {
          ...state,
          cart: { ...state.cart, cartItems: [] },
        };

      default:
        return state;
    }
  }, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>
      {props.children}
    </Store.Provider>
  );
}
