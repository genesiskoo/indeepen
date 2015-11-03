/**
 * Created by heuneul on 2015-11-03.
 */
var express = require('express');
var router = express.Router();

var reply = require('../controllers/Replies.js');


router.get('/reply/:id', getReplies)
    .post('/reply/:id', function(req, res){
        var id = req.params.id;
        var writer = req.body.writer;
        var content = req.body.content;
        var replyInfo = {
            post_id : id,
            _writer : writer,
            content : content
        }
        reply.saveReply(replyInfo, function(err, doc){
            res.redirect('/reply/'+id);
        });
    });

function getReplies(req, res){
    var id = req.params.id;
    reply.findReplies(id, function(err, docs){
        var data = {
            replies : docs
        }
        res.render('add_reply', data);
    })
}


module.exports = router;