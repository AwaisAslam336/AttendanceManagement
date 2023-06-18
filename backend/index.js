const express = require("express");
const connectDB = require("./config/db");
const studentRoute = require("./Routes/StudentRoute");
const adminRoute = require("./Routes/AdminRoute");
const port = 8000;

connectDB();
const app = express();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use("/api/student", studentRoute);
app.use("/api/admin", adminRoute);

app.listen(port, () => {
  console.log(`Attendance app listening on port ${port}`);
});
