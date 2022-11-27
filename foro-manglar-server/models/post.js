// import mongoose from "mongoose";
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const { Schema } = mongoose

const PostSchema = new Schema({
  parentTheme: String,
  originalPoster: String,
  visible: Boolean,
  title: String,
  content: String
})

PostSchema.plugin(timestamps)

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
