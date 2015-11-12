/**
 * Created by skplanet on 2015-11-12.
 */
// fields check
var fieldsObj = {};
var fieldValues = req.query.fields;
if (fieldValues) {
    var fieldsFilter = fieldValues.split(",");
    for (var i in fieldsFilter) {
        if (isChar(fieldsFilter[i])) {
            fieldsObj[fieldsFilter[i]] = 1;
        }
    }
}

var geoNearObj = {
    near: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
    distanceField: 'distance',
    spherical: true,
    maxDistance: 1500,
    distanceMultiplier: 6378.1 * 1000,
};

var aggreArray = [{ $geoNear : geoNearObj }];
if (Object.keys(fieldsObj).length)
    aggreArray.push({ $project : fieldsObj });

Toilet.aggregate(aggreArray).exec(function (err, docs) {
    if (err) {
        res.status(400).send(err); return;
    }

    res.status(200).json(docs);
});

var obj = new Schema({
    loc : {
        type : { type: String },
        coordinates : []
    }
})

// define the index
obj.index({ loc : '2dsphere' });


function isChar(str) {
    return /^[a-zA-Z]+$/.test(str);
}