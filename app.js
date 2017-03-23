
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();
//连接mongodb数据库
var dbURL = 'mongodb://localhost/database';
var db = require('mongoose').connect(dbURL);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.multipart());
app.use(express.cookieParser('my secret string'));
app.use(express.session({
	secret: 'my secret string',
	maxAge: 3600000
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes/articles')(app);
require('./routes/comments')(app);
require('./routes/index')(app);
require('./routes/news')(app);
require('./routes/session')(app);
require('./routes/travels')(app);
require('./routes/user')(app);
require('./routes/antiques')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
