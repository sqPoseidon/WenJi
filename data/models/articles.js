var mongoose = require('mongoose');
var ArticlesSchema = require('../schema/articles');
var Articles = mongoose.model('Articles',ArticlesSchema);
module.exports = Articles;