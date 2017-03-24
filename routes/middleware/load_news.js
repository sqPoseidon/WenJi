var News = require('../../data/models/news');

function loadNews(req,res,next){
    console.log(req.params.ID);
    console.log(req.params.title);
    News.findOne({ID:req.params.ID},function(err,onenews){
        if(err){
            return next(err);
        }
        if(!onenews){
            return res.send('Not Found',404);
        }
        req.onenews = onenews;
        next();
    });
}
module.exports = loadNews;