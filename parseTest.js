/**
 * Created by skplanet on 2015-11-13.
 */

var test = '{ "name" : "563ef1ca401ae00c19a15832", "age" : { "x" : 1 , "y " : 2 } }';
console.log(typeof test);
var obj = JSON.parse(test);
console.log(obj);
console.log(typeof obj.age);

