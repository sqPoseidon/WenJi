var Antiques = require('../../data/models/antiques');

function loadAntiques(req,res,next){
    console.log('加载文物中间件');
    console.log(req.params.ID);
    Antiques.findOne({ID:req.params.ID},function(err,antique){
        if(err){
            return next(err);
        }
        if(!antique){
            return res.send('Not Found',404);
        }
        req.antique = antique;
        next();
    });
}

module.exports = loadAntiques;