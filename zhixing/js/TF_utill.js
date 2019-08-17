// 返回介于min,max（都包括）之间随机整数
const $getRndInteger = (min,max)=>Math.floor(Math.random()*(max-min)+min);
// 屏蔽事件冒泡；使用方式：在事件元素上添加本函数的点击事件
const $a = (e) => {
	if(e && e.stopPropagation ){
		// stopPropagation 终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点。
		e.stopPropagation();
	}else{
		// cancelBubble 如果事件句柄想阻止事件传播到包容对象，必须把该属性设为 true
		window.event.cancelBubble = true;
	}
};
// 对页面内的每一个a标签自动执行$a函数
(function(){
	let as = document.getElementsByTagName('a');
	let alength = as.length;
	for(let i = 0;i < alength; i++ ){
		as[i].onclick = $a;
	}
})()