const Admin = require('../model/admin');
var jwt = require('jsonwebtoken')
var JOI = require('joi')


async function adminregister(req,res){
   try{ const  schema = JOI.object({
          email:JOI.string().required().lowercase().email(),
          password:JOI.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
          
         
      }).options({stripUnknown:true});
  
      const{value,error} = schema.validate(req.body);
      if(error){
          return res.status(400)
          .json({message:error.details[0].message,status:false})
      }
      const found=await Admin.findOne({email:value.email}).exec()
  
      if(found){
          return res
          .status(400)
          .json({message:"Admin alredy Exist"})
      }
      const admin = new Admin(value)
     await admin.save()
    
  
  var token = jwt.sign({}, 'hiiamaju', {subject: admin._id.toString(), expiresIn: '30d'});
  res
  .status(200)
  res.json({message:"success",success:"true",token, admin})
  }
  catch (e) {
    res.status(500).json({message:"Internal server error"})
  }
}



async function login(req, res){
    try{
    const email = req.body['email']
    const password = req.body['password']

    if(!email || !password){
        return res.status(400)
                   .json({message: 'Email and Password Required'})
    }

    const admin = await Admin.findOne({email}).exec()
    if(!admin){
        return res.status(400)
                  .json({message: "Email or Password Invalid"})
    }

    let isCorrect  = await admin.comparePassword(password)
    if(!isCorrect){
        return res.status(400)
                  .json({message: "Email or Password Invalid"})
    }

    const expiresIn = process.env.JWT_EXPIRY;
    const token = jwt.sign({
        admin: admin
    }, 'hiiamaju', { expiresIn, subject: admin.id, audience: 'admin'}  );

    return res.status(200)
    .json({message: "Data sent sucessfully",token: token,expiresIn: expiresIn, admin: admin})

}
catch (e) {
    res.status(500).json({message:"Internal server error"})
  }
}

module.exports = {login, adminregister}