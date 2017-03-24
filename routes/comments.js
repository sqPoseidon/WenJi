var News = require('../data/models/news');
var loggedIn = require('./middleware/logged_in');
var Comments = require('../data/models/comments');
var loadComments = require('./middleware/load_comments');
module.exports = function(app){
    //点赞
    app.get('/comments:commentID',loggedIn,loadComments,function(req,res,next){
        var comment = req.comment;
        comment.sNum = comment.sNum + 1;
        var id = req.comment._id;
        var num = req.comment.sNum + 1;
        Comments.update({_id:id},{sNum:num},function(err){
            console.log('Comments Update Error!');
        });
        res.redirect('news/new',{new:req.new,comments:comments});
    });
    //新建评论
    app.get('/comments/newComment',loggedIn,function(req,res){
        res.render('news/newComment');
    });
    //提交评论
    app.post('/comments',loggedIn,loadComments,function(req,res,next){
        var comment = req.body;
        comment.newsID = req.session.new._id;
        comment.username = req.session.user._id;
        Comments.create(comment,function(err){
            if(err){
                next(err);
                return;
            }
            res.redirect('/news');
        });
    });
}