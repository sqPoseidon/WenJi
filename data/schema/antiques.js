var mongoose = require('mongoose');

var AntiquesSchema = new mongoose.Schema({
/*
ID：文物ID
name：姓名
country：所属国家
era：所属年代
category：所属类别
value：价值
location：现存地
detail：其他细节
*/    
    ID:{
        type:String,
        unique:true  
    },
    name:{
        type:String,
        required:true
    },
    country:String,
    era:String,
    category:String,
    value:String,
    location:String,
    detail:String
});
module.exports = AntiquesSchema;