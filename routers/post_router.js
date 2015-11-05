/**
 * Created by heuneul on 2015-11-04.
 */

var express= require('express');
var router = express.Router();

var Post = require('./../controllers/Posts');

//router('/post/works')
//    .get(getWorkPosts);

router.get('/post/work', Post.showAddWorkPostPage);
router.post('/post/work', Post.addWorkPost);

//router('/post/work')
//    .get(Post.showAddWorkPostPage)       //////////////// web 용
//    .post(Post.addWorkPost);

//router('/post/work/:post_id')
//    .get(getWorkPostDetailInfo);

module.exports = router;