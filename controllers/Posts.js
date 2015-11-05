/**
 * Created by heuneul on 2015-11-04.
 */

var Post = require('../models/Posts');

var userKey = 1; // session에 있을 정보
var blogKey = 1; // session에 있을 정보

/*
    예술 콘텐츠 저장
// */
//module.exports.addWorkPost = function(req, res, next){
//    var blogId = req.body.blog
//}
//
//module.exports.getWorkPosts = function(req, res, next){
//
//}
//
//module.exports.getWorkPostDetailInfo = function(req, res, next) {
//
//}

/*
 문화 컨텐츠 저장
 */
//
//module.exports.addShowPost = function(req, res, next){
//    var blogId = req.body.blog
//    console.log('addShowPost');
//}

module.exports.getShowPosts = function(req, res, next){
    Post.findShowPosts(function(err,docs){

        res.render('shows',{shows : docs});
    });
}

//module.exports.getShowPostDetailInfo = function(req, res, next){
//    console.log('getShowPostDetailInfo');
//}
