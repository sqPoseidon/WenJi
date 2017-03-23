var mongoose = require('mongoose');
var NewsSchema = require('../schema/news');
var News = mongoose.model('News',NewsSchema);
module.exports = News;