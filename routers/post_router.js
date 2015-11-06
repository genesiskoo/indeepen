/**
 * Created by heuneul on 2015-11-04.
 */

var express= require('express');
var router = express.Router();

var Post = require('../controllers/Posts.js');

//router('/post/works')
//    .get(getWorkPosts);
//
//router('/post/work')
//    .post(addWorkPost);

router.get('/post/work', Post.showAddWorkPostPage);
router.post('/post/work', Post.addWorkPost);
router.get('/post/works', Post.getWorkPosts);

module.exports = router;

