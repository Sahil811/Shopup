import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import Head from "next/head";
import React from "react";
import useStyles from "../utils/styles.js";
import NextLink from "next/link";

export default function Layout({ title, description, children }) {
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
      type: "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });

  const classes = useStyles();

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
            <NextLink href="" passHref>
              <Link className={classes.link}>
                <Typography className={classes.brand}>shopup</Typography>
              </Link>
            </NextLink>

            <div className={classes.grow}></div>

            <div>
              <NextLink href="/cart" passHref>
                <Link className={classes.link}>Cart</Link>
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
