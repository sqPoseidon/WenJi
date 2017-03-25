function loggedIn(req,res,next){
    if(!req.session.user&&!req.session.manager){
        res.redirect('/');
        //res.send('Forbidden. Please log in first',403);
    } else {
        next();
    }
} 
module.exports = loggedIn;