var async = require('async');
var Antiques = require('../data/models/antiques');
var loggedIn = require('./middleware/logged_in');
var loadAntiques = require('./middleware/load_antiques');
var isManager = require('./middleware/is_manager');
module.exports = function(app){
    //默认文物路由（管理员使用）
    app.get('/antiques/manager',isManager,function(req,res,next){
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
            //console.log(antiques);
            res.render('antiques/manager/list',{
                antiques:antiques
            });
        }
        );
    });
    //用户文物查询路由
    app.post('/antiques/user/search',loggedIn,function(req,res,next){
        var keyword = req.body.keyword;
        var query = new RegExp(keyword);
        Antiques.find({name:query})
                .sort({ID:1})
                .exec(function(err,antiques){
                    if(err) return next(err);
                    console.log(antiques);
                    res.render('antiques/user/search',{
                        antiques:antiques
                        });
                });
    });
    //用户文物详情路由
    app.get('/antiques/user:ID',loggedIn,loadAntiques,function(req,res,next){
        res.render('antiques/user/detail',{antique:req.antique});
    });
    //新建文物路由
    app.get('/antiques/manager/new',isManager,function(req,res,next){
        res.render('antiques/manager/new');
    });
    //提交文物路由
    app.post('/antiques/manager',isManager,function(req,res,next){
        console.log(req.body);
        Antiques.create(req.body,function(err){
            if(err){
                if(err.code===11000){
                    res.send('Conflict',409);
                } else {
                    next(err);
                }
                return;
            }
            res.redirect('/antiques/manager');
        });
    });
    //管理员文物详情路由
    app.get('/antiques/manager:ID',isManager,loadAntiques,function(req,res,next){
        //console.log(req.antique);
        res.render('antiques/manager/detail',{antique:req.antique});
    })
    
    //删除文物路由
    app.del('/antiques/manager:ID',isManager,loadAntiques,function(req,res,next){
        req.antique.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/antiques/manager');
        });
    });
}

