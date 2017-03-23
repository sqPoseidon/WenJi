var mongoose =  require('mongoose');

var NewsSchema = new mongoose.Schema({
/*
ID:编号（主键）
title ：标题
meta：时间
author：作者
body：正文
picture：是否有图片
*/
    ID:{
        type:String,
        unique:true,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        'default':Date.now,
        set:function(val){
            return undefined;
        }
    },
    author:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    picture:[String]
});
NewsSchema
    .pre('save',function(next){
        if(this.isNew){
            this.time = undefined;
        }
        next();
    });
    
module.exports = NewsSchema;
