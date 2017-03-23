//未登录中间件
//检查用户当前是否处于“未登录”状态
function notLoggedIn(req,res,next){
    if(req.session.user){
        res.send('Unanthorized',401);
    } else {
        next();
    }
}

module.exports = notLoggedIn;