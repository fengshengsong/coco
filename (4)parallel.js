
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
		var file =  yield [
			readFile('1.txt'),
			readFile('2.txt'),
			readFile('3.txt')
		];
		files.push(file);
		console.log(files);
	}catch(err){
		console.log(err);
	}
}

function parallel(fnArr){
	if(Array.isArray(fnArr)){
		const rets = [];
		let pending = fnArr.length;
		return function(callback){
			let finished = false;
			fnArr.forEach(function(fn,index){
				if(finished){return;}
				fn.call(this,function(err,data){
					if(err){
						finished = true;
						callback(err);
					}else{
						rets[index] = data;
						if(--pending === 0){
							callback(null,rets);
						}
					}
				});
			});
		}
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
		parallelValue = parallel(ret.value);
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