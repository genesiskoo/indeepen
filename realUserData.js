/**
 * Created by heroKoo on 2015-11-17.
 */

var mongoose = require('./config/mongoose_conn.js');
var Users = require('./models/Users.js');

Users.saveUser({
    email: 'koosha@naver.com',
    password: '1234',
    name: "구재회",
    nick: "재회",
    intro: '서버 예술을 준비중입니다',
    phone: '010-4857-9728'
}, function (err, doc) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' create' + doc);
});

Users.saveUser({
    email: 'moon@naver.com',
    password: '1234',
    name: "문정현",
    nick: "흐늘",
    intro: '서버 예술을 준비중입니다',
    phone: '010-1488-4675'
}, function (err, doc) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' create' + doc);
});

Users.saveUser({
    email: 'junghyen@naver.com',
    password: '1234',
    name: "정현진",
    nick: "인디펀",
    intro: '기획 예술을 준비중입니다',
    phone: '010-0000-000'
}, function (err, doc) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' create' + doc);
});

Users.saveUser({
    email: '201@naver.com',
    password: '1234',
    name: "이영원",
    nick: "201",
    intro: '안드 예술을 준비중입니다',
    phone: '010-0000-000'
}, function (err, doc) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' create' + doc);
});

Users.saveUser({
    email: 'sam2@naver.com',
    password: '1234',
    name: "문새미",
    nick: "sam2",
    intro: '안드 예술을 준비중입니다',
    phone: '010-0000-000'
}, function (err, doc) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' create' + doc);
});

Users.saveUser({
    email: 'hyeyeong2@naver.com',
    password: '1234',
    name: "전혜영",
    nick: "hyeyeong2",
    intro: '으하핳핳핳핳~!!',
    phone: '010-0000-000'
}, function (err, doc) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' create' + doc);
});
