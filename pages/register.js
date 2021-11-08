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

export default function Register() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping

  if (userInfo) {
    router.push(redirect || "/");
  }

  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const classes = useStyles();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !emailRef.current.value ||
      !passwordRef.current.value ||
      !confirmPasswordRef.current.value
    ) {
      return alert("All fields are required!");
    }

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return alert("Passwords do not match!");
    }

    try {
      const { data } = await axios.post("/api/users/register", {
        name: nameRef.current.value,
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
              id="name"
              label="Name"
              fullWidth
              variant="outlined"
              inputProps={{ type: "text" }}
              inputRef={nameRef}
            />
          </ListItem>

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
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              fullWidth
              variant="outlined"
              inputProps={{ type: "password" }}
              inputRef={confirmPasswordRef}
            />
          </ListItem>

          <ListItem>
            <Button variant="contained" fullWidth color="primary" type="submit">
              Register
            </Button>
          </ListItem>

          <ListItem>
            Already have an account? &nbsp;
            <NextLink href={`/login?redirect=${redirect || "/"}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
