// import mongoose from "mongoose";
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const { Schema } = mongoose

const CommentSchema = new Schema({
  parentPost: String,
  originalPoster: String,
  visible: Boolean,
  content: String
})

CommentSchema.plugin(timestamps)

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
