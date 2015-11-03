var Counters = require('./Counters.js');

var Reply = require('./schemas/Replies.js');

/*
    댓글 저장.
*/
module.exports.saveReply = function(replyInfo, callback){
	Counters.getNextSeq('replies', function(err, seq){
        if(err){
            console.error('ERROR OF GETTING AUTO_INCREMENT : ', err);
            return;
        }
        console.log('next sq : ', seq);
        replyInfo._id = seq.seq;
        Reply.create(replyInfo, callback);
    });
}

module.exports.findReplies = function(postId, callback)
{
    Reply.find({post_id: postId, is_valid: true})
        .populate({
            path: '_writer',
            select: 'user_id nick profile_photo'
        })
        .select({_id : 1, post_id : 1, _writer : 1, content : 1, rg_date : 1})
        .sort({rg_date : 1})
        .exec(callback);
}
