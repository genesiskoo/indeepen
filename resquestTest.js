/**
 * Created by skplanet on 2015-11-12.
 */
var express = require('express');
var formidable = require('formidable');


    var uploadInfo = {
        files: [],
        artist:[]
    };
    var form = new formidable.IncomingForm();
    // aws 에 저장되는 경로....
    form.uploadDir = uploadUrl;

    form
        .on('field', function (field, value) {
            if(field=='tag'){
                uploadInfo.artist.push(value);
            }else{
                console.log('file 아님 ', field);
                uploadInfo[field] = value;
            }
        })
        .on('end', function () {
            console.log('-> upload done');
            callback(null, uploadInfo);
        });
    form.parse(req);

