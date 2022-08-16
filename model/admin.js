const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const schma = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        trim: true,
        lowercase: true

    },
    password: {
        type: String,
        require: true,
       
      
    }
})

schma.pre('save', function(next){
    const admin = this;
    if(!admin.isModified('password'))return next()

    bcrypt.genSalt(10, function(err, salt) {

        if(err) return next(err);

        bcrypt.hash(admin.password, salt, function(err, hash){
            if(err) return next(err)
            admin.password = hash;
            next()
        })

    })
})

schma.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
};
const Admin = mongoose.model('Admin', schma)
module.exports = Admin