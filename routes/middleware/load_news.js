var News = require('../../data/models/news');

function loadNews(req,res,next){
    console.log('加载新闻中间件');
    console.log(req.params._id);
    News.findOne({_id:req.params._id},function(err,onenews){
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