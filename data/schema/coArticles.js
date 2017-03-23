var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var coArticlesSchema = new mongoose.Schema({
    phone:{
        type:ObjectId,
        ref:'Users',
        required:true
    },
    article:{
        type:ObjectId,
        ref:'Articles',
        required:true
    },
    time:{
        type:Date,
        'default':Date.now
    }
});
coArticlesSchema
    .pre('save',function(next){
        this.time = undefined;
        next();
    });
coArticlesSchema
    .virtual('title')
    .get(function(){
        return this.model('Articles')
                   .find({ID:this.article}).author;
    });
module.exports = coArticlesSchema;