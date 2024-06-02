var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // 이 줄을 추가하세요
app.use(bodyParser.urlencoded({ extended: false })); // 이 줄을 추가하세요


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let yoloResults = [];

// Nunjucks 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
});


// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/help', (req, res) => {
  res.render('help.html');
});

app.get('/settings', (req, res) => {
  res.render('settings.html');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// YOLO 결과를 수신하는 엔드포인트
app.post('/yolo-results', (req, res) => {
  const data = req.body;
  console.log("Received YOLO data:", data);

  yoloResults = data.detections.map(detection => detection.name);

  res.status(200).json({ message: "Data received and processed successfully" });
});

// YOLO 결과를 제공하는 엔드포인트
app.get('/yolo-results', (req, res) => {
  res.status(200).json(yoloResults);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error.html');
});

module.exports = app;
