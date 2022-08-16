const Student = require('../model/student');
const Joi = require('joi');
const { string, object } = require('joi');
const StudentDetails = require('../model/student');
const nodemailer = require("nodemailer");
let ejs = require("ejs");
const path = require("path")




async function getstudent(req, res){
try{
    console.log(req.query);

    const pagination = req.query.pagination;
    const page = pagination.current;
    const pageItems = pagination.pageSize;
  
 

    const sortField = req.query.sortField ?? 'name'
    const sortOrder = (req.query.sortOrder ?? 'ascend') === 'ascend' ? 1 : -1

    const query = {isDeleted: false}

    if(req.query.filters?.email?.length){
        query.email = { '$regex' : req.query.filters.email[0], '$options' : 'i' }
    }

    const data = await StudentDetails
        .find(query)
        .sort({[sortField]: sortOrder})
        .skip((page-1)*pageItems)
        .limit(pageItems).exec()

    let totalCount = undefined
    if (page == 1) {
        totalCount = await StudentDetails.countDocuments(query)
    }

    res .status(200).json({data, totalCount})
   
} 
catch (e) {
  res.status(500).json({message:"Internal server error"})
}
}

async function addStudent(req, res){
 try{
    const schema = Joi.object({

        name: Joi.string().required(),
        email: Joi.string().required().lowercase(),
        class: Joi.string().required(),
        mobile: Joi.string().required(),
        address: Joi.string().required(),
        image: Joi.string()

    }).options({stripUnknown: true})


const{value, error} = schema.validate(req.body)


if(error){
    return res
           .status(400)
           .json({message:"Invalid request"})
}
if(await StudentDetails.findOne({email: value.email})){

    return res
           .status(400)
           .json({message:'Student alredy exist'})
}
 const Student = new StudentDetails(value)
 await Student.save()

 const html = await ejs.renderFile(path.resolve(__dirname, '../mail-templates/student-add.html'), {Student})

  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_USERNAME, // sender address
    to: Student.email, // list of receivers
    subject: "Student details Added", // Subject line
    text: "Hello world?", // plain text body
    html: html, // html body
  });


 return res.status(200)
           .json({message:'Student Detail Added Sussess fully'})
}
catch (e) {
  res.status(500).json({message:"Internal server error"})
}
}

async function updateStudent(req, res){
  try{ 
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().lowercase(),
        class: Joi.string().required(),
        mobile: Joi.string().required().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/),
        address: Joi.string().required(),
        image: Joi.string()


    }).options({stripUnknown:true});

    const{value, error} = schema.validate(req.body)
    if(error){
        return res .status(400)
                .json({message: "invalid request"})

    }
    const student = await StudentDetails.findById(req.params.id)

    const ChangedValue = {}
    for (const key in value) {
     if (student[key] !== value[key]) {
       ChangedValue[key] = value[key]
     }
    }


    student.set(value)
    await student.save()




 console.log(ChangedValue);


    const htmlupdate = await ejs.renderFile(path.resolve(__dirname, '../mail-templates/student-update.html'), {student,ChangedValue})

    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.MAIL_USERNAME, // sender address
      to: student.email, // list of receivers
      subject: "Student details updated", // Subject line
      text: "Hello world?", // plain text body
      html: htmlupdate, // html body
    });
  


    return res .status(200)
            .json({message: 'student detail update Successfully'})
}
catch (e) {
  res.status(500).json({message:"Internal server error"})
}
}

async function getstudentdetails(req, res){
try{
    const student = await StudentDetails.findById(req.params.id)
    res .status(200).json({data: student})
}
catch (e) {
  message.error("Error found get student")
}
}
async function deleteStudent(req, res){
  try{
    const student = await StudentDetails.findById(req.params.id)
    student.isDeleted = true
    await student.save()

    const htmldelete = await ejs.renderFile(path.resolve(__dirname, '../mail-templates/student-delete.html'), {student})

    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });
  
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.MAIL_USERNAME, // sender address
      to: student.email, // list of receivers
      subject: "Student details deleted", // Subject line
      text: "Hello world?", // plain text body
      html: htmldelete, // html body
    });
  

    res.status(200).json({message: "Student delete Successfully"})
}
catch (e) {
  res.status(500).json({message:"Internal server error"})
}
}
module.exports = {addStudent, getstudent, updateStudent, deleteStudent, getstudentdetails}