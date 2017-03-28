var async = require('async');
var News = require('../data/models/news');
var Comments = require('../data/models/comments');
var loadUser = require('./middleware/load_user');
var loadNews = require('./middleware/load_news');
var loggedIn = require('./middleware/logged_in');
var isManager = require('./middleware/is_manager');
var coNews = require('../data/models/coNews');
module.exports = function(app){
    //用户新闻主界面
    app.get('/news',loggedIn,function(req,res,next){
        async.parallel([
            function(next){
                News.count(next);
            },
            function(next){
                News.find({})
                .sort({_id:-1})
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
                .sort({_id:-1})
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
    app.get('/news/user:_id',loggedIn,loadNews,function(req,res,next){
        req.onenews.findComments(function(err,comments){
            if(err) return next(err);
            req.session.news = req.onenews;
            req.session.comments = comments;
            res.render('news/user/detail',{onenews:req.onenews,
            comments:comments});
        });
    });
    //用户收藏新闻
    app.post('/news/user/collect:_id',loggedIn,loadNews,loadUser,function(req,res,next){
        coNews.create({user:req.user._id,news:req.onenews._id,title:req.onenews.title},function(err){
            if(err){
                console.log('收藏新闻失败');
            }
        });
        res.redirect('/news/user' + req.onenews._id);
    })
    //用户取消收藏新闻
    app.post('/news/user/cancel:_id',loggedIn,loadNews,loadUser,function(req,res,next){
        coNews.remove({user:req.user._id,news:req.onenews._id},function(err){
            if(err) {
                console.log('取消收藏失败');
            } else {
                console.log('取消收藏成功');
            }
        });
        res.redirect('/news/user' + req.onenews._id);
    })
    //创建新闻
    app.get('/news/manager/new',isManager,function(req,res,next){
        console.log('进入创建新闻路由');
        res.render('news/manager/new');
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
    //管理员新闻详情界面
    app.get('/news/manager:_id',isManager,loadNews,function(req,res,next){
        req.onenews.findComments(function(err,comments){
            if(err) return next(err);
            req.session.news = req.onenews;
            req.session.comments = comments;
            res.render('news/manager/detail',{onenews:req.onenews,
            comments:comments});
        });
    });
    

    //删除新闻路由
    app.del('/news/manager:_id',isManager,loadNews,function(req,res,next){
        var onenews = req.onenews;
        req.onenews.remove(function(err){
            if(err){
                return next(err);
            }
        });
        Comments.remove({news:onenews._id},function(req,res,next){
            if(err) {
                console.log('新闻删除失败');
                return next(err);
            }
        })
        coNews.remove({news:onenews._id},function(req,res,next){
            if(err){
                console.log('新闻删除失败');
                return next(err);
            }
        });
        res.redirect('/news/manager');
    });
}