var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

var Blog = require('./Blogs');
var Post = require('./Posts');

var replySchema = new Schema({
    _id : Number,
    _post : {
        type : Number,
        ref : 'Post'
    },
    _writer : {  // Blog에서 _user, nick, profile_photo  가져옴
        type : Number,
        ref : 'Blog'
    },
    content : {type : String, trim : true},
    createAt : {
        type : Date,
        default : Date.now
    }
}, {versionKey : false});

replySchema.plugin(autoIncrement.plugin, {model:'Reply', startAt : 1});

module.exports = mongoose.model('Reply', replySchema);

		
		
