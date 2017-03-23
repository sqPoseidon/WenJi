var mongoose = require('mongoose');
var coNewsSchema = require('../schema/coNews');
var coNews = mongoose.model('coNews',coNewsSchema);
module.exports = coNews;