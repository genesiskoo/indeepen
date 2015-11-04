var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://54.199.219.43:3000/indeepenkoo');

var Post = require('./models/');

var showinfo = {
    post_type : 1,
    _writer : 1,
    content : '이것은 예술공연 문화이다',
    hash_tags : ['깃저주','gitdie'],
    likes : [6,2,4],
    show : {
        type : 2, //공연
        tags : [{
            _user: 11,
            point : {31,21}
        },{
            _user: 12,
            point : {10,21}
        }]
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

Post.savePost(showinfo, function(err, doc){
    if(err){
        console.error(err);
        return;
    }
    console.log(doc);
});