var async = require('async');
var News = require('../data/models/news');
var Comments = require('../data/models/comments');
var loadUser = require('./middleware/load_user');
var loadNews = require('./middleware/load_news');
var loggedIn = require('./middleware/logged_in');
var isManager = require('./middleware/is_manager');
module.exports = function(app){
    //用户新闻主界面
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
            res.render('news/user/index',{
                news:news,
                user:req.session.user
            });
        }
        );
    });
    //管理员新闻主界面
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
            res.render('news/manager/list',{
                news:news
            });
        }
        );
    })
    //用户新闻详情
    app.get('/news/user/:_id',loggedIn,loadNews,function(req,res,next){
        req.onenews.findComments(function(err,comments){
            if(err) return next(err);
            req.session.news = req.onenews;
            req.session.comments = comments;
            res.render('news/user/detail',{onenews:req.onenews,
            comments:comments});
        });
    });
    //管理员新闻详情界面
    app.get('/news/manager/:_id',isManager,loadNews,function(req,res,next){
        req.onenews.findComments(function(err,comments){
            if(err) return next(err);
            req.session.news = req.onenews;
            req.session.comments = comments;
            res.render('news/manager/detail',{onenews:req.onenews,
            comments:comments});
        });
    });
    //创建新闻
    app.get('/news/manager/create',isManager,function(req,res,next){
        console.log('进入创建新闻路由');
        res.render('news/manager/create');
    });
    //提交新建的新闻
    app.post('/news/manager',isManager,function(req,res,next){
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
    app.del('/news/manager/:_id',isManager,loadNews,function(req,res,next){
        req.new.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/news/manager');
        });
    });
}

/*
    //删除新闻路由
    app.get('/news/manager/delete',isManager,function(req,res,next){
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
            res.render('news/manager/delete',{news:news});
        }
        );
    })
*/