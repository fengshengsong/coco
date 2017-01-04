function thunkify(fn){
	return function(){
		//保存传入的参数和当前上下文环境,提供传入的函数fn所需执行环境
		var args = Array.prototype.slice.call(arguments);
		var ctx = this;
		return function(callback){
			//确保callback只执行一次
			var called;
			//将包裹后的回调函数添加到参数中，提供给fn最终执行
			function wrapperCallBack(){
				if(called){
					return;
				}
				called = true;
				callback.apply(null,arguments);
			}
			args.push(wrapperCallBack);
			try{
				fn.apply(ctx,args);
			}catch(err){
				callback(err);
			}
		}
	}
}

module.exports = thunkify;