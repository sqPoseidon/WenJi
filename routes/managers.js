var isManager = require('./middleware/is_manager');
var Managers = require('../data/managers.json');

module.exports = function(app){
    app.get('/managers',function(req,res,next){
        res.redirect('managers/login');
    })

    app.get('/managers/login',function(req,res,next){
        res.render('managers/login');
    });

    app.post('/managers/login',function(req,res,next){
        if(Managers[req.body.managerID] &&
        Managers[req.body.managerID].password === req.body.password){
            req.session.manager = Managers[req.body.managerID];
            res.redirect('/managers/main');
        } else {
            res.redirect('/managers/login');
        }
    });

    app.get('/managers/main',isManager,function(req,res,next){
        res.render('managers/main');
    });
}

/*
        Manager.findOne({managerID:req.body.managerID,password:req.body.password},function(err,manager){
            if(err) return next(err);
            if(manager){
                req.session.manager = manager;
                res.redirect('/managers/main');
            } else {
                res.redirect('/managers');
            }
        });*/