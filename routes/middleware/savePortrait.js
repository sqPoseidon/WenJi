var fs = require('fs');
var multiparty = require('multiparty');
var Users = require('../../data/models/users');
function savePortrait(req,res,next){
    var form = new multiparty.Form({uploadDir:'../../public/images/'});
    form.parse(req,function(err,fields,files){
      var filesTmp = JSON.stringify(files,null,2);
      if(err) {
        console.log('parse error: ' + err);
      } else {
        console.log('parse files: ' + filesTmp);
        var inputFile = files.inputFile[0];
        var uploadedPath = inputFile.path;
        var timestamp = Date.now();
        var dstPath = '../../public/images/' + timestamp + inputFile.originalFilename;
        fs.rename(uploadedPath,dstPath,function(err){
          if(err){
            console.log('rename error: ' + err);
          } else {
            console.log('rename ok');
          }
        });
        Users.update({phone:req.params.user.phone},{
            $set:{portrait:dstPath}},
            function(err){
                console.log('用户头像更新错误');
            });
      };
    });
}
module.exports = savePortrait;