const express = require("express");
const router = express.Router();
const multer = require("multer");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const {
  ensureAuthenticated
} = require('../helper/auth_protect')

//load student Schema
require("../Model/Student");
const Student = mongoose.model("student");

//load storage module
const uploadLocal = require("../config/multer");
var upload = multer({
  storage: uploadLocal.storage
});

//======================all get routes starts here ===========================
router.get("/add-student", ensureAuthenticated, (req, res) => {
  res.render("./students/add-student");
});

//students data from database
router.get("/students", ensureAuthenticated, (req, res) => {
  Student.find({
      user: req.user.id
    })
    .sort({
      date: "desc"
    })
    .lean()
    .then((student) => {
      res.render("./students/students", {
        student,
      });
    })
    .catch((err) => console.log(err));
});

// create details Routes
router.get("/student_details/:id", ensureAuthenticated, (req, res) => {
  Student.findOne({
      _id: req.params.id
    })
    .lean()
    .then((std_detail) => {
      res.render("./students/student-details", {
        std_detail: std_detail
      });
    })
    .catch((err) => console.log(err));
});

//======================edit student routes starts here ===========================
router.get("/edit-student/:id", ensureAuthenticated, (req, res) => {
  Student.findOne({
      _id: req.params.id
    })
    .lean()
    .then((editStudent) => {
      if (editStudent.user != req.user.id) {
        req.flash("error", "tou are not authorized user");
      } else {
        res.render("./students/edit-student", {
          editStudent: editStudent
        });
      }
    })
    .catch((err) => console.log(err));
});
//===========================edit student routes ends here  ==================================

//======================all get routes ends here ===========================

//===========================all post routes here ==================================
router.post("/add-student", upload.single("student_photo"), ensureAuthenticated, (req, res) => {
  let {
    student_id,
    student_name,
    student_dob,
    student_location,
    student_education,
    student_email,
    student_skills,
    student_phone,
    student_gender,
    student_percentage,
  } = req.body;

  let newStudent = {
    student_photo: req.file,
    student_id,
    student_name,
    student_dob,
    student_location,
    student_education,
    student_email,
    student_phone,
    student_skills,
    student_gender,
    student_percentage,
    user: req.user.id,
  };
  // save students info in database
  new Student(newStudent)
    .save()
    .then((student) => {
      req.flash("success_msg", "successfully student information created 👍");
      res.redirect("/student/students", 304, {
        student: student,
      });
    })
    .catch((err) => console.log(err));
});

//update or modify students by using http put method
router.put("/edit-student/:id", upload.single("student_photo"), ensureAuthenticated, (req, res) => {
  Student.findOne({
      _id: req.params.id
    })
    .then((updateStudent) => {
      updateStudent.student_photo = req.file;
      updateStudent.student_id = req.body.student_id;
      updateStudent.student_name = req.body.student_name;
      updateStudent.student_location = req.body.student_location;
      updateStudent.student_email = req.body.student_email;
      updateStudent.student_phone = req.body.student_phone;
      updateStudent.student_gender = req.body.student_gender;
      updateStudent.student_skills = req.body.student_skills;
      updateStudent.student_education = req.body.student_education;
      updateStudent.student_percentage = req.body.student_percentage;
      updateStudent.student_dob = req.body.student_dob;

      updateStudent
        .save()
        .then((update) => {
          req.flash("success_msg", "successfully student information updated 👍");
          res.redirect("/student/students", 201, {
            update
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// delete post rout starts here
router.delete("/student-delete/:id", ensureAuthenticated, (req, res) => {
  //find mongodb id
  Student.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      req.flash("success_msg", "successfully student information deleted 🍌");
      res.redirect("/student/students", 201, {});
    })
    .catch((err) => console.log(err));
});
// delete post rout ends here

module.exports = router;