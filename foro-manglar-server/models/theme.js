//import mongoose from "mongoose";
var mongoose = require('mongoose');

const { Schema } = mongoose;

const themeSchema = new Schema({
    type: String,
	date: Date,
	originalPoster: String,
	title: String,
	content: String,
});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
