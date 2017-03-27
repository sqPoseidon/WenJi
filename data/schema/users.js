var mongoose = require('mongoose');
var emailRegexp = /.+\@.+\..+/;
var phoneRegexp = /^1\d{10}$/;

var UsersSchema = new mongoose.Schema({
/*
username：用户名
password：密码
gender：性别
phone：电话（主键）
email：邮箱
created_at：创建时间
updated_at: 更新时间
 */
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        uppercase:true,
        'enum':['M','F']
    },
    phone:{
        type:String,
        unique:true,
        match:phoneRegexp
    },
    email:{
        type:String,
        match:emailRegexp
    },
    portarit:{
        type:String,
        'default':"C:\Users\QiSun\Desktop\国创\wenji\public\images\portarit.jpg"
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
        'dafault':Date.now
    }
},{
        message:'Validation failed',
        name:'ValidationError',
        errors:{
            email:{
                message:'Validation "regexp" failed for path email',
                name:'ValidationError',
                path:'email',
                type:'regexp'
            },
            phone:{
                message:'Validation "regexp" failed for phone number',
                name:'ValidationError',
                path:'phone',
                type:'regexp'
            }
        }
    }
);
UsersSchema
    .pre('save',function(next){
        if(this.isNew){
            this.created_at = undefined;
        }
        this.updated_at = undefined;
        next();
    });
UsersSchema.methods.coNews = function(callback){
    return this.model('coNews')
    .find({user:this._id})
    .sort({time:1})
    .exec(callback)
};
UsersSchema.methods.coArticles = function(callback){
    return this.model('coArticles')
    .find({user:this._id})
    .sort({time:1})
    .exec(callback)
};
UsersSchema.methods.myTravels = function(callback){
    return this.model('Travels')
    .find({user:this._id})
    .sort({created_at:1})
    .exec(callback);
};
module.exports = UsersSchema;