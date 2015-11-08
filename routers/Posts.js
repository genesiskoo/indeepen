/**
 * Created by Moon Jung Hyun on 2015-11-04.
 */

var express= require('express');
var router = express.Router();

var Post = require('../controllers/Posts.js');

router.get('/', Post.getPosts);



router.get('/shows', Post.getShowPosts);
router.get('/show', Post.getShowAddForm);
router.post('/show', Post.addShowPost);

router.delete('/:postId', Post.deletePost);

router.post('/:postId/reports', Post.reportPost);

router.get('/:postId/comments', Post.getComments);
router.post('/:postId/comments', Post.addComment);

router.put('/:postId/:likeStatus', Post.changeLike);

module.exports = router;

