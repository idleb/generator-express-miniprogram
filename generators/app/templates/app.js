const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const multiparty = require('connect-multiparty'); //upload req.files
const config = require('./config');
const models = require('./models');
const crypto = require('crypto');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multiparty());
app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    secret: 'session_' + config.appId,
    domain: config.domain,
    path: '/',
    httpOnly: true,
    maxAge: 5 * 1000
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/api'));
<% if (login) { %>
app.use('/', (req, res, next) => {
  const wxid = req.cookies.wxid || req.query.wxid;
  if (wxid) {
    const decrypt = (str, secret) => {
      const decipher = crypto.createDecipher('aes192', secret);
      let dec = decipher.update(str, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    };
    const secret = config.secret;
    const unionid = decrypt(wxid, secret);
    models.user
      .findOne({ where: { unionid } })
      .then(detail => {
        if (!detail) {
          res.send('请重新登陆小程序');
        } else if (detail.role != 'admin') {
          res.send('没有登陆权限，如需登陆请联系管理员');
        } else {
          req.session.openid = detail.openid;
          res.cookie('wxid', wxid, {
            domain: config.domain,
            path: '/',
            httpOnly: false,
            expires: new Date(Date.now() + 30 * 24 * 3600 * 1000)
          });
          next();
        }
      })
      .catch(() => {
        next();
      });
  } else {
    req.session = null;
    next();
  }
});

app.use('/', (req, res, next) => {
  if (req.session && req.session.openid) {
    next();
  } else {
    res.redirect(
      'https://open.weixin.qq.com/connect/qrconnect?appid=' +
        config.openAppId +
        '&redirect_uri=' +
        encodeURI('https://store.muguokeji.com/auth?redirect' + encodeURI(config.host)) +
        '&response_type=code&scope=snsapi_login'
    );
  }
});
<% } %>
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
