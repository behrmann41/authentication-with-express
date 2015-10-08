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
  if (!req.body.password.trim()) {
    errors.push('Password cannot be blank')
  }
  if (req.body.password !== req.body.passconfirm){
    errors.push('passwords did not match')
  }
  if (req.body.password.length < 8) {
    errors.push('your password needs to be at least 8 characters')
  }
  if (errors.length) {
    res.render('users/register', {title: 'Create an account', errors: errors})
  } else {
    Users.insert({  user: req.body.email,
                    passwordDigest: hash
                })
    res.redirect('/home')
  }
})

router.get('/home', function (req, res, next){
  res.render('users/home', { title: 'Homepage'})
})

module.exports = router;
