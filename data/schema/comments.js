var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentsSchema = new mongoose.Schema({
/*
commentID：评论ID
username：用户名
newsID：新闻编号
sNum：点赞数
body：正文
time：时间
*/    
    username:{
        type:ObjectId,
        ref:'Users',
        required:true
    },
    newsID:{
        type:ObjectId,
        ref:'News',
        required:true    
    },
    sNum:{
        type:Number,
        'default':0,
        min:0
    },
    body:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        'default':Date.now,
    }
});
CommentsSchema
    .pre('save',function(next){
        this.time = undefined;
        next();
    });
module.exports = CommentsSchema;