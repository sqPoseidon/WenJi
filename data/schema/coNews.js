var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var coNewsSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:'Users',
        required:true
    },
    news:{
        type:ObjectId,
        ref:'News',
        required:true
    },
    title:String,
    time:{
        type:Date,
        'default':Date.now()
    }
});
coNewsSchema
    .pre('save',function(next){
        this.time = undefined;
        next();
    });
module.exports = coNewsSchema;