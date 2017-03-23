var User = require('../../data/models/users');

function loadUser(req,res,next){
    console.log(req.params.username);
    User.findOne({phone:req.params.phone},function(err,user){
        if(err){
            return next(err);
        }
        if(!user){
            return res.send('Not found',404);
        }
        req.user = user;
        next();
    });
}

module.exports = loadUser;