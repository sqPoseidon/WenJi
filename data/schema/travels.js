var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TravelsSchema = new mongoose.Schema({
/*
phone：用户电话
meta：时间
title：标题
body：正文
 */
    phone:{
        type:ObjectId,
        ref:'Users',
        required:true
    },
    created_at:{
        type:Date,
        'default':Date.now,
        set:function(val){
            return undefined;
        }
    },
    updated_at:{
        type:Date,
        'default':Date.now
    },
    title:{
        type:String,
        unique:true,
        required:true
    },
    body:String
});
TravelsSchema
    .pre('save',function(next){
        if(this.isNew){
            this.created_at = undefined;
        }
        this.updated_at = undefined;
        next();
    });

module.exports = TravelsSchema;