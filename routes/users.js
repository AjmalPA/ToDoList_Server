var express = require('express');
var router = express.Router();
const usersController = require('../controllers/users')
const verifyLoggedInUser = require('../lib/verifyLoggedInUser')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   //res.send('respond with a resource');
//   res.json({users: []});
//   res.status(200);
// });

router.post('/', usersController.create);
router.use(verifyLoggedInUser);
router.get('/', usersController.index);
router.get('/:id', usersController.show);

module.exports = router;
