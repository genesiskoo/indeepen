/**
 * Created by heuneul on 2015-11-12.
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessionStoreOptions = {
    url : 'mongodb://54.199.219.43:3000/session'
};

var sessionOptions = {
    secret : 'Secret Key',
    resave : false,
    saveUninitialized : false,
    cookie:{maxAge : 60000},   // expire
    store : new MongoStore(sessionStoreOptions)
};

module.exports = sessionOptions;