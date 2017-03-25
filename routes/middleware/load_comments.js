var Comments = require('../../data/models/comments');

function loadComments(req,res,next){
    console.log('加载评论中间件');
    console.log(req.params._id);
    Comments.findOne({_id:req.params._id},function(err,comment){
        if(err){
            return next(err);
        }
        if(!comment){
            return res.send('Not Found',404);
        }
        console.log(comment);
        req.comment = comment;
        next();
    });
}

module.exports = loadComments;