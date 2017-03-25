var Articles = require('../../data/models/articles');

function loadArticles(req,res,next){
    console.log("加载文章中间件");
    console.log(req.params._id);
    Articles.findOne({_id:req.params._id},function(err,article){
        if(err){
            return next(err);
        }
        if(!article){
            return res.send('Not Found',404);
        }
        //如果找到匹配的文章，将其赋值给req.article以备路由监听器稍后使用
        req.article = article;
        next();
    });
}

module.exports = loadArticles;