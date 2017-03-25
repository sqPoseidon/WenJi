var async = require('async');
var News = require('../data/models/news');
var Comments = require('../data/models/comments');
var loadUser = require('./middleware/load_user');
var loadNews = require('./middleware/load_news');
var loggedIn = require('./middleware/logged_in');
var isManager = require('./middleware/is_manager');
module.exports = function(app){
    //新闻主界面
    app.get('/news',loggedIn,function(req,res,next){
        async.parallel([
            function(next){
                News.count(next);
            },
            function(next){
                News.find({})
                .sort({time:1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var news = results[1];
            req.session.news = news;
            res.render('news/index',{
                news:news,
                user:req.session.user
            });
        }
        );
    });

    app.get('/news/manager',isManager,function(req,res,next){
        async.parallel([
            function(next){
                News.count(next);
            },
            function(next){
                News.find({})
                .sort({time:1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var news = results[1];
            req.session.news = news;
            res.render('news/manager',{
                news:news
            });
        }
        );
    })
    //新闻详情
    app.get('/news:_id',loggedIn,loadNews,function(req,res,next){
        req.onenews.findComments(function(err,comments){
            if(err) return next(err);
            req.session.news = req.onenews;
            req.session.comments = comments;
            res.render('news/newsDetail',{onenews:req.onenews,
            comments:comments});
        });
    });
    //创建新闻
    app.get('/news/create',isManager,function(req,res,next){
        res.render('news/create');
    });
    //提交新建的新闻
    app.post('/news',isManager,function(req,res,next){
        News.create(req.body,function(err){
            if(err){
                if(err.code===11000){
                    res.send('Conflict',409);
                } else {
                    next(err);
                }
                return ;
            }
            res.redirect('/news/manager');
        });
    });
    //删除新闻路由
    app.get('/news/del',isManager,function(req,res,next){
        async.parallel([
            function(next){
                News.count(next);
            },
            function(next){
                News.find({})
                .sort({time:1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var news = results[1];
            req.session.news = news;
            console.log(news);
            res.render('news/del',{news:news});
        }
        );
    })
    //删除新闻路由
    app.del('/news/:_id',isManager,loadNews,function(req,res,next){
        req.new.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/news');
        });
    });
}