import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
} from "@material-ui/core";
import Head from "next/head";
import React, { useContext } from "react";
import useStyles from "../utils/styles.js";
import NextLink from "next/link";
import { Store } from "../utils/store";
import Cookies from "js-cookie";

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);

  const { cart } = state;

  const { darkMode } = state;

  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });

  const classes = useStyles();

  const darkModeToggleHanlder = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });

    Cookies.set("darkMode", !darkMode ? "true" : "false");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Shopup` : "Shopup"}</title>
        {description && <meta name="description" content={description} />}
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link className={classes.link}>
                <Typography className={classes.brand}>shopup</Typography>
              </Link>
            </NextLink>

            <div className={classes.grow}></div>

            <div>
              <Switch
                checked={darkMode}
                onChange={() => darkModeToggleHanlder()}
              ></Switch>

              <NextLink href="/cart" passHref>
                <Link className={classes.link}>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    "Cart"
                  )}
                </Link>
              </NextLink>

              <NextLink href="/login" passHref>
                <Link className={classes.link}>login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>

        <Container className={classes.main}>{children}</Container>

        <footer className={classes.footer}>
          <Typography>All rights reserved. Shopup.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
