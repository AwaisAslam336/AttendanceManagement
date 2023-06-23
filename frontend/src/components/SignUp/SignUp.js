import * as React from "react";
import axios from "axios";
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
import { useFormik } from "formik";
import * as Yup from "yup";

const defaultTheme = createTheme();

export default function SignUp() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      checked: [],
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("Required")
        .min(6, "Must be 6 characters or more"),
      checked: Yup.array()
        .min(1, "please select one user type")
        .max(1, "please select one user type"),
    }),
    onSubmit: (values) => {
      if (values.checked.length != 1) {
        alert("Please Pick One User Type!");
        return;
      }
      let urlType = values.checked[0];
      const configuration = {
        method: "post",
        url: `http://localhost:8000/api/${urlType}/register`,
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      };
      // make the API call
      axios(configuration)
        .then((result) => {
          window.location.href = `/`;
        })
        .catch((error) => {
          alert(error.response.data.Error);
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
            Sign up
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
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                <text> Admin</text>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="checked"
                  value="Student"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                <text> Student</text>
              </label>
              {formik.errors.checked && formik.touched.checked ? (
                <div style={{ color: "red" }}>{formik.errors.checked}</div>
              ) : null}
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Full Name"
                  autoFocus
                />
                {formik.errors.name && formik.touched.name ? (
                  <div style={{ color: "red" }}>{formik.errors.name}</div>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="email"
                />
                {formik.errors.email && formik.touched.email ? (
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
                  onBlur={formik.handleBlur}
                  autoComplete="new-password"
                />
                {formik.errors.password && formik.touched.password ? (
                  <div style={{ color: "red" }}>{formik.errors.password}</div>
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
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
