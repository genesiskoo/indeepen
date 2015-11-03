/**
 * Created by Moon Jung Hyun on 2015-11-02.
 */

var mongoose = require('./config/mongoose_conn.js');
var Reply = require('./controllers/Replies.js');


for(var i=10; i>0; i--){
    Reply.saveReply({
        post_id : 1,
        _writer : 6,
        content : "제발 나도 그랬으면 좋겠다. "+i
    }, function(err, doc){
        console.log(doc);
    });
}

