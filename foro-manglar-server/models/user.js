// import mongoose from "mongoose";
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  username: String,
  enabled: Boolean,
  userType: String,
  email: String,
  creationDate: Date,
  description: String,
  userConfig: {
    hideNsfwImages: Boolean,
    darkTheme: Boolean
  }
})

userSchema.plugin(passportLocalMongoose)

const user = mongoose.model('User', userSchema)

module.exports = user
