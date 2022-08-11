const { string } = require('joi');
const mongoose = require('mongoose');


const schema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10
    },
    class:{
        type: String,
        required: true,

    },
    address: {
        type: String,
        required: true
    }, 
    isDeleted: {
        type: Boolean,
        default: false

    },
    image: {
        type: String,
        required: true
    }
})

const StudentDetails = mongoose.model('Student', schema);

module.exports = StudentDetails