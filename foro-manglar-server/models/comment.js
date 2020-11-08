//import mongoose from "mongoose";
var mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
  date: Date,
  editDate: Date,
  originalPoster: String,
  post: String,
  title: String,
  content: String,
});

const comment = mongoose.model("Comment", commentSchema);

module.exports = comment;
