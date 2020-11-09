// import mongoose from "mongoose";
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const { Schema } = mongoose

const CommentSchema = new Schema({
  originalPoster: String,
  parentPost: String,
  content: String
})

CommentSchema.plugin(timestamps)

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
