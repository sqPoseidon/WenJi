function restrictUserToSelf(req,res,next){
    if(!req.session.user || req.session.user.phone!==req.user.phone){
        res.send('Unauthorized',401);
    } else {
        next();
    }
}

module.exports = restrictUserToSelf;