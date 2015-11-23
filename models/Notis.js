var mongoose = require('mongoose');

var notiSchema = new mongoose.Schema({

	_id : Number,
	_sender : {
		type : Number,
		ref : 'User'
	},
	date : {
		type : Date,
		default : Date.now
	},
	type : Number, //좋아요, 댓글, 내팬, imissyous, tag, 협력제안
	receiver : {
		user_id : Number,
		post_id : Number,
		content : String // 알림 대표 사진
	},
	isChecked : {
		type : Boolean,
		default : fasle
	},

}, { versionKey: false });

module.exports = mongoose.model('Noti', notiSchema);
