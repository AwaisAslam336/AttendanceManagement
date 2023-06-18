const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  student_name: {
    type: String,
    required: [true, "Please provide student name!"],
  },
  student_email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: true,
  },
  student_password: {
    type: String,
    required: [true, "Please provide a password!"],
  },
  student_picture: String,
});

const Student = mongoose.model("Student", studentSchema);

module.exports = {
  Student,
};
