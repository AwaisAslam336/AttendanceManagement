import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import CheckboxesGroup from "../CheckboxesGroup";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (userType.Admin && userType.Student) ||
      (!userType.Admin && !userType.Student)
    ) {
      alert("Please Pick One User Type!");
      return;
    }
    let urlType = "";
    if (userType.Admin) {
      urlType = "admin";
    } else {
      urlType = "student";
    }
    const configuration = {
      method: "post",
      url: `http://localhost:8000/api/${urlType}/login`,
      data: {
        email: email,
        password: password,
      },
    };
    axios(configuration)
      .then((result) => {
        //console.log(result.data.token);
        setLoggedIn(true);
        cookies.set("TOKEN", result.data.token, {
          path: "/",
        });
        window.location.href = `/${urlType}Dashboard`;
      })
      .catch((error) => {
        alert(error.response.data.message);
        console.log(error.response.data);
      });
  };
  const handleDataChange = (data) => {
    setUserType({ ...data });
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={(e) => handleSubmit(e)}
          >
            <CheckboxesGroup onDataChange={handleDataChange} />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => handleSubmit(e)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
