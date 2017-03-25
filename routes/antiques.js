var async = require('async');
var Antiques = require('../data/models/antiques');
var loggedIn = require('./middleware/logged_in');
var loadAntiques = require('./middleware/load_antiques');
var isManager = require('./middleware/is_manager');
module.exports = function(app){
    //默认文物路由
    app.get('/antiques',isManager,function(req,res,next){
        async.parallel([
            function(next){
                Antiques.count(next);
            },
            function(next){
                Antiques.find({})
                    .sort({ID:1})
                    .exec(next);
            }
        ],
        function(err,results){
            if(err){
                return next(err);
            }
            var antiques = results[1];
            res.render('antiques/index',{
                antiques:antiques
            });
        }
        );
    });
    //文物查询路由
    app.get('/antiques/search',loggedIn,function(req,res,next){
        var keyword = req.keyword;
        async.parallel([
            function(next){
                Antiques.count(next);
            },
            function(next){
                Antiques.find({name:/keyword/})
                .sort({ID:1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var antiques = results[1];
            res.render('antiques/search',{
                antiques:antiques
            });
        }
        );
    });
    //文物详情路由
    app.get('/antiques:ID',loggedIn,loadAntiques,function(req,res,next){
        res.render('antiques/detail',{antique:req.antique});
    });
    //新建文物路由
    app.get('/antiques/new',isManager,function(req,res,next){
        res.render('antiques/new');
    });
    //提交文物路由
    app.post('/antiques',isManager,function(req,res,next){
        Antiques.create(req.body,function(err){
            if(err){
                if(err.code===11000){
                    res.send('Conflict',409);
                } else {
                    next(err);
                }
                return;
            }
            res.redirect('/antiques');
        });
    });
    //删除文物
    app.get('/antiques/del',isManager,function(req,res,next){
        res.render('antiques/del',{antiques:req.antiques});
    });
    //删除文物路由
    app.del('/antiques:ID',isManager,function(req,res,next){
        req.antique.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/antiques');
        });
    });
}