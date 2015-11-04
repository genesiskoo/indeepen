/**
 * Created by heuneul on 2015-11-04.
 */
var mongoose = require('./config/mongoose_conn');
var Reply = require('./models/Replies');

var postId = 1;
var replyInfo = {
    _writer : 2,
    content : '댓글을 답니다.'
};

Reply.saveReply(postId, replyInfo, function(err, doc){
    console.log(doc);
});


