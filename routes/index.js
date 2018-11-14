var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("oh hai");
  //res.render('index', { title: 'Express' });
  res.status(200);
});

module.exports = router;
