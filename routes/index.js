var express = require('express');
var router = express.Router();
const multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, 'uploads/')
    },
    filename: function (req,file,cb){
        cb(null, Date.now() + '.' + file.mimetype.split('/').reverse()[0]);
    },
});

var upload = multer({storage: storage}); 

const ADMINCONTROLLER = require('../controller/admin-controller')
const STUDENTCONTROLL = require('../controller/student-controller')
/* GET home page. */
router.post('/login', ADMINCONTROLLER.login);
router.post('/adminregister', ADMINCONTROLLER.adminregister);
router.get('/getstudent', STUDENTCONTROLL.getstudent);
router.post('/addstudent', STUDENTCONTROLL.addStudent);
router.post('/updatestudent/:id', STUDENTCONTROLL.updateStudent);
router.get('/getStudentDetails/:id', STUDENTCONTROLL.getstudentdetails);

router.delete('/deletestudent/:id', STUDENTCONTROLL.deleteStudent);

router.post('/student/upload', upload.single('image'), (req, res) => res.json({filename: req.file.filename}));

module.exports = router;
