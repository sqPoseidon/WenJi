var mongoose = require('mongoose');

var ManagersSchema = new mongoose.Schema({
    managerID:"admin",
    password:"admin"
});

module.exports = ManagersSchema;