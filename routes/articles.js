var async = require('async');
var Articles = require('../data/models/articles');
var loggedIn = require('./middleware/logged_in');
var loadArticles = require('./middleware/load_articles');
var isManager = require('./middleware/is_manager');
module.exports = function(app){
    //默认文章路由（用户使用）
    app.get('/articles/user',loggedIn,function(req,res,next){
        async.parallel([
            function(next){
                Articles.count(next);
            },
            function(next){
                Articles.find({})
                .sort({time:-1,rate:-1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var articles = results[1];
            res.render('articles/user/list',{
                articles:articles
            });
        }
        );
    });
    //管理员文章路由
    app.get('/articles/manager',isManager,function(req,res,next){
        async.parallel([
            function(next){
                Articles.count(next);
            },
            function(next){
                Articles.find({})
                .sort({time:-1,rate:-1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var articles = results[1];
            res.render('articles/manager/list',{
                articles:articles
            });
        }
        );
    });
    //用户文章详情路由
    app.get('/articles/user:_id',loggedIn,loadArticles,function(req,res,next){
        res.render('articles/user/detail',{article:req.article});
    });
    //新建文章路由
    app.get('/articles/manager/new',isManager,function(req,res,next){
        res.render('articles/manager/new');
    });
    //提交新建文章
    app.post('/articles/manager',isManager,function(req,res,next){
        Articles.create(req.body,function(err){
            if(err){
                if(err.code===11000){
                    res.send('Conflict',409);
                } else {
                    next(err);
                }
                return;
            }
            res.redirect('/articles/manager');
        });
    });
    //管理员文章详情路由
    app.get('/articles/manager:_id',isManager,loadArticles,function(req,res,next){
        console.log(req.article);
        res.render('articles/manager/detail',{article:req.article});
    });
    //删除文章路由
    app.del('/articles/manager:_id',isManager,loadArticles,function(req,res,next){
        req.article.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/articles/manager');
        });
    });
}