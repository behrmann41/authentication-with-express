var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('fraggle', req.query.foo)
  res.render('index', { title: req.query.foo });
});

router.get('/show', function(req, res, next) {
  res.render('index', { title: req.cookies.fraggle });
});

router.get('/delete', function (req, res, next){
  res.render('index', { title: res.clearCookie('fraggle') });
  res.redirect('/')
})


module.exports = router;
