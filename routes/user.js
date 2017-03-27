var async = require('async');
var path = require('path');
var fs = require('fs');
var Users = require('../data/models/users');
var Articles = require('../data/models/articles');
var News = require('../data/models/news');
var loadUser = require('./middleware/load_user');
var coNews = require('../data/models/coNews');
var coArticles = require('../data/models/coArticles');
var loggedIn = require('./middleware/logged_in');
var savePortrait = require('./middleware/savePortrait');
module.exports = function(app){
  //默认用户信息路由
  app.get('/user',loggedIn,loadUser,function(req,res,next){
    /*
    //var defaultpath = path.join(__dirname,'../','public/images/portrait.jpg');
    var defaultpath = path.parse('C:\Users\QiSun\Desktop\guochuang\wenji\public\images\portrait.jpg');
    if(req.user.portrait===undefined)
      req.user.portrait = defaultpath;
    var portraitpath = req.user.portrait;
    //console.log(portraitpath);
    //var portrait = fs.createReadStream(portraitpath);
    */
    res.render('user/index',{user:req.user});//,portrait:portraitpath});
  })
  //用户查看收藏的新闻路由
  app.get('/user/coNews',loggedIn,loadUser,function(req,res,next){
     req.user.coNews(function(err,coNews){
       if(err){
         return next(err);
       }
       res.render('user/coNews',{
         user:req.user,
         coNews:coNews
       });
     });
  });
  //用户查看收藏的文章的路由
  app.get('/user/coArticles',loggedIn,loadUser,function(req,res,next){
    console.log(req.user);
    req.user.coArticles(function(err,coArticles){
      if(err){
        return next(err);
      }
      res.render('user/coArticles',{
        user:req.user,
        coArticles:coArticles
      });
    });
  });

  app.get('/user/portrait',loggedIn,loadUser,function(req,res,next){
    res.render('user/portrait');
  });
  app.post('/user/portrait',loggedIn,loadUser,savePortrait,function(req,res,next){
     res.redirect('/user');
  });
  
  //用户编辑个人资料路由
  app.get('/user/editInformation',loggedIn,loadUser,function(req,res,next){
    res.render('user/editInformation',{user:req.user});
  });
  //用户修改密码
  app.get('/user/modifyPassword',loggedIn,loadUser,function(req,res,next){
    res.render('user/modifyPassword',{user:req.user});
  });
  //用户提交个人信息路由
  app.post('/user/information',loggedIn,loadUser,function(req,res,next){
      var user = req.body;
      //请求的用户名字段为空
      if(!user.username){
        user.username = req.user.username;
      }
      if(!user.password){
        user.password = req.user.password;
      }
      if(!user.email){
        user.email = req.user.email;
      }
      Users.update({phone:req.user.phone},{
          $set:{username:user.username,password:user.password,email:user.email}},
          function(err){
          console.log('User Information Updated Error!');
      });
      console.log('用户信息更新完成');
      Users.findOne({phone:req.user.phone},function(err,newUser){
        if(err){
          next(err);
        }
        req.session.user = newUser;
        res.redirect('/user');
      });
  });
}