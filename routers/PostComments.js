/**
 * Created by Moon Jung Hyun on 2015-11-07.
 */

var express = require('express');
var router = express.Router();
var PostComment = require('./../controllers/PostComments');

router.delete('/:commentId', PostComment.deleteComment);

module.exports = router;
