/**
 * Created by Moon Jung Hyun on 2015-11-20.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hashTagSchema = new Schema({
    _id : String,
    cnt : Number
}, {versionKey : false});

hashTagSchema.statics = {
    updateIncCntById : function(idName, callback){
        this.findOneAndUpdate({_id : idName},
            { $inc : {cnt : 1}},
            { new : true, upsert : true}, callback);
    },
    updateDecCntById : function(idName, callback){
        this.findOneAndUpdate({_id : idName},
            {$inc : {cnt : -1}},
            {new : true, upsert : true}, callback);
    }
};


module.exports = mongoose.model('HashTag', hashTagSchema);


