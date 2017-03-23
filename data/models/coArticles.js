var mongoose = require('mongoose');
var coArticelsSchema = require('../schema/coArticles');
var coArticles = mongoose.model('coArticles',coArticelsSchema);
module.exports = coArticles;