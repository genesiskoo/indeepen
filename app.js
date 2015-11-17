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

/*
passport.serializeUser(function(user, done){
    console.log('serializeUser ', user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    console.log('deserializeUser ', user);
    //User.findUser({criteria : {_id : id}}, function(err, user){
    done(null, user);
    //});
});
var User = require('./models/Users');
var Blog = require('./models/Blogs');
var async = require('async');
passport.use( new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    },
    function(email, password, done){
        var options = {
            criteria : {email : email},
            select : '-email -name -provider -authToken -facebook -intro -phone -myArtists -createAt -updateAt -isPublic'
        };
        User.findUser(options, function(err, doc){
            if(err) done(err);
            if(!doc){
                console.log('일치하는 정보 없음');
                return done(null, false, {message : '일치하는 정보가 없습니다.'});
            }
            if(!doc.authenticate(password)){
                console.log('비번 틀림');
                return done(null, false, {message : '일치하는 정보가 없습니다.'});
            }
            Blog.findBlogIdOfUser(doc._id, function(err, blogIds){
                console.log('local.js 에서의 blogIds ', blogIds);
                var artistBlog;
                var spaceBlog = [];
                async.each(blogIds, function(blogId, callback){
                    if(blogId.type == 0){  // artistBlog
                        artistBlog = blogId._id;
                        console.log('artistBlog ', artistBlog);
                    }else{   // spaceBlog
                        spaceBlog.push(blogId._id);
                        console.log('spaceBlog ', spaceBlog);
                    }
                    callback();
                }, function(err){
                    if(err){
                        return done(null, false, {message : '서버 오류..'});
                    }else{
                        var user = {
                            userKey : doc._id,
                            artistBlogKey : artistBlog,
                            spaceBlogKeys : spaceBlog
                        };
                        console.log('user... ', user);
                        return done(null, user);
                    }
                });
            });
        });
    }));
*/


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

/*app.post('/login',
    passport.authenticate('local',{
        successRedirect : '/loginSuc',
        failureRedirect : '/loginFail'
    }));

app.get('/loginSuc', function(req, res){
   console.log('loginSuc', req.user);
});

app.get('/loginFail', function(req, res, next){
    var error = new Error('로그인 실패');
    error.code = 400;
    return next(error);
});*/
require('./routers/TheRest.js')(app, passport);
//app.use();
app.use('/posts', require('./routers/Posts.js'));
app.use('/workPosts', require('./routers/WorkPosts'));
app.use('/showPosts', require('./routers/ShowPosts'));
app.use('/postComments', require('./routers/PostComments'));
app.use('/artistBlogs', require('./routers/ArtistBlogs'));
app.use('/spaceBlogs', require('./routers/SpaceBlogs'));
app.use('/blogs', require('./routers/Blogs'));
app.use('/users', require('./routers/Users'));



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
