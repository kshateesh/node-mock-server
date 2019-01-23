var router = require('express').Router();
var auth = require('../auth');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var Project = mongoose.model('Project');
var ACL = mongoose.model('ACL');
var Api = mongoose.model('Api');
const rateLimit = require("express-rate-limit");


router.use('/api', require('./registeration'));
router.use('/api', require('./users'));
router.use('/api/projects', require('./projects'));

// request throttling
const requestLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 20, // start blocking after 20 requests
  message: "API Limit is Exhausted"
});

// Mock APIs with request throttling

router.get('/*', requestLimit, function (req, res, next) {
  Api.find({
      apiurl: req.baseUrl + req.path,
      method: req.method.toLowerCase()
    })
    .populate({
      path: "project",
      populate: {
        path: "acl",
        model: "ACL",
        match: {
          userid: req.payload.id
        }
      }
    })
    .exec()
    .then(function (mockapi) {

      return res.status(mockapi.status).send(mockapi.body);
    }).catch(err => console.log(err));
});

router.post('/*', requestLimit, function (req, res, next) {
  Api.find({
      apiurl: req.baseUrl + req.path,
      method: req.method.toLowerCase()
    })
    .populate({
      path: "project",
      populate: {
        path: "acl",
        model: "ACL",
        match: {
          userid: req.payload.id
        }
      }
    })
    .exec()
    .then(function (mockapi) {

      return res.status(mockapi.status).send(mockapi.body);
    }).catch(err => console.log(err));
});

router.put('/*', requestLimit, function (req, res, next) {
  Api.find({
      apiurl: req.baseUrl + req.path,
      method: req.method.toLowerCase()
    })
    .populate({
      path: "project",
      populate: {
        path: "acl",
        model: "ACL",
        match: {
          userid: req.payload.id
        }
      }
    })
    .exec()
    .then(function (mockapi) {

      return res.status(mockapi.status).send(mockapi.body);
    }).catch(err => console.log(err));
});

router.delete('/*', requestLimit, function (req, res, next) {
  Api.find({
      apiurl: req.baseUrl + req.path,
      method: req.method.toLowerCase()
    })
    .populate({
      path: "project",
      populate: {
        path: "acl",
        model: "ACL",
        match: {
          userid: req.payload.id
        }
      }
    })
    .exec()
    .then(function (mockapi) {

      return res.status(mockapi.status).send(mockapi.body);
    }).catch(err => console.log(err));
});



router.use(function (err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;