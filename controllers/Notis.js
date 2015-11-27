/**
 * Created by skplanet on 2015-11-24.
 */

var Noti = require('./../models/Notis');

var sender = '564aa1d94287c23c068b95dc'; //결석왕Blog

module.exports.getNotis = function (req, res, next) {
    Noti.findAll(function (err, docs) {
        res.json(docs);
    });
};

module.exports.makeNoti = function (req, res, next) {
    var type = req.body.type;

    var notiInfo = {
        _sender: sender,
        _receiver: req.body.receiver,
        where : {
            type : type
        },
        how: req.body.how
    };
    switch (type) {
        case '1':
        case '2':
            notiInfo.where['_postId'] = '5644187a4ead9a2416e77470'; //슈퍼스타post
            break;
        case '3':
        case '4':
            notiInfo.where['_blogId'] = '564aa1d94287c23c068b95dc'; //문개인블로그
            break;
        case '5':
            //협력제안 준비중
            break;
        default:
        //type에러처리
    }
    Noti.saveNoti(notiInfo, function (err) {
        if (err) {
            console.error('err :',err);
            return;
        }
        var msg = {
            code: 200,
            msg: '알림 입력 성공'
        };
        res.status(msg.code).json(msg);
    });//saveNoti
};

module.exports.checkNoti = function (req, res, next) {
    res.end('checkNotis');
};
