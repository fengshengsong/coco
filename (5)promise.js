
'use strict'

const fs = require('fs');
const files = [];

function readFile(filename){
    return new Promise(function(resolve,reject){
        fs.readFile(filename,function(err,data){
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
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

function wrapPromise(fn){
    if(isPromise(fn)){
        return function(callback){
            return fn.then(function(data){
                callback(null,data);
            },function(err){
                callback(err);
            });
        }
    }
}

function isPromise(fn){
    return fn && typeof fn.then === 'function';
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
        var promiseValue = wrapPromise(ret.value);
        if(typeof promiseValue == 'function'){
            promiseValue.call(this,function(err,data){
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