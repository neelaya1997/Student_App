module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error', 'you are not Athorized to access this page please login to access');
            res.redirect("/auth/login", 401, {})
        }
    },
};