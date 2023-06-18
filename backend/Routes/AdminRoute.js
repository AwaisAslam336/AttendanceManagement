const express = require("express");
const router = express.Router();
let { auth } = require("../middleware/auth");
let {
  registerAdmin,
  loginAdmin,
  viewAllStudents,
  handleLeave,
  deleteAttendance,
  updateAttendance,
} = require("../Controller/AdminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/students", auth, viewAllStudents);
router.get("/handleLeave", auth, handleLeave);
router.get("/attendance/delete", auth, deleteAttendance);
router.post("/attendance/update", auth, updateAttendance);

module.exports = router;
