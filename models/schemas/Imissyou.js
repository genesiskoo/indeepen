var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imissyouSchema = new Schema({
	_id : Number,
    _blog : {
        type : Number,
        ref : 'Blog'
    },
    year : Number,
    month : Number,
    imissyous : [{
        _user : {
            type : Number,
            ref : 'User'
        },
        rg_date : {
            type: Date,
            default: Date.now
        }
    }],
    is_valid :{
        type : Boolean,
        default : true
    }
});

module.exports = mongoose.model('imissyou', imissyouSchema);