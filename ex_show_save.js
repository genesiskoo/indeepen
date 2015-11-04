var express = require('express');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://54.199.219.43:3000/indeepenkoo');
mongoose.connect('mongodb://localhost:27017/indeepenkoo');

var Post = require('./models/Posts');

var showInfo = {
    post_type : 0,
    _writer : 1,
    content : '내 작업물들이다',
    hash_tags : ['깃저주','gitdie'],
    likes : [
        {_user: 1, flag : true},{_user :3, flag :true}
    ],
    show : {
        type : 2, //공연
        tags : [{
            _user: 11
        }],
        start_date: '2015-11-04',
        end_date: '2015-11-07',
        start_time : '18:00',
        end_time : '20:00',
        fee : 4500,
        location : {
            point : {
            },
            address : '경기도 고양시 덕양구 행신동 우리집'
        }
    },//show-end

    resources : [{
        type : 0, //이미지
        original_path : '/contents/images/1.png',
        thumbnail_path : '/contents/images_thumbnail/1.png'
    },{
            type : 0,
            original_path : '/contents/images/2.png',
            thumbnail_path : '/contents/images_thumbnail/2.png'
    }]
};

Post.savePost(showInfo, function(err, doc){
    if(err){
        console.error(err);
        return;
    }
    console.log(doc);
});