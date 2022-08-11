var User = require('../model/user')
var jwt = require('jsonwebtoken')
var JOI = require('joi')


async function register(req,res){
  const  schema = JOI.object({
        email:JOI.string().required().lowercase().email(),
        password:JOI.string().required().min(6),
       
    }).options({stripUnknown:true});

    const{value,error} = schema.validate(req.body);
    if(error){
        return res.status(400)
        .json({message:error.details[0].message,status:false})
    }
    const found=await User.findOne({email:value.email}).exec()

    if(found){
        return res
        .status(400)
        .json({message:"User alredy Exist"})
    }
    const user = new User(value)
   await user.save()
  

var token = jwt.sign({}, 'hiiamaju', {subject: user._id.toString(), expiresIn: '30d'});
res
.status(200)
res.json({message:"success",success:"true",token, user})
}


module.exports = {register};