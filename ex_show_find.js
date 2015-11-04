var mongoose = require('mongoose');

//mongoose.connect('mongodb://54.199.219.43:3000/indeepenkoo');
mongoose.connect('mongodb://localhost:27017/indeepenkoo');

var Post = require('./models/Posts');

Post.findShowPosts( function(err, doc){
    if(err){
        console.error('POST FIND ONE ERROR - ', err);
        return;
    }
    console.log(doc);
});