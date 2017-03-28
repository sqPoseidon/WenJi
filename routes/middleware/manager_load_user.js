var User = require('../../data/models/users');

function managerloadUser(req,res,next){
    console.log('管理员加载用户中间件');
    User.findOne({phone:req.params.phone},function(err,user){
        if(err){
            return next(err);
        }
        if(!user){
            return res.send('Not found',404);
        }
        //如果找到了匹配的用户，将其赋值给req.user以备路由监听器在稍后使用
        req.user = user;
        next();
    });
}

module.exports = managerloadUser;