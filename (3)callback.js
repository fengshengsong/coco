
'use strict'

const fs = require('fs');
const files = [];

function readFile(filename){
	return function(callback){
		fs.readFile(filename,function(err,data){
			if(err){
				callback(err)
			}else{
				callback(null,data);				
			}
		});
	}
}

function* genRead(){
	try{
		var file1 = yield readFile('1.txt');
		files.push(file1);
		var file2 = yield readFile('2.txt');
		files.push(file2);
		var file3 = yield readFile('3.txt');
		files.push(file3);
		console.log(files);
	}catch(err){
		console.log(err);
	}
}

function run(gen){
	var g = gen();
	function next(err,data){
		if(err){
			return g.throw(err);
		}
		var ret = g.next(data);
		if(ret.done){
			return;
		}
		if(typeof ret.value == 'function'){
			ret.value.call(this,function(err,data){
				if(err){
					next(err);
				}else{
					next(null,data);
				}
			});
		}	
	}	
	next();
}

run(genRead);