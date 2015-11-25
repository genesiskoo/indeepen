/**
 * Created by Moon Jung Hyun on 2015-11-25.
 */

var FacebookTokenStrategy = require('passport-facebook-token');
var fbConfig  = require('./../fbConfig');

module.exports = new FacebookTokenStrategy(
    {
        clientID : fbConfig.clientID,
        clientSecret : fbConfig.clientSecret,
        profileFields : []
    }
);