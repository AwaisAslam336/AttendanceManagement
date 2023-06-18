const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  admin_name: { type: String },
  admin_email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: true,
  },
  admin_password: {
    type: String,
    required: [true, "Please provide a password!"],
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Admin,
};
