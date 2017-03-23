var mongoose = require('mongoose');
var TravelsSchema = require('../schema/travels');
var Travels = mongoose.model('Travels',TravelsSchema);
module.exports = Travels;