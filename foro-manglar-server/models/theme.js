// import mongoose from "mongoose";
const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')

const { Schema } = mongoose

const ThemeSchema = new Schema({
  parentTheme: String,
  originalPoster: String,
  title: String,
  description: String
})

ThemeSchema.plugin(timestamps)

const Theme = mongoose.model('Theme', ThemeSchema)

module.exports = Theme
