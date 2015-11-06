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

router.get('/posts/work', Post.showAddWorkPostPage);
router.post('/posts/work', Post.addWorkPost);
router.get('/posts/works', Post.getWorkPosts);

router.get('/posts/shows', Post.getShowPosts);
router.get('/posts/show', Post.getShowAddForm);
router.post('/posts/show', Post.addShowPost);



router.get('/posts/:postId/replies', Post.getReplies);
router.post('/posts/:postId/replies', Post.addReply);


module.exports = router;

