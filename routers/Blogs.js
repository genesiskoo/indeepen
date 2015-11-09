/**
 * Created by Moon Jung Hyun on 2015-11-09.
 */

var express = require('express');
var router = express.Router();
var Blog = require('./../controllers/Blogs');

router.get('/:blogId/myFans', Blog.getFansOfBlog);
router.get('/:blogId/myArtists', Blog.getArtistsOfBlog);

router.put('/:blogId/fan/:fanStatus', Blog.changeFanOfBlog);

module.exports = router;

