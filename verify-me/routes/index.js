var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/verifyme')
var Users = db.get('users')
var bcrypt = require('bcrypt')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VerifyMe'});
});

router.get('/register', function (req, res, next) {
  res.render('users/register', {  title: 'Create an account'})
})

router.post('/register', function (req, res, next) {
  var errors = []
  var hash = bcrypt.hashSync(req.body.password, 10)
  if (!req.body.email.trim()) {
    errors.push('Email cannot be blank')
  }
  if (req.body.password.length < 8) {
    errors.push('your password needs to be at least 8 characters')
  }
  if (req.body.password === 'password'){
    errors.push('your password cannot be password')
  }
  if (req.body.password !== req.body.passconfirm){
    errors.push('passwords did not match')
  }
  if (errors.length) {
    res.render('users/register', {title: 'Create an account', errors: errors})
  } else {
    Users.find({ user: req.body.email }, function (err, data){
      if (data.length > 0) {
        errors.push('email already in use')
        res.render('users/register', {title: 'Create an account', errors: errors})
      } else {
        Users.insert({  user: req.body.email,
                        passwordDigest: hash
                    })
        req.session.user = req.body.email
        res.redirect('/home')
      }
    })
  }
})

router.get('/login', function (req, res, next){
  res.render('users/login', {  title: 'Sign In'})
})

router.post('/login', function (req, res, next){
  var errors = []
  Users.findOne({ user: req.body.email}, function (err, user){
    if (user){
      if (bcrypt.compareSync(req.body.password, user.passwordDigest)){
        req.session.user = user.user
        req.flash('info','your smokin')
        res.redirect('/home')
      } else {
        errors.push('Invalid Email/Password')
        res.render('users/login', { title: 'Sign In', errors: errors})
      }
    } else {
      errors.push('Invalid Email/Password')
      res.render('users/login', { title: 'Sign In', errors: errors})
    }
  })
})

router.get('/home', function (req, res, next){
  var username = req.session.user
  res.render('users/home', { title: 'Homepage', user: username})
})

router.get('/logout', function (req, res, next){
  req.session = null;
  res.redirect('/')
})

module.exports = router;
