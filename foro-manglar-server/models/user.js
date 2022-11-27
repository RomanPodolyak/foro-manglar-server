// import mongoose from "mongoose";
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const timestamps = require('mongoose-timestamp')

const { Schema } = mongoose

const UserSchema = new Schema({
  username: String,
  enabled: Boolean,
  userType: String,
  email: String,
  description: String,
  userConfig: {
    hideNsfwImages: Boolean,
    darkTheme: Boolean
  }
})

UserSchema.plugin(passportLocalMongoose)
UserSchema.plugin(timestamps)

const User = mongoose.model('User', UserSchema)

module.exports = User
