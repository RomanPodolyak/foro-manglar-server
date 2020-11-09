// import mongoose from "mongoose";
const mongoose = require('mongoose')

const { Schema } = mongoose

const commentSchema = new Schema({
  date: Date,
  editDate: Date,
  originalPoster: String,
  post: String,
  title: String,
  content: String
})

const comment = mongoose.model('Comment', commentSchema)

module.exports = comment
