/**
 * Created by moonjunghyun on 2015-11-04.
 */

var mongoose = requrie('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var Post = require('./Posts.js');
var User = require('./Users');

autoIncrement.initialize(mongoose);

var reportSchema = new Schema({
    _id : Number,
    _post : {
        type: Number,
        ref: 'Post'
    },
    reports : [{
        _report : {
            type : Number,
            ref : 'User'
        },
        report_date : {
            type : Date,
            default : Date.now
        },
        handle_date : Date
    }]
}, {versionKey : false});

reportSchema.plugin(autoIncrement.plugin, {
    model:'Report',
    startAt : 1
});

module.exports = mongoose.model('Report', reportSchema);
