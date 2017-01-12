//回调函数嵌套形式实现异步操作的同步
'use strict'

const fs = require('fs');

const files = [];

fs.readFile('1.txt',function(err,data){
	if(err){console.log(err);}
	files.push(data);
	fs.readFile('2.txt',function(err,data){
		if(err){console.log(err);}
		files.push(data);
		fs.readFile('2.txt',function(err,data){
			if(err){console.log(err);}
			files.push(data);
			console.log(files);
		});
	});
});