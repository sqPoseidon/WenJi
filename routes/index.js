
/*
 * GET home page.
 */

module.exports = function(app){
  app.get('/',function(req,res,next){
    res.render('index',{title:'WenJi'});
  });
}