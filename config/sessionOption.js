/**
 * Created by Moon Jung Hyun on 2015-11-12.
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessionStoreOptions = {
    url : 'mongodb://52.192.126.247:3000/session'
};

var sessionOptions = {
    secret : 'Secret Key',
    resave : false,
    saveUninitialized : false,
    //cookie:{maxAge : 60000},   // expire
    store : new MongoStore(sessionStoreOptions)
};

module.exports = sessionOptions;