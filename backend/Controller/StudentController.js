const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let { Student } = require("../Model/StudentModel");
let { Attendance } = require("../Model/AttendanceModel");

let registerStudent = async (request, response) => {
  try {
    let student = await Student.findOne({ student_email: request.body.email });
    if (student) {
      response.status(400).send({
        Error: "Email Address must be unique!",
      });
      return;
    }
    let hashedPassword = await bcrypt.hash(request.body.password, 10);

    const data = new Student({
      student_name: request.body.name,
      student_email: request.body.email,
      student_password: hashedPassword,
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

let loginStudent = async (req, res) => {
  try {
    //check if Student exists in database
    let student = await Student.findOne({ student_email: req.body.email });
    if (student) {
      //check if password matches or not
      let passwordCheck = await bcrypt.compare(
        req.body.password,
        student.student_password
      );
      if (passwordCheck) {
        //   create JWT token
        let token = createToken(student._id, student.student_email);
        //   return success response
        res.status(200).send({
          message: "Login Successful",
          email: student.student_email,
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
      StudentId: id,
      StudentEmail: email,
    },
    "RANDOM-TOKEN",
    { expiresIn: "24h" }
  );
  return token;
}

let askLeave = async (request, response) => {
  try {
    let id = request.user.StudentId;
    id = new mongoose.Types.ObjectId(id);

    let date = new Date();
    date.setHours(0, 0, 0, 0);
    console.log(id, " ", date);

    let attendance = await Attendance.findOne({ Student: id, date: date });

    if (attendance && attendance.status !== "pending") {
      response.status(200).send({
        message: "Attendance Already Marked",
      });
      return;
    }
    if (attendance && attendance.status === "pending") {
      response.status(200).send({
        message: "Attendance is in pending state",
      });
      return;
    }
    let data = new Attendance({
      date: date,
      status: "pending",
      Student: id,
    });
    let result = await data.save();
    response.status(200).send({
      message: "Leave Request Sent Successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({
      Error: "Error occured while sending request",
    });
  }
};

let viewAttendance = async (request, response) => {
  try {
    let id = request.user.StudentId;
    if (!id) {
      id = request.query.id;
    }
    let fromDate = request.query.fromDate ? request.query.fromDate : "";
    let toDate = request.query.toDate ? request.query.toDate : "";
    console.log(fromDate, "---", toDate);
    id = new mongoose.Types.ObjectId(id);
    let data = undefined;
    if (fromDate && toDate) {
      data = await Attendance.find({
        Student: id,
        date: {
          $gte: fromDate,
          $lt: toDate,
        },
      });
    } else {
      data = await Attendance.find({ Student: id });
    }
    if (data) {
      let presents = data.filter((atnd) => atnd.status == "present");
      let leaves = data.filter((atnd) => atnd.status == "leave");
      let absents = data.filter((atnd) => atnd.status == "absent");
      let grade = presents.length > leaves.length ? "A" : "B";
      response.status(200).send({
        data,
        presents: presents.length,
        leaves: leaves.length,
        absents: absents.length,
        grade: grade,
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send({
      Error: "Error accoured while fetching Attendance Data",
    });
  }
};

let markAttendance = async (request, response) => {
  try {
    let id = request.user.StudentId;
    if (request.query.id) {
      id = request.query.id;
    }
    id = new mongoose.Types.ObjectId(id);

    let date = new Date();
    console.log(date);
    date.setHours(0, 0, 0, 0);

    //check if already attendance marked
    let attendance = await Attendance.findOne({ Student: id, date: date });
    if (attendance && attendance.status !== "pending") {
      response.status(200).send({
        message: "Attendance Already Marked",
      });
      return;
    }
    if (attendance && attendance.status === "pending") {
      response.status(200).send({
        message: "Attendance is in pending state",
      });
      return;
    }

    let data = new Attendance({
      date: date,
      status: "present",
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

module.exports = {
  registerStudent,
  loginStudent,
  askLeave,
  viewAttendance,
  markAttendance,
};
