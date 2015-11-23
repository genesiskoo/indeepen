/**
 * Created by Moon Jung Hyun on 2015-11-22.
 */

var async = require('async');
var Comment = require('./../models/Comments');

/**
 *
 * @param req
 * @param res
 * @param type
 * @param sessionId
 * @param docs
 */
module.exports.findPostsVerPostList = function(req,res, type, sessionId, docs){
    console.log('seesionId ', sessionId);
    var order = 0;
    var posts = [];
    async.each(docs, function(doc, callback){
        var tmp ={
            seq : (order++),
            postInfo : doc
        };
        Comment.countCommentsOfPost(doc._id, function(err, count){
            if(err){
                console.error('ERROR COUNT COMMENTS ', err);
                var error = new Error('댓글 개수를 셀 수 없습니다.');
                error.code = 400;
                return next(error);
            }
            tmp['commentCnt'] = count;
            Comment.findLast2Comments(doc._id, function(err, docs){
                if(err){
                    console.error('ERROR FIND LAST 2 COMMENTS ', err);
                    var error = new Error('최신 댓글 2개를 가져오는데 실패했습니다.');
                    error.code = 400;
                    return next(error);
                }
                tmp['comments'] = docs.reverse();
                //console.log('final workPost ', tmp);
                posts.push(tmp);
                callback();
            });
        });
    }, function(err){
        if(err){
            var error = new Error('error at async each');
            error.code = 400;
            return next(error);
        }
        if(type == 2)
            req.session[sessionId] = docs.splice(-1)[0]._id;
        posts.sort(function(a, b){
            return a.seq - b.seq;
        });
        var msg = {
            code : 200,
            msg : 'Success',
            result : posts
        };
        res.status(msg.code).json(msg);
    });
};
/**
 * 사진 한개 리스트로 응답하기
 * @param req
 * @param res
 * @param sessionId
 * @param docs
 */
module.exports.findWorkPostsVerOnePictureList = function(req, res, sessionId, docs){
    console.log('seesionId ', sessionId);
    async.each(docs, function(doc, callback){
        doc.resources = doc.resources[0];
        callback();
    }, function(err){
        if(err){
            console.error('ERROR AFTER GETTING POSTS BY HASH TAG', err);
            var error = new Error('post by hash tag each 하는데 실패...');
            error.code = 400;
            return next(error);
        }
        req.session[sessionId] = docs.slice(-1)[0]._id;
        var msg = {
            code : 200,
            msg : 'Success',
            result : docs
        };
        res.status(msg.code).json(msg);
    });
};

/*


function uploadImageAndThumbnail(file, uploadInfo, callback) {

    var fileUrl = {};

    var order = 0;
    var timestamp = new Date().getTime();
    var extname = pathUtil.extname(file.name); //확장자

    var fileName = uploadInfo.qemail + '_' + timestamp + '_' + (order++) + extname; //파일명
    var contentType = file.type;
    var filePath = file.path;
    console.log('filePath',filePath);
    console.log('contentType',contentType);
    var readStream = fs.createReadStream(file.path);

    async.waterfall([
        // step1. 원본이미지 올리기, 이미지 경로 call보내기
        function(waterfall_callback){
            console.log('뭐지');
            //contentType -image, audio 여부 확인 후 s3경로 설정
            var  itemKey = 'Data/' + 'image/' + fileName;

            var params = {
                Bucket: bucketName,
                Key: itemKey,
                ACL: 'public-read',
                Body: readStream,
                ContentType: contentType
            }

            S3.putObject(params, function (err, data) {
                if (err) {
                    console.error('S3 Putobject Error', err);
                    waterfall_callback(err);
                } else {
                    var Q_fileUrl = S3.endpoint.href + bucketName + '/' + itemKey;
                    console.log('Q_fileUrl ', Q_fileUrl);
                    fileUrl.url = Q_fileUrl;
                    console.log('fileUrl',fileUrl);
                    waterfall_callback(null, fileUrl);
                }
            })

        },
        // step2. 썸네일 만들기, 올리기/ 경로
        function(fileUrl, callback){

            console.log('썸네일로 넘어오시나요 ?');
            var th_fileName = 'th_' + fileName; // 썸네일 파일명
            var th_filePath = uploadDir + '/' + th_fileName;
            console.log('filePaht',filePath);
            console.log('th_filePath',th_filePath);

            easyimage.thumbnail({
                src: filePath,
                dst: th_filePath,
                width : 215.5,
                height : 304
            }).then(function(image){
                console.log('요기오세요?');
                var th_itemKey = 'Data/' + 'image/' + 'thumbnail/' + th_fileName;
                var th_readStream = fs.createReadStream(th_filePath);

                var params = {
                    Bucket: bucketName,
                    Key: th_itemKey,
                    ACL: 'public-read',
                    Body: th_readStream,
                    ContentType: contentType
                }

                S3.putObject(params, function (err, data) {
                    if (err) {
                        console.error('S3 Putobject Error', err);
                        callback(err);
                    } else {
                        var Q_th_fileUrl = S3.endpoint.href + bucketName + '/' + th_itemKey;
                        console.log('th_fileUrl ', Q_th_fileUrl);
                        fileUrl.thurl = Q_th_fileUrl;
                        console.log('fileUrl?', fileUrl);
                        callback();
                    }
                });
            },function(err){
                console.log('err',err);
            });
        }, function(err){
            console.log('err',err);
            if(err){
                console.error('uploadImageAndThumbnail err',err);
            }
            console.log('uploadImageAndThumbnail success?');
            callback(null, fileUrl);
        }
    ]);
}

//Audio
function uploadAudio(file, uploadInfo, callback) {

    var fileUrl = {};

    var order = 0;
    var timestamp = new Date().getTime();
    var extname = pathUtil.extname(file.name); //확장자

    var fileName = uploadInfo.qemail + '_' + timestamp + '_' + (order++) + extname; //파일명
    var contentType = file.type;
    var readStream = fs.createReadStream(file.path);

    console.log('뭐지');
    var itemKey = 'Data/' + 'audio/' + fileName;

    var params = {
        Bucket: bucketName,
        Key: itemKey,
        ACL: 'public-read',
        Body: readStream,
        ContentType: contentType
    }

    S3.putObject(params, function (err, data) {
        if (err) {
            console.error('S3 Putobject Error', err);
            waterfall_callback(err);
        } else {
            var Q_fileUrl = S3.endpoint.href + bucketName + '/' + itemKey;
            console.log('Q_fileUrl ', Q_fileUrl);
            fileUrl.url = Q_fileUrl;
            console.log('fileUrl',fileUrl);
            callback(null, fileUrl);
        }
    });
}
*/
