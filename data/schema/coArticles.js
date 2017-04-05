var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var coArticlesSchema = new mongoose.Schema({
    user:{
        type:ObjectId,
        ref:'Users',
        required:true
    },
    article:{
        type:ObjectId,
        ref:'Articles',
        required:true
    },
    title:String,
    time:{
        type:Date,
        'default':Date.now()
    }
});
coArticlesSchema
    .pre('save',function(next){
        this.time = undefined;
        next();
    });
module.exports = coArticlesSchema;