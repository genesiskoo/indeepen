/**
 * Created by Moon Jung Hyun on 2015-11-09.
 */

var express = require('express');
var router = express.Router();
var ArtistBlog = require('./../controllers/ArtistBlogs');

router.get('/:blogId', ArtistBlog.getArtistBlog);

router.get('/:blogId/profilePhoto', ArtistBlog.getArtistBlogProfilePhoto);

router.get('/:blogId/bgPhoto', ArtistBlog.getArtistBlogBgPhoto);

router.get('/:blogId/profile', ArtistBlog.getArtistBlogProfile);

module.exports = router;
