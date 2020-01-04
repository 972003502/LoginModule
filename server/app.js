const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const responseBody = require('./middleware/responseBody');
const boot = require('./boot');
const cache = require('./middleware/cache');
const ticketParser = require('./middleware/ticketParser');
const winston = require('winston');
const expressWinston = require('express-winston');
const history = require('connect-history-api-fallback');

const register = require('./routes/apis/register');
const login = require('./routes/apis/login');
const resetPwd = require('./routes/apis/resetPwd');
const salt = require('./routes/apis/salt');
const userInfo = require('./routes/apis/userInfo');
const auth = require('./routes/apis/auth');
const app = express();

//Setting header befor the Router
app.use(function (req, res, next) {
  res.header('Content-Language', 'zh-cn');
  res.header('Cache-Control', 'no-cache');
  res.header('Access-Control-Allow-Origin', req.headers.origin); // CORS
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '1000');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history({
  index: 'app/index.html'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(responseBody);
app.use(cache);
app.use(ticketParser);


// Log of normal requests
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))

// Router options
app.use('/api/register', register);
app.use('/api/login', login);
app.use('/api/resetPwd', resetPwd);
app.use('/api/salt', salt);
app.use('/api/userInfo', userInfo);
app.use('/api/auth', auth);

// Log of error requests
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
  // res.render('error');
});

// Startup settings
boot();

module.exports = app;
