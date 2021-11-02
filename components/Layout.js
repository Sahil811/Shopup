import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import useStyles from "../utils/styles.js";

export default function Layout({ children }) {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>shopup</title>
      </Head>

      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <Typography>shopup</Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.main}>{children}</Container>

      <footer className={classes.footer}>
        <Typography>All rights reserved. Shopup.</Typography>
      </footer>
    </div>
  );
}
