var express = require('express');
var mongoose = require('./config/mongoose_conn.js');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.post('/test',function(req,res){
    var arr = [];
    var body = req.body.str;
    console.log(body);
    var obj = JSON.parse(body);
    //console.log(obj);
    arr.push(obj);
    res.json(arr);
});

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

app.listen(3000, function () {
    console.log('Test Server @ 3000');
})
