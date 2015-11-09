/**
 * Created by Moon Jung Hyun on 2015-11-09.
 */
var Blog = require('./../models/Blogs');

var userKey = '563ef1ca401ae00c19a15829'; // session에 있을 정보
var blogKey = '563ef1ca401ae00c19a15832'; // session에 있을 정보

/**
 * 공간/개인 블로그의 팬 목록 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getFansOfBlog = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Blog.findFansOfBlog(blogId, function(err, doc){
        if(err){
            console.error('ERROR GETTING FANS OF BLOG ', err);
            var error = new Error('Fans 을 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        console.log('doc ', doc);
        var msg = {
            code : 200,
            msg : 'Success',
            result : doc.fans
        };
        res.status(msg.code).json(msg);
    });
};

/**
 * 공간/개인 블로그의 예술가 목록 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getArtistsOfBlog = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Blog.findArtistsOfUser(blogId, function(err, docs){
        if(err){
            var error = new Error('My artists 를 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        console.log('my artist', docs);
        console.log('cnt ', docs.length);
        var msg = {
            code : 200,
            msg : 'Success',
            result : docs
        };
        res.status(msg.code).json(msg);
    });
};

/**
 * 공간/개인 블로그 팬 신청/취소하기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.changeFanOfBlog = function(req, res, next){
    var blogId = req.params.blogId;
    var fanStatus = req.params.fanStatus;
    if(!blogId || !fanStatus){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    if(fanStatus == 'fan'){
        Blog.pushFanToBlog(blogId, blogKey, function(err, doc){
           if(err){
               console.error('ERROR PUSHING FAN TO BLOG', err);
               var error = new Error('fan을 할 수가 없습니다.');
               error.code = 400;
               return next(error);
           }
            var msg = {
                code : 200,
                msg : 'Success'
            };
            res.status(msg.code).json(msg);
        });
    }else if(fanStatus == 'unfan'){
        Blog.pullFanFromBlog(blogId, blogKey, function(err, doc){
            if(err){
                console.error('ERROR PULLING FAN TO BLOG ', err);
                var error = new Error('fan 취소를 할 수가 없습니다.');
                error.code = 400;
                return next(error);
            }
            var msg = {
                code : 200,
                msg : 'Success'
            };
            res.status(msg.code).json(msg);
        });
    }else{
        var error = new Error('fanStatus is only "fan" or "unfan"');
        error.code =400;
        return next(error);
    }
};

/**
 * 공간/개인 블로그 i miss you 를 한 회원 목록 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getiMissYous = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Blog.findIMissYousOfBlog(blogId, function(err, doc){
        if(err){
           var error = new Error('iMissYous를 가져올 수 없습니다.');
           error.code = 400;
           return next(error);
        }
        console.log('doc ', doc);
        var msg = {
            code : 200,
            msg : 'Success',
            result : doc.iMissYous
        }
        res.status(msg.code).json(msg);
    });
};

/**
 * 공간/개인 블로그 i miss you 저장하기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.addiMissYou = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Blog.isIMissYoued(blogId, blogKey, function(err, doc){
        if(err){
            console.error('ERROR CHECH IS IMISSYOU ', err);
            var error = new Error('iMissYou check 중 오류...');
            error.code = 400;
            return next(error);
        }
        console.log('doc ', doc);
        if(doc){
            var error = new Error('이미 iMissYou를 했습니다.');
            error.code = 400;
            return next(error);
        }else{
            Blog.pushIMissYouToBlog(blogId, blogKey, function(err, doc){
                if(err){
                    console.error('ERROR PUSHING IMISSYOUS ', err);
                    var error = new Error('iMissYou를 할 수 없습니다.');
                    error.code = 400;
                    return next(error);
                }
                console.log(doc);
                var msg = {
                    code : 200,
                    msg : 'Success'
                };
                res.status(msg.code).json(msg);
            });
        }
    });
};