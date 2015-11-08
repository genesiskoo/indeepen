var express = require('express');

var mongoose = require('./config/mongoose_conn.js');
var fs = require('fs');
var bodyParser = require('body-parser');


var path = __dirname + '/views';

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/posts', require('./routers/Posts.js'));
app.use('/workPosts', require('./routers/WorkPosts'));
app.use('/showPosts', require('./routers/ShowPosts'));
app.use('/postComments', require('./routers/PostComments'));



app.use(require('./routers/web_router.js'));


app.use(function (err, req, res, next) {
    //console.error(err.message);
    console.log(req.method);
    console.log(req.url);
    var msg = {
        code: err.code,
        msg: err.message
    }
    res.status(err.code).json(msg);
});

app.listen(3333, function () {
    console.log('Server @ 3333');
})
