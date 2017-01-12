console.log('run');

var co = require('co');
var coco = require('./coco');

// function fn(gen){
// 	var args = Array.from(arguments);
// 	var argss = Array.prototype.slice.call(arguments,1)
// 	// console.log(args,argss);
// 	gen.apply(this,argss);
// }
// var f = coco.wrap(fn);
// console.log();

// function ff(){
// 	console.log(arguments);
// }

// fn(ff,1,2,3);

// var obj = Promise.resolve(1);
// var obj = function* (){
// 	yield 1;
// }

// console.log(obj.constructor);

// var cp = require('child_process');

// cp.exec('node run.js',function(err,stdout,stdin){
// 	console.log(stdout);
// });