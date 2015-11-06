/**
 * Created by Moon Jung Hyun on 2015-11-04.
 */

var express= require('express');
var router = express.Router();

var Post = require('../controllers/Posts.js');


router.get('/work', Post.showAddWorkPostPage);
router.post('/work', Post.addWorkPost);
router.get('/works', Post.getWorkPosts);

router.get('/shows', Post.getShowPosts);
router.get('/show', Post.getShowAddForm);
router.post('/show', Post.addShowPost);


router.get('/:postId/comments', Post.getComments);
router.post('/:postId/comments', Post.addComment);


module.exports = router;

