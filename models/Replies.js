
var Reply = require('./schemas/Replies.js');


/*
 포스트를 저장하면 댓글 초기화 해돠야 함
 */
module.exports.initReply = function(postId, callback){
    Reply.create({_post : postId}, callback);
}

/*
 댓글 저장.
 */
module.exports.saveReply = function(postId, replyInfo, callback){
    Reply.findOneAndUpdate({_post : postId}, {$push : {replies : replyInfo}}, callback);
};

module.exports.findReplies = function(postId, callback)
{
    Reply.find({_post : postId}).
        elemMatch('replies', {is_valid : true}).
        exec(callback);

};
