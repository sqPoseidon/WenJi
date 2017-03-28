var isManager = require('./middleware/is_manager');
var Managers = require('../data/managers.json');
var Users = require('../data/models/users');
var loadUser = require('./middleware/load_user');
var Comments = require('../data/models/comments');
var coArticles = require('../data/models/coArticles');
var coNews = require('../data/models/coNews');
var Travels = require('../data/models/travels');
var managerloadUser = require('./middleware/manager_load_user');
module.exports = function(app){
    app.get('/managers',function(req,res,next){
        res.redirect('managers/login');
    })

    app.get('/managers/login',function(req,res,next){
        res.render('managers/login');
    });

    app.post('/managers/login',function(req,res,next){
        if(Managers[req.body.managerID] &&
        Managers[req.body.managerID].password === req.body.password){
            req.session.manager = Managers[req.body.managerID];
            res.redirect('/managers/main');
        } else {
            res.redirect('/managers/login');
        }
    });

    app.get('/managers/main',isManager,function(req,res,next){
        res.render('managers/main');
    });

    app.get('/managers/allUsers',isManager,function(req,res,next){
        Users.find({},function(err,users){
            if(err) {
                console.log('管理员查看所有用户失败');
                return next(err);
            } else {
                res.render('managers/allusers',{users:users});
            }
        });
    });

    app.get('/managers/userdetail:phone',isManager,managerloadUser,function(req,res,next){
        res.render('managers/userdetail',{user:req.user});
    })

    app.del('/managers/delUser:phone',isManager,managerloadUser,function(req,res,next){
        Comments.remove({user:req.user._id},function(err){
            if(err) {
                console.log('删除用户信息时，删除评论失败');
                return next(err);
            }
        });
        Travels.remove({user:req.user._id},function(err){
            if(err) {
                console.log('删除用户信息时，删除游记失败');
                return next(err);
            }
        });
        coNews.remove({user:req.user._id},function(err){
            if(err) {
                console.log('删除用户信息时，删除收藏新闻失败');
                return next(err);
            }
        });
        coArticles.remove({user:req.user._id},function(err){
            if(err) {
                console.log('删除用户信息时，删除收藏文章失败');
                return next(err);
            }
        });
       req.user.remove(function(err){
            if(err) {
                console.log('删除用户失败');
                return next(err);
            }
        });
        res.redirect('/managers/allUsers');
    });
}

/*
        Manager.findOne({managerID:req.body.managerID,password:req.body.password},function(err,manager){
            if(err) return next(err);
            if(manager){
                req.session.manager = manager;
                res.redirect('/managers/main');
            } else {
                res.redirect('/managers');
            }
        });*/