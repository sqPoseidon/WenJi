var mongoose =  require('mongoose');
var ManagersSchema = require('../schema/managers');
var Managers = mongoose.model('Managers',ManagersSchema);
module.exports = Managers;