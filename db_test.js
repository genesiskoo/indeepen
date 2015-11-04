/**
 * Created by heuneul on 2015-11-04.
 */
var mongoose = require('./config/mongoose_conn');
var Reply = require('./models/Replies');

var postId = 1;
var replyInfo = {
    _writer : 3,
    content : '그럽니다.......'
};

//Reply.initReply(postId, function(err, doc){
//    console.log(doc);
//});

Reply.saveReply(postId, replyInfo, function(err, doc){
    console.log("?????",doc);
});


