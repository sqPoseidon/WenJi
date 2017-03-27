//sign in登录 
//sign up注册
var User = require('../data/models/users');
var notLoggedIn = require('./middleware/not_logged_in');
var loadUser = require('./middleware/load_user');
var loggedIn = require('./middleware/logged_in');
module.exports = function(app){
    app.use(function(req,res,next){
        res.locals = req.session;
        next();
    });
    //用户登录
    app.get('/session/signin',notLoggedIn,function(req,res){
        res.render('session/signin',{title:'Sign In'});
    });
    //用户提交登录信息
    app.post('/session/signin',notLoggedIn,function(req,res){
        User.findOne({phone:req.body.phone,
            password:req.body.password},
            function(err,user){
                if(err) return next(err);
                if(user){
                    req.session.user = user;
                    res.redirect('/news');
                } else {
                    res.redirect('/session/signin');
                }
            });
    });
    //用户注册
    app.get('/session/signup',notLoggedIn,function(req,res,next){
        res.render('session/signup',{title:'Sign Up'});
    });
    //用户提交注册信息
    app.post('/session/signup',notLoggedIn,function(req,res,next){
        User.create(req.body,function(err){
            if(err){
                if(err.code===11000){
                    res.send('Conflict',409);
                    res.redirect('/session/signup');
                } else {
                    if(err.name==='ValidationError'){
                        return res.send(Object.keys(err.errors).map(function(errField){
                            return err.errors[errField].message;
                        }).join('. '),406);
                    } else {
                        next(err);
                    }
                }
                return;
            }
            res.redirect('/session/signin');
        })
    });
    //用户退出登录
    app.get('/session/logoff',loggedIn,function(req,res,next){
        req.session.user = null;
        res.redirect('/');
    })
}