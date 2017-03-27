var News = require('../data/models/news');
var loggedIn = require('./middleware/logged_in');
var Comments = require('../data/models/comments');
var loadComments = require('./middleware/load_comments');
var loadNews = require('./middleware/load_news');
module.exports = function(app){
    //点赞
    app.get('/comments:_id',loggedIn,loadComments,function(req,res,next){
        var id = req.comment._id;
        var num = req.comment.sNum + 1;
        Comments.update({_id:id},{sNum:num},function(err){
            console.log('Comments Update Error!');
        });
        res.redirect('/news');
    });
    //新建评论
    app.get('/comments/newComment',loggedIn,function(req,res){
        res.render('news/user/newComment');
    });
    //提交评论
    app.post('/comments',loggedIn,function(req,res,next){
        var comment = req.body;
        comment.news = req.session.news._id;
        comment.user = req.session.user._id;
        Comments.create(comment,function(err){
            if(err){
                next(err);
                return;
            }
            res.redirect('/news');
        });
    });
}