/*
	auto_increment
*/

var mongoose = require('./config/mongoose_conn.js');

var counter = require('./controllers/Counters.js');
counter.saveCounter('users', function(err, doc){
	if(err){
		console.error('ERROR - ', err);
 		return;
	}
	console.log(doc);
});
counter.saveCounter('blogs', function(err, doc){
	if(err){
		console.error('ERROR - ', err);
 		return;
	}
	console.log(doc);
});

counter.saveCounter('posts', function(err, doc){
	if(err){
		console.error('ERROR - ', err);
 		return;
	}
	console.log(doc);
});

counter.saveCounter('replies', function(err, doc){
	if(err){
		console.error('ERROR - ', err);
 		return;
	}
	console.log(doc);
});

counter.saveCounter('notis', function(err, doc){
	if(err){
		console.error('ERROR - ', err);
 		return;
	}
	console.log(doc);
});

counter.saveCounter('reports', function(err, doc){
	if(err){
		console.error('ERROR - ', err);
 		return;
	}
	console.log(doc);
});


