var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Post = require('./Posts');
var Blog = require('./Blogs');
var User = require('./Users');

var notiSchema = new Schema({

    _sender: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    },
    _receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    where: {
        type: {type :Number}, //// 0 : 위치없음 1 : 문화, 2 : 예술, 3 : 개인 블로그 , 4 : 공간 블로그,  5: 협력제안
        _postId: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        _blogId: {
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        }
    },
    how: Number, // 0 : 좋아요, 1: 댓글, 2: 내 팬, 3: imissyou, 4: tag
    isChecked: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
}, {versionKey: false});

notiSchema.statics = {
    findAll : function (callback){
        this.find()
        .exec(callback);
    },
    findAllById: function (userId, callback) {
        this.find({'receiver.user_id': userId})
            .sort({createAt: -1})
            .exec(callback);
    },
    saveNoti: function (notiInfo, callback) {
        console.log(notiInfo);
        return this.create(notiInfo, callback);
    }
};

module.exports = mongoose.model('Noti', notiSchema);
