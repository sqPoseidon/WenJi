var mongoose = require('mongoose');
var AntiquesSchema = require('../schema/antiques.js');
var Antiques = mongoose.model('Antiques',AntiquesSchema);

module.exports = Antiques;