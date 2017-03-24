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
                   .find({_id:this.article}).title;
    });
module.exports = coArticlesSchema;