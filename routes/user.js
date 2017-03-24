var async = require('async');
var User = require('../data/models/users');
var Articles = require('../data/models/articles');
var News = require('../data/models/news');
var loadUser = require('./middleware/load_user');
var coNews = require('../data/models/coNews');
var coArticles = require('../data/models/coArticles');
var loggedIn = require('./middleware/logged_in');
module.exports = function(app){
  //默认用户信息路由
  app.get('/user',loggedIn,loadUser,function(req,res,next){
    res.render('user/index',{user:req.user});
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
  //用户编辑个人资料路由
  app.get('/user/edit',loggedIn,loadUser,function(req,res,next){
    res.render('user/edit',{user:req.user});
  });
  //用户提交个人信息路由
  app.post('/user',loggedIn,loadUser,function(req,res,next){
    console.log('修改个人资料路由');
    var user = req.body;
    //请求的用户名字段为空
    if(!user.username){
      user.username = req.user.username;
      console.log('填充用户名');
    }
    if(!user.password){
      user.password = req.user.password;
      console.log('填充密码');
    }
    if(!user.email){
      user.email = req.user.email;
      console.log('填充邮件');
    }
    var updated_at = Date.now();
    User.update({phone:user.phone},{
      'username':user.username,
      'password':user.password,
      'email':user.email,
      'updated_at':updated_at
    },function(err){
      console.log('User Information Update Error!');
    });
    var newUser = User.findOne({phone:user.phone});
    req.session.user = newUser;
    res.redirect('/user');
  });
}