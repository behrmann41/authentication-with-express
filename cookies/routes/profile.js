var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/myapp')
var Users = db.get('users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var username = req.session.user
  res.render('users/profile', { title: 'Dashboard', 
                                  success: 'You are logged in now. Rock on!',
                                  user: username
                                })
});

module.exports = router;
