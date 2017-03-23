var Travels = require('../data/models/travels');
var async = require('async');

module.exports = function(app){
    //游记默认路由
    app.get('/travels',function(req,res,next){
        //bug
        req.user.myTravels(function(err,travels){
            if(err){
                return next(err);
            }
            res.render('travels/index',{
                user:req.user,
                Travels:travels
            });
        });
        /*async.parallel([
                function(next){
                    Travels.count(next);
            },
            function(next){
                Travels.find({phone:erq.user.phone})
                .sort({created_at:-1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var travels = results[1];
            res.render('travels/index',{
                user:req.user,
                Travels:travels
            });
        }
        ); */
    });
    //按名称访问游记详情
    app.get('/travels:title',function(req,res,next){
        var travel = req.travel;
        res.render('travels/detail',{
            travel:travel
        });
    });
    //新建游记路由
    app.get('/travels/new',function(req,res,next){
        res.render('travels/new');
    });
    //提交新建游记路由
    app.post('/travels',function(req,res,next){
        var travel = req.body;
        travel.phone = req.session.user.phone;
        Travels.create(travel,function(err){
            if(err){
                if(err.code===11000) {
                    res.send('Conflict',409);
                } else {
                    next(err);
                }
                return;
            } 
            res.redirect('/travels');
        });
    });
    //删除游记
    app.get('/travels/del',function(req,res,next){
        req.user.myTravels(function(err,travels){
            if(err){
                return next(err);
            }
            res.render('travels/del',{
                Travels:travels
            });
        });
    });
    //删除游记路由
    app.del('/travels:title',function(req,res,next){
        req.travel.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/travels');
        });
    });
}