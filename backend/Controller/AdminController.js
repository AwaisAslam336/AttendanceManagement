const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let { Admin } = require("../Model/AdminModel");
let { Student } = require("../Model/StudentModel");
let { Attendance } = require("../Model/AttendanceModel");
const mongoose = require("mongoose");

let registerAdmin = async (request, response) => {
  try {
    let admin = await Admin.findOne({ admin_email: request.body.email });
    if (admin) {
      response.status(400).send({
        Error: "Email Address must be unique!",
      });
      return;
    }
    let hashedPassword = await bcrypt.hash(request.body.password, 10);

    const data = new Admin({
      admin_name: request.body.name,
      admin_email: request.body.email,
      admin_password: hashedPassword,
    });
    let result = await data.save();
    response.status(201).send({
      message: "User Created Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      message: "Error creating user",
    });
  }
};

let loginAdmin = async (req, res) => {
  try {
    //check if admin exists in database
    let admin = await Admin.findOne({ admin_email: req.body.email });
    if (admin) {
      //check if password matches or not
      let passwordCheck = await bcrypt.compare(
        req.body.password,
        admin.admin_password
      );
      if (passwordCheck) {
        //   create JWT token
        let token = createToken(admin._id, admin.admin_email);
        //   return success response
        res.status(200).send({
          message: "Login Successful",
          email: admin.admin_email,
          token,
        });
      } else {
        res.status(400).send({
          message: "Email or Password does not match!",
        });
      }
    } else {
      res.status(400).send({
        message: "Email or Password does not match!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Server is not responding!",
    });
  }
};

function createToken(id, email) {
  const token = jwt.sign(
    {
      AdminId: id,
      AdminEmail: email,
    },
    "RANDOM-TOKEN",
    { expiresIn: "24h" }
  );
  return token;
}

let viewAllStudents = async (request, response) => {
  try {
    let data = await Student.find();
    if (data) {
      response.status(200).send({
        success: "Students Data found",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send({
      Error: "Error accoured while fetching Students Data",
    });
  }
};

let handleLeave = async (request, response) => {
  try {
    let choice = request.query.status;
    let id = request.query.studentId;
    id = new mongoose.Types.ObjectId(id);
    let date = new Date();
    date.setHours(0, 0, 0, 0);

    let status = "";
    if (choice == "accept") {
      status = "leave";
    }
    if (choice == "reject") {
      status = "absent";
    }
    if (status === "") {
      response.send({
        message: "Invalid Choice",
      });
      return;
    }
    let attendance = await Attendance.findOne({ Student: id, date: date });

    if (attendance && attendance.status !== "pending") {
      response.status(400).send({
        message: "Attendance Already Marked",
      });
      return;
    }
    if (attendance && attendance.status === "pending") {
      let result = await Attendance.findOneAndUpdate(
        { Student: id, date: date },
        { status: status }
      );
      response.status(200).send({
        message: "Attendance Marked Successfully",
        result,
      });
      return;
    }

    let data = new Attendance({
      date: date,
      status: status,
      Student: id,
    });
    let result = await data.save();

    response.status(201).send({
      message: "Attendance Marked Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      message: "Error ocured while marking attendance",
    });
  }
};
let deleteAttendance = async (request, response) => {
  try {
    let id = request.query.id;
    let result = await Attendance.findByIdAndDelete({ _id: id });
    response.status(200).send({
      message: "Attendance Deleted Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      message: "Error ocured while deleting attendance",
    });
  }
};
let updateAttendance = async (request, response) => {
  try {
    let status = request.body.status;
    let id = request.body.id;
    let result = await Attendance.findByIdAndUpdate(
      { _id: id },
      { status: status }
    );
    response.status(200).send({
      message: "Attendance Updated Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      message: "Error ocured while updating attendance",
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  handleLeave,
  viewAllStudents,
  deleteAttendance,
  updateAttendance,
};
