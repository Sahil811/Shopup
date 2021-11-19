import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import "../styles/globals.css";
import { StoreProvider } from "../utils/store";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { Provider } from "react-redux";
import store from "../redux/store/index";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Provider store={store}>
        {/* TypeError: Cannot read property 'getState' of undefined if Provider is at root not SnakbarProvider*/}
        <StoreProvider>
          <PayPalScriptProvider deferLoading={true}>
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </StoreProvider>
      </Provider>
    </SnackbarProvider>
  );
}

export default MyApp;
