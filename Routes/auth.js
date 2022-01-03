const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//loads auth Schema and model
const User = require('../Model/Auth');

// register get routes starts here
router.get('/register', (req, res) => {
    res.render("./auth/register")
})
// register get routes endss here

// register post routes starts here
router.post('/register', (req, res) => {
    //validation
    let errors = [];
    let {
        username,
        password,
        email,
        password2
    } = req.body;
    if (password != password2) {
        errors.push({
            text: 'Both Password should be match'
        });
    }
    if (password.length < 6) {
        errors.push({
            text: 'password length should be atleast 6 characters'
        });
    }
    if (errors.length > 0) {
        res.render('./auth/register', {
            errors,
            username,
            email,
            password,
            password2,
        });
    } else {
        User.findOne({
            email
        }).then(user => {
            if (user) {
                req.flash("errors_msg", "Email already has been taken !, Try a new valid one😃");
                res.redirect("/auth/register", 401, {});
            } else {
                let newUser = new User({
                    username,
                    password,
                    email
                });
                bcrypt.genSalt(12, (err, salt) => {
                    if (err) throw (err);
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw (err);
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                req.flash("success_msg", "User Registered Successfully😆! Now enter your credentials to login")
                                res.redirect("/auth/login", 401, {
                                    user
                                })
                            })
                            .catch((err) => console.log(err))
                    })
                })
            }
        }).catch((err) => console.log(err))
    }
})
// register post routes ends here

//login GET routes starts here
router.get('/login', (req, res) => {
    res.render("./auth/login")
})
//login GET routes ends here

//login POST routes starts here
router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/student/students",
        failureRedirect: "/auth/login",
        failureFlash: true,
    })(req, res, next);
})
//login POST routes ends here

//logout
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', "User successfully logged out 🚪");
    res.redirect("/auth/login", 201, {})
})
module.exports = router;