var express = require('express');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('./config/mongoose_conn.js');
//var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');
var sessionOption = require('./config/sessionOption');
//var path = __dirname + '/views';

// passport serialize / deserialize 설정..
require('./config/passport')(passport);

var app = express();

// session
app.use(session(sessionOption));

// body parser
app.use(bodyParser.urlencoded({extended: false}));

// passport
app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(require('./routers/web_router.js'));

require('./routers/TheRest.js')(app, passport);

app.use('/posts', require('./routers/Posts.js'));
app.use('/workPosts', require('./routers/WorkPosts'));
app.use('/showPosts', require('./routers/ShowPosts'));
app.use('/postComments', require('./routers/PostComments'));
app.use('/artistBlogs', require('./routers/ArtistBlogs'));
app.use('/spaceBlogs', require('./routers/SpaceBlogs'));
app.use('/blogs', require('./routers/Blogs'));
app.use('/users', require('./routers/Users'));
app.use('/search', require('./routers/Search'));


/**
 * error catch
 */
app.use(function (err, req, res, next) {
    //console.error(err.message);
    console.log(req.method);
    console.log(req.url);
    var msg = {
        code: err.code,
        msg: err.message
    };
    console.error('err', err);
    res.status(err.code).json(msg);
});

app.listen(80, function () {
    console.log('Server @ 80');
});
