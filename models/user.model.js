const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name:{type:String},
    email:{type:String,require},
    password:{type:String,require},
    address:{
        street:{type:String},
        city:{type:String},
        state:{type:String},
        country:{type:String},
        zip:{type:String},
    },
})

const UserModel = mongoose.model("user",UserSchema)

module.exports = {UserModel}