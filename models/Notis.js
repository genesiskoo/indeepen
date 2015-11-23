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
	where : Number, // 0 : 위치없음 1 : 문화, 2 : 예술, 3 : 개인 블로그 , 4 : 공간 블로그
	how : Number, // 0 : 좋아요, 1: 댓글, 2: 내 팬, 3: imissyou, 4: tag, 5: 협력제안
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
