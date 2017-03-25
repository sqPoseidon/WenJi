function isManager(req,res,next){
    if(!req.session.manager){
        res.redirect('/managers');
    } else {
        next();
    }
}
module.exports = isManager;