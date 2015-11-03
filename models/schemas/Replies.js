var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = require('./Blogs.js');

var replySchema = new Schema({	
	_id : Number,
	post_id : {
		type : Number,
		ref : 'Post'
	},
	_writer : {  // Blog에서 user_id, nick, profile_photo  가져옴
		type : Number,
		ref : 'Blog'
	},
	content : {type : String, trim : true},
    rg_date : {
		type : Date,
        default : Date.now
	},
	is_valid : {
		type : Boolean,
		default : true
	}
}, {versionKey : false});

module.exports = mongoose.model('Reply', replySchema);

		
		
