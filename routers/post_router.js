/**
 * Created by heuneul on 2015-11-04.
 */

var express= require('express');
var router = express.Router();

var Post = require('../controllers/Posts.js');

router('/post/works')
    .get(getWorkPosts);

router('/post/work')
    .post(addWorkPost);

router.get('/posts/shows',Post.getShowPosts);

module.exports = router;