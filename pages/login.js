import {
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Link,
} from "@material-ui/core";
import React from "react";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import NextLink from "next/link";

export default function Login() {
  const classes = useStyles();
  return (
    <Layout title="Login">
      <form className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>

        <List>
          <ListItem>
            <TextField
              id="email"
              label="Email"
              fullWidth
              variant="outlined"
              inputProps={{ type: "email" }}
            />
          </ListItem>

          <ListItem>
            <TextField
              id="password"
              label="Password"
              fullWidth
              variant="outlined"
              inputProps={{ type: "password" }}
            />
          </ListItem>

          <ListItem>
            <Button variant="contained" fullWidth color="primary" type="submit">
              Login
            </Button>
          </ListItem>

          <ListItem>
            Don't have an account? &nbsp;
            <NextLink href="/register" passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
