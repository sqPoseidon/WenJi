var mongoose = require('mongoose');
var CommentsSchema = require('../schema/comments');
var Comments = mongoose.model('Comments',CommentsSchema);
module.exports = Comments;