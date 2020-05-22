const createError = require('http-errors');
const express = require('express');
const firebase = require("firebase");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var indexRouter = require('./routes/index');
var bleRouter = require('./routes/ble');

const firebaseConfig = {
  apiKey: "AIzaSyCfgOZevt5ojBKE1f12zbH30vIVwOjA9QM",
  authDomain: "nunchiboyijo.firebaseapp.com",
  databaseURL: "https://nunchiboyijo.firebaseio.com",
  projectId: "nunchiboyijo",
  storageBucket: "nunchiboyijo.appspot.com",
  messagingSenderId: "1066448612102",
  appId: "1:1066448612102:web:ec5f0034722d5861758c87",
  measurementId: "G-GD1Y77CHWZ"
};
firebase.initializeApp(firebaseConfig);

// express
var app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ble', bleRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// socket.io
app.io = require('socket.io')();

var minor = "";
app.io.on('connection', (socket) => {
  console.log("연결");
    socket.on('login', (data) => { // minor
        console.log(`minor : ${data}`)
        // whoIsOn.push(data) 
        minor = data

        // 아래와 같이 하면 그냥 String 으로 넘어가므로 쉽게 파싱을 할 수 있습니다.
        // 그냥 넘기면 JSONArray로 넘어가서 복잡해집니다.
        var minorJson = `${minor}`
        console.log(minorJson)
    });

    socket.on('say', (data) => {
        console.log(`say msg : ${data}`)
        socket.emit('myMsg', data)
    });

    socket.on('disconnect', () => {
        console.log(`${minor} has left this chatroom ------------------------  `)
    });

    socket.on('logout', () => {
        socket.emit('logout',data);
    });
});

console.log("끝")
module.exports = app;