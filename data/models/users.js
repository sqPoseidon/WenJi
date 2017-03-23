var mongoose = require('mongoose');
var UsersSchema = require('../schema/users.js');
var Users = mongoose.model('Users',UsersSchema);
module.exports = Users;