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
import axios from "axios";
import Cookies from "universal-cookie";
import { useFormik } from "formik";
const cookies = new Cookies();

const defaultTheme = createTheme();

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  }
  return errors;
};
export default function SignIn() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      checked: [],
    },
    validate,
    onSubmit: (values) => {
      if (values.checked.length != 1) {
        alert("Please Pick One User Type!");
        return;
      }
      let urlType = values.checked[0];

      const configuration = {
        method: "post",
        url: `http://localhost:8000/api/${urlType}/login`,
        data: {
          email: values.email,
          password: values.password,
        },
      };
      axios(configuration)
        .then((result) => {
          //console.log(result.data.token);
          cookies.set("TOKEN", result.data.token, {
            path: "/",
          });
          window.location.href = `/${urlType}Dashboard`;
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.log(error.response.data);
        });
    },
  });
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
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1 }}
          >
            <div id="checkbox-group">Select User Type</div>
            <div
              style={{ margin: 15 }}
              role="group"
              aria-labelledby="checkbox-group"
            >
              <label style={{ marginRight: 25 }}>
                <input
                  type="checkbox"
                  name="checked"
                  value="Admin"
                  onChange={formik.handleChange}
                />
                <text> Admin</text>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="checked"
                  value="Student"
                  onChange={formik.handleChange}
                />
                <text> Student</text>
              </label>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  autoComplete="email"
                  autoFocus
                />
                {formik.errors.email ? (
                  <div style={{ color: "red" }}>{formik.errors.email}</div>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  autoComplete="current-password"
                />
                {formik.errors.password ? (
                  <Box sx={{ color: "red" }}>{formik.errors.password}</Box>
                ) : null}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={formik.handleSubmit}
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
