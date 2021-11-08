import {
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Link,
} from "@material-ui/core";
import React, { useContext, useRef } from "react";
import Layout from "../components/Layout";
import useStyles from "../utils/styles";
import NextLink from "next/link";
import axios from "axios";
import { Store } from "../utils/store";
import { useRouter } from "next/router";

export default function Login() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping

  if (userInfo) {
    router.push(redirect || "/");
  }

  const emailRef = useRef();
  const passwordRef = useRef();

  const classes = useStyles();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!emailRef.current.value || !passwordRef.current.value) {
      return alert("Missing email or password!");
    }
    try {
      const { data } = await axios.post("/api/users/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      dispatch({ type: "USER_LOGIN", payload: data });
      router.push(redirect || "/");
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };

  return (
    <Layout title="Login">
      <form onSubmit={submitHandler} className={classes.form}>
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
              inputRef={emailRef}
            />
          </ListItem>

          <ListItem>
            <TextField
              id="password"
              label="Password"
              fullWidth
              variant="outlined"
              inputProps={{ type: "password" }}
              inputRef={passwordRef}
            />
          </ListItem>

          <ListItem>
            <Button variant="contained" fullWidth color="primary" type="submit">
              Login
            </Button>
          </ListItem>

          <ListItem>
            Don't have an account? &nbsp;
            <NextLink href={`/register?redirect=${redirect || "/"}`} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
