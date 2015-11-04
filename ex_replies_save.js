/**
 * Created by Moon Jung Hyun on 2015-11-02.
 */

var mongoose = require('./config/mongoose_conn.js');
var Reply = require('./models/Replies.js');


for(var i=10; i>0; i--){
    Reply.saveReply({
        _post : 1,
        _writer : 6,
        content : "제발 나도 그랬으면 좋겠다. "+i
    }, function(err, doc){
        if(err){
            console.error(err);
        }
        console.log(doc);
    });
}

