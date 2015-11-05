/**
 * Created by heuneul on 2015-11-03.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var reply = require('../controllers/Reply.js');
var path = __dirname+'/../views';


// menu(home)
router.get('/', function(req, res){
    fs.createReadStream(path+'/menu.html').pipe(res);
});


// reply
router.get('/reply/:post_id', reply.findReplies)
    .post('/reply/:post_id', reply.addReply);


module.exports = router;