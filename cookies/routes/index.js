var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/myapp')
var Users = db.get('users')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My App' });
});

router.get('/signup', function (req, res, next){
  res.render('users/signup', { title: 'Sign Up'})
})

router.post('/signup', function (req, res, next){
  var errors = [];
  if (!req.body.email.trim()) {
    errors.push("Email Can't be blank")
  }
  if (!req.body.password.trim()) {
    errors.push("Passord Can't be blank")
  }
  if (!req.body.passconfirm.trim()) {
    errors.push("Please confirm password")
  }
  if (errors.length) {
    res.render('users/signup', { title: 'Sign Up', errors: errors})
  }
})

// router.get('/', function(req, res, next) {
//   res.cookie('fraggle', req.query.foo)
//   res.render('index', { title: req.query.foo });
// });

// router.get('/show', function(req, res, next) {
//   res.render('index', { title: req.cookies.fraggle });
// });

// router.get('/delete', function (req, res, next){
//   res.render('index', { title: res.clearCookie('fraggle') });
//   res.redirect('/')
// })


module.exports = router;
