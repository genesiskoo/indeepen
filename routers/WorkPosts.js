/**
 * Created by heuneul on 2015-11-07.
 */
var express = require('express');
var router = express.Router();

var WorkPost = require('./../controllers/WorkPosts');

router.get('/page', WorkPost.showAddWorkPostPage);

router.post('/', WorkPost.addWorkPost);
router.get('/', WorkPost.getWorkPosts);

router.get('/:postId', WorkPost.getWorkPost);
module.exports = router;