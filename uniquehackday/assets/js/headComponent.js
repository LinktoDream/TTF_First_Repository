Vue.component("headcomponent",{
	template:'<div><div class="headComponent">'+
			'<div class="head-top">'+
				'<div class="host">'+
					'LOGO 益支教'+
				'</div>'+
				'<div class="loginTab">'+
					'<div v-if="user == null">'+
						'<a href="login.html">登录</a>'+
						'<a href="register.html">注册</a>'+
					'</div>'+
					'<div v-else>'+
						'<a href="personal_center.html"><span class="glyphicon glyphicon-user"></span>&nbsp;{{user.name}}</a>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="head-nav">'+
				'<div class="navbg"></div>'+
				'<div class="head-nav-con clearFloat">'+
					'<ul>'+
						'<li class="drop-down" ><a href="index.html" >首页</a></li>'+
						'<li class="drop-down" ><a href="info.html" >支教信息</a></li>'+
						'<li class="drop-down" ><a href="forum.html" >支教论坛</a></li>'+
						'<li class="drop-down" ><a href="Charity_sale.html" >义卖平台</a></li>'+
					'</ul>'+
				'</div>'+
			'</div>'+
		'</div></div>',
	data:function(){
		return{
			user:null
		}
	},
	created() {
		$(window).scroll(()=>{
			if($(window).scrollTop()>474.4){
				$(".headComponent").css("background-color","#ffffff")
			}else{
				$(".headComponent").css("background-color","transparent")
			}
		})
		this.getUser()
	},
	methods:{
		getUser:function(){
			var _this = this
			axios({
				method:"get",
				url:"http://132.232.57.130:8083/user/info",
				withCredentials: true
			}).then(res=>{
				if(res.data.code == 1){
					_this.user = res.data.data
				}else{
					console.log(res.data.msg)
				}
			}).catch(error=>{
				alert("网络错误")
				console.log(error)
			})
		}
	}
})

new Vue({
	el:'#header'
})