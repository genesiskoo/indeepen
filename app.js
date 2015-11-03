var express = require('express');
//var postRouter = require('./routers/router_post.js');
//var replyRouter = require('./routers/reply_router.js');
var mongoose = require('./config/mongoose_conn.js');
var fs = require('fs');
var bodyParser = require('body-parser');



var path = __dirname+'/views';

var app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(require('./routers/web_router.js'));
//app.use(replyRouter);
//app.use(postRouter);

app.listen(3000, function(){
    console.log('Server @ 3000');
})

