var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var coNewsSchema = new mongoose.Schema({
    phone:{
        type:String,
        ref:'Users',
        required:true
    },
    new:{
        type:String,
        ref:'News',
        required:true
    },
    time:{
        type:Date,
        'default':Date.now
    }
});

coNewsSchema
    .pre('save',function(next){
        this.time = undefined;
        next();
    });
coNewsSchema
    .virtual('title')
    .get(function(){
        return this.model('News')
                   .find({ID:this.new}).title;
    });
module.exports = coNewsSchema;