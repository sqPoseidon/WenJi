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
      var user = req.body;
      //请求的用户名字段为空
      if(!user.username){
        user.username = req.user.username;
        console.log('填充用户名');
        console.log(user.username);
      }
      if(!user.password){
        user.password = req.user.password;
        console.log('填充密码');
        console.log(user.password);
      }
      if(!user.email){
        user.email = req.user.email;
        console.log('填充邮件');
        console.log(user.email);
      }
      var username = user.username;
      var password = user.password;
      var email = user.email;
      //var a="xxx",b="yyy";var json="{a:'"+a+"',b:'"+b+"'}";json=eval("("+json+")")
      //var json="{username:\""+username+"\",email:\""+email+"\",password:\""+password+"\"}";
      var json = {"username":username,"email":email,"password":password};
      var newjson = JSON.stringify(json);
      Users.update({phone:req.user.phone},newjson,function(err){
          console.log('User Information Updated Error!');
      });
      var newUser = Users.findOne({phone:req.user.phone});
      req.session.user = newUser;
      res.redirect('/user');
  });
}
/**
 * var user = req.body;
    console.log(req.user);
    if(user.username) req.user.username = user.username;
    if(user.password) req.user.password = user.password;
    if(user.email) req.user.email = user.email;
    var newUser = req.user;
    console.log(newUser);
    req.user.remove(function(err){
      if(err) {
        console.log('删除失败');
        return next(err);
      }
    })
    User.create(newUser,function(err){
      if(err){
        console.log('创建失败');
        return ;
      }
      console.log('修改成功');
      //req.user = newUser;
      req.session.user = newUser;
      console.log(req.session.user);
      //console.log(req.user);
      res.redirect('/user');
    });
 */