// import mongoose from "mongoose";
const mongoose = require('mongoose')

const { Schema } = mongoose

const themeSchema = new Schema({
  date: Date,
  originalPoster: String,
  title: String,
  content: String
})

const theme = mongoose.model('Theme', themeSchema)

module.exports = theme
