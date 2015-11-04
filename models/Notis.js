var mongoose = require('mongoose');

var notiSchema = new mongoose.Schema({

	_id : Number,
	sender : {
		user_id : Number,
		nick : {type : String, trim : true},
		profile_photo : String
	},
	date : {
		type : Date,
		default : Date.now
	},
	type : Number,
	receiver : {
		user_id : Number,
		post_id : Number,
		content : String // 알림 대표 사진
	},
	is_checked : {
		type : Boolean,
		default : fasle
	},

}, { versionKey: false });

module.exports = mongoose.model('Noti', notiSchema);