const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  student_id: {
    type: String,
  },
  student_name: {
    type: String,
    required: true,
  },
  student_location: {
    type: String,
    required: true,
  },
  student_dob: {
    type: String,
    required: true,
  },
  student_education: {
    type: String,
    required: true,
  },
  student_skills: {
    type: [""],
    required: true,
  },
  student_phone: {
    type: Number,
    required: true,
  },
  student_email: {
    type: String,
    required: true,
  },
  student_gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  student_photo: {
    type: [""],
    required: true,
  },
  student_percentage: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("student", StudentSchema);