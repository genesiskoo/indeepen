
/**
 * Created by Moon Jung Hyun on 2015-11-02.
 */

var express = require('express');
var router = express.Router();
var Post = require('./../controllers/Posts.js');

router.get('/post/work/:id', findPost);

function findPost(req, res) {
    var id = req.params.id;
    console.log(id);
    res.setHeader('content-type', 'text/plain;charset=utf-8');
    Post.findPost({_id: id}, function (err, doc) {
         if(err){
             res.end(JSON.stringify({code : 400, msg : '해당 포스트가 없습니다.'}));
         }else {
             //console.log(doc.constructor);
             res.end(JSON.stringify({
                 code: 200,
                 msg: 'SUC',
                 result: {
                     work: doc,
                     replies : doc.replies
                 }
             }));
         }
    });
}


module.exports = router;
