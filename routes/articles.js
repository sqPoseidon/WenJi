var async = require('async');
var Articles = require('../data/models/articles');
var loggedIn = require('./middleware/logged_in');
var loadArticles = require('./middleware/load_articles');
var isManager = require('./middleware/is_manager');
module.exports = function(app){
    //默认文章
    app.get('/articles',loggedIn,function(req,res,next){
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
            res.render('articles/index',{
                articles:articles
            });
        }
        );
    });
    //查看文章详情
    app.get('/articles:_id',loggedIn,loadArticles,function(req,res,next){
        res.render('articles/articleDetail',{article:req.article});
    });
    //新建文章
    app.get('/articles/new',isManager,function(req,res,next){
        res.render('articles/new');
    });
    //提交新建文章
    app.post('/articles',isManager,function(req,res,next){
        Articles.create(req.body,function(err){
            if(err){
                if(err.code===11000){
                    res.send('Conflict',409);
                } else {
                    next(err);
                }
                return;
            }
            res.redirect('/articles');
        });
    });
    //删除文章
    app.get('/articles/del',isManager,function(req,res,next){
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
            res.render('articles/delarticles',{
                articles:articles
            });
        }
        );
    });
    //删除文章路由
    app.del('/articles:_id',isManager,function(req,res,next){
        req.article.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/articles');
        });
    });
}