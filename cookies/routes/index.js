var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/myapp')
var Users = db.get('users')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My App', user: req.cookies.user });
});

router.get('/signup', function (req, res, next){
  res.render('users/signup', { title: 'Sign Up'})
})

router.post('/signup', function (req, res, next){
  var errors = [];
  if (!req.body.email.trim()) {
    errors.push("Email Can't be blank");
  }
  if (!req.body.password.trim()) {
    errors.push("Passord Can't be blank");
  }
  if (!req.body.passconfirm.trim()) {
    errors.push("Please confirm password");
  }
  if (req.body.password.length < 8){
    errors.push("Your password needs to be at least 8 characters")
  }
  if (req.body.passconfirm !== req.body.password) {
    errors.push("Your passwords do not match, please re-confirm");
  }
  if (errors.length) {
    res.render('users/signup', { title: 'Sign Up', errors: errors})
  } else {
    Users.find({  user: req.body.email }, function (err, data) {
      if (data.length > 0) {
        errors.push("Email already in use");
        res.render('users/signup', { title: 'Sign Up', errors: errors})
      } else {
        Users.insert({  user: req.body.email,
                        password: req.body.password
                    })
        res.redirect('/login')
      } 
    })
  }
})

router.get('/login', function (req, res, next){
  res.render('users/login', {  title: 'Sign In'})
})

router.post('/login', function (req, res, next){
  var errors = [];
  Users.findOne( {user: req.body.email }, function (err, user) {
    if (user) {
      if (user.password !== req.body.password){
        errors.push('Invalid Username / password')
        res.render('users/login', { title: 'Sign In', errors: errors})
      } else {
        res.cookie('user', user.user)
        res.redirect('/profile')
      }
    } else {
      errors.push('Invalid Username / password')
      res.render('users/login', { title: 'Sign In', errors: errors})
    }
  })
})

router.get('/logout', function (req, res, next){
  res.clearCookie('user')
  res.redirect('/login')
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
