
'use strict'

const fs = require('fs');

const files = [];

// fs.readFile('1.txt',function(err,data){
// 	if(err){console.log(err);}
// 	files.push(data);
// 	fs.readFile('2.txt',function(err,data){
// 		if(err){console.log(err);}
// 		files.push(data);
// 		fs.readFile('2.txt',function(err,data){
// 			if(err){console.log(err);}
// 			files.push(data);
// 			console.log(files);
// 		});
// 	});
// });

//观察到上面回调函数中操作是相同的，因此将其抽取出来递归调用

function readFile(fileName){
	fs.readFile(fileName,function(err,data){
		if(err){console.log(err);}
		g.next(data);
	});
}

function* genRead(){
	var file1 = yield readFile('1.txt');
	files.push(file1);
	var file2 = yield readFile('2.txt');
	files.push(file2);
	var file3 = yield readFile('3.txt');
	files.push(file3);
	console.log(files);
}

// 初次启动
var g = genRead();
var res = g.next();


