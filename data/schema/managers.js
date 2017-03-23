var mongoose = require('mongoose');

var ManagersSchema = new mongoose.Schema({
    managerID:{
        type:String,
        unique:true
    },
    password:String
});

module.exports = ManagersSchema;