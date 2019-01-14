var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Project = mongoose.model('Project');
var ACL = mongoose.model('ACL');
var Api = mongoose.model('Api');
var auth = require('../auth');




/*  router.use(function (req, res, next) {
  
  ACL.findOne({
      userid: req.payload.id,
      url: req.originalUrl,
      method: req.method.toLowerCase(),
      hasAccess: true
    })
    .then(function (useraccess) {
      if (useraccess) {
        console.log("User has Access " + useraccess.hasAccess);
        next();
      } else {
        return res.send("You Are UnAuthorized");
      }
    });

});  */

router.post('/:projectname/api', async function (req, res, next) {
  console.log("project api")
  User.findById(req.payload.id).then(async function (user) {
    if (!user) {
      return res.sendStatus(401);
    }
    console.log(req.params.projectname)

    var project = await Project.findOne({
      projectname: req.params.projectname
    }).populate("acl").exec();

    var api = new Api(req.body.api);
    api.project = project._id;

    return api.save().then(function (savedapi) {
      console.log(savedapi);
      project.api.push(savedapi._id);

      return project.save().then(function (savedproject) {
        res.json({
          project: savedproject
        });
      });
    });
  }).catch(err => console.log(err));
});

router.get('/', function (req, res, next) {

  Project.find({})
    .populate({
      path: "acl",
      match: {
        userid: req.payload.id,
        url: req.originalUrl,
        method: req.method.toLowerCase(),
        hasAccess: true
      }

    })
    .populate({
      path: "api"
    })
    .exec()
    .then(function (projects) {

      return res.send(projects);
    }).catch(err => console.log(err));


  /* Project.find(req.query).then(function (result) {
    res.json({
      projects: result
    })
  }).catch(next); */
});

router.get('/feed', function (req, res, next) {
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== 'undefined') {
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    Promise.all([
      Article.find({
        author: {
          $in: user.following
        }
      })
      .limit(Number(limit))
      .skip(Number(offset))
      .populate('author')
      .exec(),
      Article.count({
        author: {
          $in: user.following
        }
      })
    ]).then(function (results) {
      var articles = results[0];
      var articlesCount = results[1];

      return res.json({
        articles: articles.map(function (article) {
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount
      });
    }).catch(next);
  });
});

router.post('/', function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    var project = new Project(req.body.project);
    console.log(project.acl)
    var projectAccess = new ACL({
      projectname: project.projectname,
      projectid: project._id,
      userid: user._id,
      hasAccess: true,
      url: req.baseUrl + req.path + project.projectname,
      method: ["get", "post", "delete", "put"],
    });

    project.assignedto = user._id;
    project.acl.push(projectAccess._id);

    return project.save().then(function (result) {
      if (result) {
        projectAccess.save().then(function (savedAccess) {
          res.send({
            project: result,
            access: savedAccess
          });

        })
      }
    });
  }).catch(next);
});


router.put('/:projectname', function (req, res,  next) {
  User.findById(req.payload.id).then(function (user) {
    Project.updateOne({
      projectname: req.params.projectname
    }, req.body.project, function (err, result) {
      res.send({
        result: result
      });
    });

  });
});



module.exports = router;