const express = require("express");
const router = express.Router();
let { auth } = require("../middleware/auth");
let {
  registerStudent,
  loginStudent,
  askLeave,
  viewAttendance,
  markAttendance,
} = require("../Controller/StudentController");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/", auth, (req, res) => {
  res.send("Student PAge");
});
router.get("/leave", auth, askLeave);
router.get("/view", auth, viewAttendance);
router.get("/mark", auth, markAttendance);

module.exports = router;
