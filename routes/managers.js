var isManager = require('./middleware/is_manager');
var Manager = require('../data/models/managers');

module.exports = function(app){
    app.get('/managers',function(req,res,next){
        res.render('managers/index');
    });

    app.post('/managers/login',function(req,res,next){
        Manager.findOne({managerID:req.body.managerID},function(err,manager){
            if(err) return next(err);
            if(manager){
                req.session.manager = manager;
                res.redirect('/managers/main');
            } else {
                res.redirect('/managers');
            }
        });
    });

    app.get('/managers/main',isManager,function(req,res,next){
        res.render('managers/main');
    });
}