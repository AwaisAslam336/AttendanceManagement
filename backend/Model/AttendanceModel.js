const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  date: { type: Date, required: true },
  status: { type: String, required: true },
  Student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = {
  Attendance,
};
