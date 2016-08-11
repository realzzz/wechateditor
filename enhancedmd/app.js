var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var templatemngr = require('./routes/templatemanager');
var thirdparty = require('./routes/thirdparty');
var template = require('./routes/template');
var manager = require('./routes/manager');

var app = express();

var task_manage = require('./task/task_manage');
var log4js = require('log4js');
var util = require('./util/util');
var config = util.config();

log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {

        "type": "dateFile",
        "filename": config.logfolder + "access.log",
        "pattern": "-yyyy-MM-dd.log",
        "category" : "normal",
        "level" : "LOG"
    }, {
        "type": "file",
        "filename":  config.logfolder + "error.log",
        "pattern": "-yyyy-MM-dd.log",
        "maxLogSize": 2097152,
        "backup": 10,
        "category": "error"
    }, {
        "type": "dateFile",
        "filename":  config.logfolder + "record.log",
        "pattern": "-yyyy-MM-dd.log",
        "category": "record"
    }
  ],
  replaceConsole: true,
  levels: {
        "error":  "error",
        "record" : "trace"
    }
});

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');


// var weixinspider = require('./kcapi/weixinspider');
// weixinspider.getHtml("http://mp.weixin.qq.com/s?src=3&timestamp=1461827180&ver=1&signature=O8C3-xMNAp3o3WJEv6dYgLylpXUV0gyDge3xdYUaEJVPt30KW6M4idCTOCdrqSHTYvvQGFQffzacM1*xwRZEiopvQ25jJcRGAG95b3hJxYq77ewQ05pkUyRZviMLcTAPyzGzamu9CKsfHYnrAv6jnfIS9QunapOPNHVL027djnU=");

app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/business', routes);
app.use('/enhancedmd', routes);
app.use('/users', users);
app.use('/templatemngr', templatemngr);
app.use('/thirdparty', thirdparty);
app.use('/template', template);
app.use('/manager', manager);

task_manage.init();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
