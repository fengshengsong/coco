//使用generator函数的异步操作

const fs = require('fs');

const files = [];

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

// var g = genRead();
// var res = g.next();


//与thunk函数配合

const thunkify = require('./thunkify');

const thunkFiles = [];

var thunkReadFile = thunkify(fs.readFile);

function* thunkGenRead(){
	var thunkFile1 = yield thunkReadFile('1.txt');
	thunkFiles.push(thunkFile1);
	var thunkFile2 = yield thunkReadFile('2.txt');
	thunkFiles.push(thunkFile1);
	var thunkFile3 = yield thunkReadFile('3.txt');
	thunkFiles.push(thunkFile1);
	console.dir(thunkFiles);
}


function runThunkGen(thunkGen){
    var tg = thunkGen();
    function next(err,data){
        var tres = tg.next(data);
        if(tres.done){
            return;
        }
        tres.value(next);
    }
    next();
}

runThunkGen(thunkGenRead);