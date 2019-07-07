new Vue({
	el:'.main',
	data:{
		//订单&推荐
		items:[],
		orders:[],
		
		//导航栏nav样式
		current_nav:{'border-bottom':'3px solid #515451',color: '#515451','text-shadow': '5px 5px 50px #4D4A48' },
		style_nav1:{},
		style_nav2:{},
		style_nav3:{},
		showLoading:true,//加载动画
		
		// 推荐item
		item_style:[['item'],['item'],['item'],['item'],['item'],['item'],['item'],['item']],
		
		//滑动栏silder
		img_url:['../img/slider.jpg','../img/slider2.jpg','../img/slider3.jpg'],
		slider_index:0,
		isFocus:false,
		
		style_slider:{'animation-name': 'slider_img',animation: 'slider_img 2s alternate','-webkit-animation': 'slider_img 2s alternate' ,'-moz-animation': 'slider_img 2s alternate infinite'},
		
		prev_next_show:false,
		//slider计时器
		slider_interval:{},
		
		// 搜索
		inputvalue:'',

		//	可视区域宽度
		screenWidth:$(document).width()
	},
	created() {
		this.style_nav1 = this.current_nav
		this.nav1()
		//请求订单数据
		this.getLatestOrders()
		//定时slider轮播
		this.slider_interval = setInterval(this.slider_action,3000)
	},
	mounted() {
		window.onresize = () => {
			return (() => {
				this.screenWidth = document.body.clientWidth
			})()
		}
	},
	watch:{
		'screenWidth':function(newVal){
			if(newVal < 767){
				clearInterval(this.slider_interval)
			}
		}
	},
	methods:{
		//导航栏nav切换
		nav1:function(){//首页推荐
			this.items = []
			this.showLoading = true
			this.style_nav1 = this.current_nav
			this.style_nav2 = {}
			this.style_nav3 = {}
			/*
				这里执行nav切换的操作
			*/
		   var _this = this
		   axios({
		   	method: "get",
		   	url: "http://114.116.77.118:8888/item/getHotItems",
		   	dataType: "json",
		   	params:{
		   		size:8
		   	},
		   	crossDomain: true,
		   	cache: false
		   }).then(function(res){
				_this.showLoading = false
				if(res.data.status == 1){
					_this.items = res.data.data
				}else{
					alert(res.data.message)
				}
		   }).catch(function(error){
				alert(error)
		   })
		},
		nav2:function(){//最新发布
			this.items = []
			this.showLoading = true
			this.style_nav1 = {}
			this.style_nav2 = this.current_nav
			this.style_nav3 = {}
			/*
				这里执行nav切换的操作
			*/
		   var _this = this
		   axios({
		   	method: "get",
		   	url: "http://114.116.77.118:8888/item/listByTime",
		   	dataType: "json",
		   	params:{
		   		pageSize: 8,
		   		currPage: 1
		   	},
		   	crossDomain: true,
		   	cache: false
		   }).then(function(res){
				_this.showLoading = false
				if(res.data.status == 1){
					_this.items = res.data.data
					console.log(_this.items)
				}else{
					alert(res.data.message)
				}
		   }).catch(function(error){
				alert(error)
		   })
		},
		nav3:function(){//上升最快
			this.items = []
			this.showLoading = true
			this.style_nav1 = {}
			this.style_nav2 = {}
			this.style_nav3 = this.current_nav
			/*
				这里执行nav切换的操作
			*/
		   var _this = this
		   axios({
		   	method: "get",
		   	url: "http://114.116.77.118:8888/item/getHotItems",
		   	dataType: "json",
		   	params:{
		   		size:8
		   	},
		   	crossDomain: true,
		   	cache: false
		   }).then(function(res){
				_this.showLoading = false
				if(res.data.status == 1){
					_this.items = res.data.data
				}else{
					alert(res.data.message)
				}
		   }).catch(function(error){
				alert(error)
		   })
		},
		
		item_mouseenter:function(index){
			this.item_style[index].push('animated')
			this.item_style[index].push('tada')
		},
		item_mouseleave:function(index){
			this.item_style[index].splice(1,2)
		},
		
		//滑动栏slider切换
		prev:function(){//上一张slider
			if(this.slider_index > 0){
				this.slider_index--
			}else{
				this.slider_index = this.img_url.length - 1
			}
			// alert("上一张")
		},
		next:function(){//下一张slider
			if(this.slider_index < this.img_url.length - 1){
				this.slider_index++
			}else{
				this.slider_index = 0
			}
			// alert("下一张")
		},
		//图片自动轮播index设置
		slider_action:function(){
			if(this.slider_index < this.img_url.length - 1){
				this.slider_index++
			}else{
				this.slider_index = 0
			}
		},
		//slider鼠标移出
		slider_mouseleave:function(){
			this.slider_interval = setInterval(this.slider_action,3000)
			this.prev_next_show = false
		},
		//slider鼠标进入
		slider_mouseenter:function(){
			clearInterval(this.slider_interval)
			this.prev_next_show = true
		},
		// 获取最新订单
		getLatestOrders:function(){
			var _this = this
			axios({
				method: "get",
				url: "http://114.116.77.118:8888/order/getNewOrders",
				dataType: "json",
				params:{
					size:4
				},
				crossDomain: true,
				cache: false
			}).then(function(res){
				if(res.data.status == 1){
					_this.orders = res.data.data
				}
			}).catch(function(error){
				alert("请求数据失败")
			})
		},
		// 搜索
		search:function(event){
			if(event.keyCode == '13'){
				this.search_btn()
			}
		},
		search_btn:function(){
			if(this.inputvalue != ''){
				window.location.href = "search.html?value="+this.inputvalue
			}
		},
		
		searchValueFocus(){
			this.isFocus = true
		},
		searchValueBlur(){
			this.isFocus = false
		}
	}
})