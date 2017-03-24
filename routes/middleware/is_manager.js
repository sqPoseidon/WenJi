function isManager(req,res,next){
    if(!req.session.manager){
        res.direct('/managers');
    } else {
        next();
    }
}
module.exports = isManager;