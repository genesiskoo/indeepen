var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://54.199.219.43:3000/indeepen');
//mongoose.connect('mongodb://localhost:27017/indeepen');

var Post = require('./models/Posts');

// 1st
var showInfo = {
    postType : 1, // 0 문화
    _writer : 1,
    content : '슈퍼스타k7의 윤슬양과 곽푸른하늘양의 공연 많은 관심 부탁드립니다.',
    hashTags : ['깃저주','gitdie'],
    likes : [
        {_user: 1, flag : true},{_user :3, flag :true}
    ],
    show : {
        title : "우리들의 윤곽",
        type : 2, //공연
        tags : [{
            _user: 11 , point : { x : 10, y : 10}
        },{
            _user: 12 , point : { x : 50, y : 10}
        }], // user 11 : 윤슬 user12 : 곽푸른하늘
        startDate: '2015-11-14',
        endDate: '2015-11-14',
        startTime : '19:30',
        endTime : '20:00',
        fee : 15000,
        location : {
            point : { coordinates :[37.555483,126.929186] },
            address : '서울특별시 마포구 서교동 326-18'
        }
    },//show-end

    resources : [{
        type : 0, //이미지
        originalPath : '/contents/images/show01.jpg',
        thumbnailPath : '/contents/images_thumbnail/show01.jpg'
    },{
            type : 0,
            originalPath : '/contents/images/2.png',
            thumbnailPath : '/contents/images_thumbnail/2.png'
    }]
};

Post.savePost(showInfo, function(err, doc){
    if(err){
        console.error(err);
        return;
    }
    console.log(doc);
});

//2nd
showInfo = {
    postType : 1, // 0 문화
    _writer : 1,
    content : '귀여운 고양이!! 야옹야옹~ 카페 시저지에서 함께해요.',
    hashTags : ['고양이','밥주자'],
    likes : [
        {_user: 4, flag : true},{_user :2, flag :true}
    ],
    show : {
        title : "고양이 백여진",
        type : 0, //전시
        tags : [{
            _user: 13 , point : { x : 10, y : 10}
        }],// user 13 백여진
        startDate: '2015-10-05',
        endDate: '2015-11-30',
        fee : 0,
        location : {
            point : { coordinates :[37.608755, 127.057387] },
            address : '서울 성북구 석관동 340-191 카페 시저지'
        }
    },//show-end

    resources : [{
        type : 0, //이미지
        originalPath : '/contents/images/show02.jpg',
        thumbnailPath : '/contents/images_thumbnail/show02.jpg'
    }]
};

Post.savePost(showInfo, function(err, doc){
    if(err){
        console.error(err);
        return;
    }
    console.log(doc);
});

//3th
showInfo = {
    postType : 1, // 0 문화
    _writer : 1,
    content : '싱어송라이터 이여름의 "인디독립책방 소규모순회공연 3번째" 짐프리에서 만나요',
    hashTags : ['이여름','독립책방'],
    likes : [
        {_user: 5, flag : true},{_user :2, flag :true}
    ],
    show : {
        title : "지구인으로 살아가기",
        type : 2, //공연
        tags : [{
            _user: 14 , point : { x : 10, y : 10}
        }],// user 14 이여름
        startDate: '2015-11-20',
        endDate: '2015-11-20',
        startTime : '18:00',
        fee : 0,
        location : {
            point : { coordinates :[37.557066, 126.923531] },
            address : '서울 마포구 동교동 165-8'
        }
    },//show-end

    resources : [{
        type : 0, //이미지
        originalPath : '/contents/images/show03.jpg',
        thumbnailPath : '/contents/images_thumbnail/show03.jpg'
    }]
};

Post.savePost(showInfo, function(err, doc){
    if(err){
        console.error(err);
        return;
    }
    console.log(doc);
});

//4th
showInfo = {
    postType : 1, // 0 문화
    _writer : 1,
    content : '빌리어코스티의 장기공연프로젝트 4번째 비지정 좌석이면 30분 전부터 선착순 입장입니다.',
    hashTags : ['빌리어코스티','빌리'],
    likes : [
        {_user: 5, flag : true},{_user :1, flag :true}
    ],
    show : {
        title : "미세매력주의보 vol.4",
        type : 2, //공연
        tags : [{
            _user: 15 , point : { x : 10, y : 10}
        }],// user 15 빌리어코스티
        startDate: '2015-11-20',
        endDate: '2015-11-20',
        startTime : '18:00',
        fee : 0,
        location : {
            point : { coordinates :[37.557066, 126.923531] },
            address : '서울 마포구 동교동 165-8'
        }
    },//show-end

    resources : [{
        type : 0, //이미지
        originalPath : '/contents/images/show03.jpg',
        thumbnailPath : '/contents/images_thumbnail/show03.jpg'
    }]
};

Post.savePost(showInfo, function(err, doc){
    if(err){
        console.error(err);
        return;
    }
    console.log(doc);
});