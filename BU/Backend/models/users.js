const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    password: { type: String },
    dob: { type: Date },
    gender: {type: String }
})


module.exports = mongoose.model('Users', usersSchema)