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
  Button,
} from "@material-ui/core";
import Head from "next/head";
import React, { useContext, useState } from "react";
import useStyles from "../utils/styles.js";
import NextLink from "next/link";
import { Store } from "../utils/store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);

  const router = useRouter();

  const { darkMode, cart, userInfo } = state;

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

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    router.push("/");
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

              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.user.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                      Profile
                    </MenuItem>

                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, "/order-history")
                      }
                    >
                      Order Hisotry
                    </MenuItem>

                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
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
