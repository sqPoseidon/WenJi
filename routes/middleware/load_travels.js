var Travels = require('../../data/models/travels');

function loadTravels(req,res,next){
    console.log('加载游记路由中间件');
    console.log(req.params._id);
    Travels.findOne({_id:req.params._id},function(err,travel){
        if(err){
            return next(err);
        }
        if(!travel){
            return res.send('Not Found',404);
        }
        req.travel = travel;
        next();
    });
}

module.exports = loadTravels;