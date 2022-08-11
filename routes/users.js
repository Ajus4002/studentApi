var express = require('express');
var router = express.Router();
var USERCONTROLLER=require('../controller/user-controller')

/* GET users listing. */
router.post('/register',USERCONTROLLER.register)




module.exports = router;
