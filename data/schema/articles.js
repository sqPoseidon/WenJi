var mongoose = require('mongoose');

var ArticlesSchema = mongoose.Schema({
/*
ID：文章编号
author：作者
time：时间
title：标题
body：正文
rate：推荐指数
*/    

    author:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        'default':Date.now
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    rate:{
        type:Number,
        'enum':[1,2,3,4,5]
    }
});
ArticlesSchema
    .pre('save',function(next){
        this.time = undefined;
        next();
    });
module.exports = ArticlesSchema;