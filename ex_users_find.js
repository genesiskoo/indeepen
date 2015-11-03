var mongoose = require('./config/mongoose_conn.js');
var Users = require('./controllers/Users.js');

Users.findOne({email : 'moon@naver.com', password : '1234', 'is_valid.is_valid' : true}, function(err, doc){
	if(err){
		console.error('USERS FINE ONE ERROR - ', err);
		return;
	}
	console.log(doc);
});

// Users.findOne({_id : 4}, function(err, doc){
// 	console.log(doc);
// });
