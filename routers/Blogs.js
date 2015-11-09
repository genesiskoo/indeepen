/**
 * Created by Moon Jung Hyun on 2015-11-09.
 */

var express = require('express');
var router = express.Router();
var Blog = require('./../controllers/Blogs');

router.get('/:blogId/myFans', Blog.getFansOfBlog);
router.get('/:blogId/myArtists', Blog.getArtistsOfBlog);

router.get('/:blogId/iMissYou', Blog.getiMissYous);
router.post('/:blogId/iMissYou', Blog.addiMissYou);

// 이 router 는 무조건 마지막에 있어야 함....
router.put('/:blogId/:fanStatus', Blog.changeFanOfBlog);

module.exports = router;
