const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// ..load a schema module
const User = require('../Model/Auth');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'No User found on this email please register and then login'
                });
            }
            //match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user, {
                        message: "user login successfull"
                    });
                } else {
                    return done(null, false, {
                        message: "entered password is incorrect, please check once again"
                    })
                };
            })
        }).catch(err => console.log(err))
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};