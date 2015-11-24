var mongoose = require('mongoose');

var notiSchema = new mongoose.Schema({

	_sender : {
		type : Schema.Types.ObjectId,
		ref : 'Blog'
	},
	_receiver : {
		type: Schema.Types.ObjectId,
		ref : 'User'
	},
	where : {
		type : Number, //// 0 : 위치없음 1 : 문화, 2 : 예술, 3 : 개인 블로그 , 4 : 공간 블로그,  5: 협력제안
		_postId : {type : Schema.type.ObjectId, ref : 'Post'},
		_blogId : {type : Schema.type.ObjectId, ref : 'Blog'}
	},
	how : Number, // 0 : 좋아요, 1: 댓글, 2: 내 팬, 3: imissyou, 4: tag
	isChecked : {
		type : Boolean,
		default : fasle
	},
	createAt : {
		type: Date,
		default: Date.now()
	}
}, { versionKey: false });

notiSchema.statics = {
	findAllById : function (userId, callback){
		this.find({'receiver.user_id': userId })
			 .sort({createAt : -1})
			 .exec(callback);
	},
	saveNoti : function (sender,receiver,callback){
		notiInfo = {
			_sender : new ObjectId(sender),
			_receiver : new ObjectId(receiver),
		};
		this.create(notiInfo,callback);
	}
};

module.exports = mongoose.model('Noti', notiSchema);
