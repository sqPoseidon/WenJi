var async = require('async');
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var Users = require('../data/models/users');
var Articles = require('../data/models/articles');
var News = require('../data/models/news');
var loadUser = require('./middleware/load_user');
var coNews = require('../data/models/coNews');
var coArticles = require('../data/models/coArticles');
var loggedIn = require('./middleware/logged_in');
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
  app.post('/user/portrait',loggedIn,loadUser,function(req,res,next){
    console.log('在上传图片路由中');
    var imagePath = req.files.file.path;
    var timestamp = Date.now();
    var originalFilename = req.files.file.name;
    console.log(imagePath + '\n' + timestamp + '\n' + originalFilename);
    var dstpath = './public/images/portraits/' + timestamp + originalFilename;
    console.log(dstpath);
    if(!imagePath){
      console.log('FILE ERROR!');
      res.redirect('/user');
    }
    fs.rename(imagePath,dstpath,function(err){
      if(err){
              console.log('rename error: ' + err);
            } 
      else {
              console.log('rename ok');
              Users.update({phone:req.user.phone},{$set:{portrait:dstpath}},function(err){
                console.log(dstpath);
                console.log('用户头像更新错误');
                });
            }
    });
    res.redirect('/user');
    /*
    //生成mulmultiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir:'./public/images/portraits/'});
    //上传完成后处理
    form.parse(req,function(err,fields,files){
      var filesTmp = JSON.stringify(files,null,2);
      if(err){
        console.log('parse error: ' + err);
        return next(err);
      } else {
        console.log('parse files : ' + filesTmp);
        var inputFile = files.inputFile[0];
        var uploadedPath = inputFile.path;
        var timestamp = Date.now();

        var dstPath = './public/images/portraits' + timestamp + inputFile.originalFilename;
        console.log("the uploadPath is :" + uploadedPath);
        console.log("the dstpath is :" + dstPath);
        //重命名为真实文件名
        fs.rename(uploadedPath, dstPath, function(err) {
            if(err){
              console.log('rename error: ' + err);
            } else {
              console.log('rename ok');
            }
        });
        Users.update({phone:req.user.phone},{$set:{portrait:dstPath}},function(err){
          console.log('用户头像更新错误');
        });
      };
    })
    */
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