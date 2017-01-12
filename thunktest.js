//Generator与Thunk函数配合

const fs = require('fs');
const thunkify = require('./thunkify');

const thunkFiles = [];

var thunkReadFile = thunkify(fs.readFile);

function* thunkGenRead(){
	var thunkFile1 = yield thunkReadFile('1.txt');
	thunkFiles.push(thunkFile1);
	var thunkFile2 = yield thunkReadFile('2.txt');
	thunkFiles.push(thunkFile2);
	var thunkFile3 = yield thunkReadFile('3.txt');
	thunkFiles.push(thunkFile3);
	console.log(thunkFiles);
}

function run(gen){
    var g = gen();
    function next(err,data){
        var res = g.next(data);
        if(res.done){
            return;
        }
        res.value(next);
    }
    next();
}

run(thunkGenRead);