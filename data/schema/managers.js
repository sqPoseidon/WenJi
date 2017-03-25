var mongoose = require('mongoose');

var ManagersSchema = new mongoose.Schema({
    managerID:{
        type:String,
        'default':"admin"
    },
    password:{
        type:String,
        'default':"admin"
    }
});
module.exports = ManagersSchema;