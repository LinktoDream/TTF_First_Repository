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

/* 基于jQuery的数字翻滚计数 */
/*
	使用说明:
		给元素标签加上class="timer count-title"和data-to,data-speed两个属性
		其中data-to表示目标数字,data-speed表示完成速度(ms)
*/
$.fn.countTo = function (options) {
	options = options || {};
	
	return $(this).each(function () {
		// set options for current element
		var settings = $.extend({}, $.fn.countTo.defaults, {
			from:            $(this).data('from'),
			to:              $(this).data('to'),
			speed:           $(this).data('speed'),
			refreshInterval: $(this).data('refresh-interval'),
			decimals:        $(this).data('decimals')
		}, options);
		
		// how many times to update the value, and how much to increment the value on each update
		var loops = Math.ceil(settings.speed / settings.refreshInterval),
			increment = (settings.to - settings.from) / loops;
		
		// references & variables that will change with each update
		var self = this,
			$self = $(this),
			loopCount = 0,
			value = settings.from,
			data = $self.data('countTo') || {};
		
		$self.data('countTo', data);
		
		// if an existing interval can be found, clear it first
		if (data.interval) {
			clearInterval(data.interval);
		}
		data.interval = setInterval(updateTimer, settings.refreshInterval);
		
		// initialize the element with the starting value
		render(value);
		
		function updateTimer() {
			value += increment;
			loopCount++;
			
			render(value);
			
			if (typeof(settings.onUpdate) == 'function') {
				settings.onUpdate.call(self, value);
			}
			
			if (loopCount >= loops) {
				// remove the interval
				$self.removeData('countTo');
				clearInterval(data.interval);
				value = settings.to;
				
				if (typeof(settings.onComplete) == 'function') {
					settings.onComplete.call(self, value);
				}
			}
		}
		
		function render(value) {
			var formattedValue = settings.formatter.call(self, value, settings);
			$self.html(formattedValue);
		}
	});
};
$.fn.countTo.defaults = {
	from: 0,               // the number the element should start at
	to: 0,                 // the number the element should end at
	speed: 1000,           // how long it should take to count between the target numbers
	refreshInterval: 100,  // how often the element should be updated
	decimals: 0,           // the number of decimal places to show
	formatter: formatter,  // handler for formatting the value before rendering
	onUpdate: null,        // callback method for every time the element is updated
	onComplete: null       // callback method for when the element finishes updating
};
function formatter(value, settings) {
	return value.toFixed(settings.decimals);
}
// 自定义格式化示例
$('#count-number').data('countToOptions', {
formatter: function (value, options) {
  return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
}
});
// 开始所有的计时器
$('.timer').each(count);  
function count(options) {
	var $this = $(this);
	options = $.extend({}, options || {}, $this.data('countToOptions') || {});
	$this.countTo(options);
}
/* 基于jQuery的数字翻滚计数 end */

/* 基于计时器的简单数字翻滚 start */
/*
	创建计时对象;
	object:{
		inl: null, //计时器
		startNum: 0, //起始数值
		finalNum: num // 终止数值
	}
	启动计时器：(step为增长步长，time计时器间隔时间)
	object。inl = setInterval(function(){numRoll(object,step)},time);
*/
let numRoll = function (object,step) {
	if(object.startNum < object.finalNum){
		object.startNum += step;
	}else{
		clearInterval(object.inl);
	}
}
/* 基于计时器的简单数字翻滚 end */