var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/myapp')
var Users = db.get('users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/profile', { title: 'Dashboard', 
                                success: 'You are logged in now. Rock on!'
                              })
});

module.exports = router;
