var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
var Blog = require('./Blogs.js');
var Post = require('./Posts.js');


var replySchema = new Schema({
    _id : Number,
    _post : {
        type : Number,
        ref : 'Post'
    },
    replies :  [{
        _id : Number,
        _writer : {  // Blog에서 user_id, nick, profile_photo  가져옴
            type : Number,
            ref : 'Blog'
        },
        content : {type : String, trim : true},
        rg_date : {
            type : Date,
            default : Date.now
        }
    }]
}, {versionKey : false});

replySchema.plugin(autoIncrement.plugin, {model:'Reply', startAt : 1});

module.exports = mongoose.model('Reply', replySchema);

		
		
