var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.post('/users', function (req, res, next) {
    var user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(function () {
        debugger;
        return res.json({
            user: user.toAuthJSON()
        });
    }).catch(next);
});

module.exports = router;