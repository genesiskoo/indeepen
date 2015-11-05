var express = require('express');

var mongoose = require('./config/mongoose_conn.js');
var fs = require('fs');
var bodyParser = require('body-parser');


var path = __dirname + '/views';

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(require('./routers/web_router.js'));
app.use(require('./routers/post_router.js'));
//app.use(replyRouter);
//app.use(postRouter);

app.use(function (err, req, res, next) {
    //console.error(err.message);
    var msg = {
        code: err.code,
        msg: err.message
    }
    res.status(err.code).json(msg);
});

app.listen(3333, function () {
    console.log('Server @ 3333');
})

