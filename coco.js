//自己写个co

var slice = Array.prototype.slice;

module.exports = coco;

coco.wrap = function(fn){
	function createPromise(){
		var fnn = fn.apply(this,arguments);
		var fnnn = coco.call(this,fnn);
	}
	createPromise.__genFunc = fn;
	return createPromise;
};

function coco(gen){
	var that = this;
	//第一个之外的所有参数
	var args = slice.call(arguments,1);

	return new Promise(function(resolve,reject){
		if(typeof gen === 'function'){
			gen = gen.apply(that,args);
		}
		// 通过gen是否有next方法来判断是否为Generator遍历器对象
		// 如果不是则直接返回一个Promise对象
		if(!gen || typeof gen.next !== 'function'){
			return resolve(gen);
		}

		function onFulfilled(res){
			var ret;
			try{
				ret = gen.next(res);
			}catch(e){
				return reject(e);
			}
			next(ret);
		}

		function onRejected(err){
			var ret;
			try{
				ret = gen.throw(err);
			}catch(e){
				return reject(e);
			}
			next(ret);
		}

		function next(ret){
			if(ret.done){
				return resolve(ret.value);
			}
			//将返回结果包装成为Promise对象
			var value = toPromise.call(that,ret.value);
			if(value && isPromise(value)){
				return value.then(onFulfilled,onRejected);
			}
			// value不能被包装成为Promise对象则抛出错误
			return onRejected(new Error('Error: ' + ret.value));
		}

		function toPromise(obj){
			if(!obj){
				return obj;
			}
			if(isPromise(obj)){
				return obj;
			}
			if(isGeneratorFunction(obj)||isGenerator(obj)){
				return coco.call(this,obj);
			}
			if('function' == typeof obj){
				return thunkToPromise.call(this,obj);
			}
			if(Array.isArray(obj)){
				return arrayToPromise.call(this,obj);
			}
			if(isObject(obj)){
				return objectToPromise.call(this,obj);
			}
			// return Promise.resolve(obj);
			return obj;
		}

		function thunkToPromise(thunk){
			var that = this;
			return new Promise(function(resolve,reject){
				thunk.call(that,function(err,res){
					if(err){
						reject(err);
					}
					if(arguments.lenght > 2){
						res = slice.call(arguments,1);
					}
					resolve(res);
				});
			});
		}

		function arrayToPromise(array){
			return Promise.all(array.map(toPromise,this));
		}

		function objectToPromise(obj){
			var results = new obj.constructor();
			var keys = Object.keys(obj);
			var promises = [];
			for(var i=0;i<keys.length;i++){
				var key = keys[i];
				var promise = toPromise.call(obj[key]);
				if(promise || isPromise(promise)){
					defer(promise,key);
				}else{
					results[key] = obj[key];
				}
			}
			return Promise.all(promises).then(function(){
				return results;
			});
			function defer(promise,key){
				results[key] = undefined;
				promises.push(promise.then(function(res){
					results[key] = res;
				}));
			}
		}

		function isPromise(obj){
			return 'function' == typeof obj.then;
			// return '[Function Promise]' == obj.constructor;
		}

		function isGenerator(obj){
			return 'function' == typeof obj.next && 'function' == obj.throw;
			// return '[Function: GeneratorFunction]' == obj.constructor;
		}

		function isGeneratorFunction(fn){
			var constructor = fn.constructor;
			if(!constructor){
				return false;
			}
			if('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName){
				return true;
			}
			return isGenerator(constructor.prototype);
		}

		function isObject(obj){
			return Object == obj.constructor;
		}

	});

}