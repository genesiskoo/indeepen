/**
 * Created by Moon Jung Hyun on 2015-11-06.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Blog = require('./Blogs');

var commentSchema = new Schema({
    _post : {
        type : Schema.Types.ObjectId,
        ref : 'Post',
        index : true
    },
    _writer : {  // Blog에서 _user, nick, profile_photo  가져옴
        type : Schema.Types.ObjectId,
        ref : 'Blog'
    },
    content : {type : String, trim : true},
    createAt : {
        type : Date,
        default : Date.now
    }
}, {versionKey : false});

commentSchema.statics = {
    /**
     * comment 저장하기
     * @param postId
     * @param writer
     * @param content
     * @param callback
     */
    saveComment : function(postId, writer, content, callback){
        var commentInfo = {
            _post : postId,
            _writer : writer,
            content : content
        };
        this.create(commentInfo, callback);
    },
    /**
     * 해당 post에 대한 댓글 모두 삭제하기
     * @param postId
     * @param callback
     */
    removeComments : function(postId, callback){
        this.remove({_post : new ObjectId(postId)}, callback);
    },
    /**
     * 특정 comment 한개 삭제하기
     * @param commentId
     * @param callback
     */
    removeComment : function(commentId, callback){
        this.remove({_id : new ObjectId(commentId)}, callback);
    },
    /**
     * 해당 post의 comment 개수 세기
     * @param postId
     * @param callback
     */
    countCommentsOfPost : function(postId, callback){
        this.where('_post', new ObjectId(postId)).count(callback);
    },
    /**
     * 해당 post의 가장 최신 comment 2개 가져오기
     * @param postId
     * @param callback
     */
    findLast2Comments : function(postId, callback){
        this.find({_post : new ObjectId(postId)}, {_writer : 1, content : 1}).
            sort({createAt : -1}).
            limit(2).
            populate('_writer', '-_id -_user -type -bgPhoto -intro -profilePhoto -fans -location -createAt -updateAt -isActivated').
            exec(callback);
    },
    /**
     * 해당 post의 comments 가져오기
     * @param postId
     * @param callback
     */
    findCommentsOfPost : function(postId, callback){
        this.find({_post : new ObjectId(postId)}, {_id : 1, _writer : 1, content : 1, createAt : 1}).
            sort({createAt : -1}).
            populate('_writer', '-type -bgPhoto -intro -fans -location -createAt -updateAt -isActivated').
            exec(callback);
    }
};

module.exports = mongoose.model('Comment', commentSchema);