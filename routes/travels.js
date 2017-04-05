var Travels = require('../data/models/travels');
var async = require('async');
var loadUser = require('./middleware/load_user');
var loggedIn = require('./middleware/logged_in');
var loadTravels = require('./middleware/load_travels');
module.exports = function(app){
    //游记默认路由
    app.get('/travels',loggedIn,loadUser,function(req,res,next){
        console.log(req.user.username);
        req.user.myTravels(function(err,travels){
            if(err){
                return next(err);
            }
            req.session.travels = travels;
            res.render('travels/list',{
                user:req.user,
                Travels:travels
            });
        });
    });
    //游记详情
    app.get('/travels/detail:_id',loggedIn,loadUser,loadTravels,function(req,res,next){
        var travel = req.travel;
        res.render('travels/detail',{
            travel:travel
        });
    });
    //编辑游记路由
    app.get('/travels/edit:_id',loggedIn,loadUser,loadTravels,function(req,res,next){
        req.session.travel = req.travel;
        res.render('travels/edit',{travel:req.travel});
    });
    //提交游记编辑信息
    app.post('/travels/edit',loggedIn,loadUser,function(req,res,next){
        var newTravel = req.body;
        if(!newTravel.title) newTravel.title = req.session.travel.title;
        if(!newTravel.text) newTravel.text = req.session.travel.text;
        var time = Date.now();
        Travels.update({_id:req.session.travel._id},{
            $set:{title:newTravel.title,text:newTravel.text,updated_at:time}},
            function(err){
                console.log('Edit Error!');
            });
        res.redirect('/travels');
    })
    //新建游记路由
    app.get('/travels/new',loggedIn,loadUser,function(req,res,next){
        res.render('travels/new');
    });
    //提交新建游记路由
    app.post('/travels/new',loggedIn,loadUser,function(req,res,next){
        console.log(req.body);
        var travel = req.body;
        travel.user = req.session.user._id;
        console.log(travel);
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
    //删除游记路由
    app.del('/travels/del:_id',loggedIn,loadUser,loadTravels,function(req,res,next){
        req.travel.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/travels');
        });
    });
}