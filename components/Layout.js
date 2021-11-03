import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import React from "react";
import useStyles from "../utils/styles.js";
import NextLink from "next/link";

export default function Layout({ title, description, children }) {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Shopup` : "Shopup"}</title>
        {description && <meta name="description" content={description} />}
      </Head>

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
    </div>
  );
}
