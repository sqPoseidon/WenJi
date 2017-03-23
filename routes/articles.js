var async = require('async');
var Articles = require('../data/models/articles');

module.exports = function(app){
    //默认文章
    app.get('/articles',function(req,res,next){
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
    app.get('/articles:ID',function(req,res,next){
        res.render('articles/articleDetail',{article:req.article});
    });
    //新建文章
    app.get('/articles/new',function(req,res,next){
        res.render('articles/new');
    });
    //提交新建文章
    app.post('/articles',function(req,res,next){
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
    //删除文章路由
    app.del('/articles:ID',function(req,res,next){
        req.article.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/articles');
        });
    });
}