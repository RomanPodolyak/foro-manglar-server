//import mongoose from "mongoose";
var mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  date: Date,
  editDate: Date,
  originalPoster: String,
  theme: String,
  title: String,
  content: String,
});

const post = mongoose.model("Post", postSchema);

module.exports = post;
