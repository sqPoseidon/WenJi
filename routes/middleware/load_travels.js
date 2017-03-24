var Travels = require('../../data/models/travels');

function loadTravels(req,res,next){
    console.log('加载游记路由中间件');
    console.log(req.params.title);
    Travels.findOne({title:req.params.title},function(err,travel){
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