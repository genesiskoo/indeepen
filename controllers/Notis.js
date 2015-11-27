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

module.exports.makeNotiForTaggedArtists = function (type, id, receiver, sender, how) {
    //보내는 사람
    var notiInfo = {
        who: sender,
        _receiver: receiver,
        where : id,
        how : how, // 0 : 좋아요, 1: 댓글, 2: 내 팬, 3: imissyou, 4: tag
        what: what // 0 : 위치없음 1 : 문화, 2 : 예술, 3 : 개인 블로그 , 4 : 공간 블로그,  5: 협력제안,
    };

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

