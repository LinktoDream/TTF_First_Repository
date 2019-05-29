Vue.component("login-component",{
	template:'<div><div class="sl-login-overlay" v-show="IsShow_Login"></div>'+
				'<div class="login_panel" style="z-index: 10;" v-show="IsShow_Login">'+
					'<div class="sl-login animated fadeInDown">'+
						'<span class="sl-login-close" @click="CloseLogin">×</span>'+
						'<div class="login-nav">'+
							'<span :id="login_id" @click="SwitchLogin">登陆</span>'+
							'<span :id="register_id" @click="SwitchRegister">注册</span>'+
						'</div>'+
						'<div class="login_input" v-show="IsLogin_Show">'+
							'<div class="form-group">'+
								'<label class="sr-only" for="login-InputEmail">手机号</label>'+
								'<input type="number" class="form-control" id="login-InputEmail" placeholder="请输入手机号" v-model="login_userID" @keypress="login(event)">'+
							'</div>'+
							'<div class="form-group">'+
								'<label class="sr-only" for="id-InputPassword">密码</label>'+
								'<input type="password" class="form-control" id="login-InputPassword" placeholder="请输入密码" v-model="login_userPW" @keypress="login(event)">'+
							'</div>'+
							'<p class="warning-info" v-show="Islogin_fail">{{message}}</p>'+
							'<button type="submit" class="btn btn-primary login_button" @click="login_btn">登陆</button>'+
						'</div>'+
						'<div class="register_input" v-show="IsRegister_Show">'+
							'<span class="warning-info" v-show="IsIDLegal==\'no\'">{{message}}</span>'+
							'<div class="form-group">'+
								'<label class="sr-only" for="register-InputEmail">手机号</label>'+
								'<input type="number" :class="ID_style" class="form-control" id="register-InputEmail" placeholder="请输入注册手机号" v-model="register_userID" maxlength="16" @blur.prevent="IsRegisterIDLegal($event)" @focus="ID_focus">'+
							'</div>'+
							'<span class="warning-info" v-show="IsPWLegal==\'little\'">密码长度不小于8位</span>'+
							'<div class="form-group">'+
								'<label class="sr-only" for="register-InputPassword">密码</label>'+
								'<input type="password" :class="PW_style" class="form-control" id="register-InputPassword" placeholder="请输入8~16位密码" v-model="register_userPW" @blur.prevent="IsRegisterPWLegal2($event)" maxlength="16" @focus="PW_focus">'+
							'</div>'+
							'<span class="warning-info" v-show="IsRPWLegal==\'no\'">两次输入密码不一致</span>'+
							'<div class="form-group">'+
								'<label class="sr-only" for="register-resetPassword">确认密码</label>'+
								'<input type="password" :class="resetPW_style" class="form-control" id="register-resetPassword" placeholder="确认密码" v-model="register_resetPW" @blur.prevent="IsRegisterPWLegal($event)" maxlength="16" @focus="resetPW_focus">'+
							'</div>'+
							'<div class="form-group">'+
								'<label class="sr-only" for="register-InputName">昵称</label>'+
								'<input type="text" :class="Name_style" class="form-control" id="register-InputName" placeholder="请输入6个字符以内昵称" v-model="register_userName" @blur.prevent="IsNameLegal($event)" maxlength="6" @focus="Name_focus">'+
							'</div>'+
							'<button type="submit" class="btn btn-primary login_button" @click="register">注册</button>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<div class="header" >'+
					'<div class="logo"><a href="index.html" class="header_a"><img src="../img/LOGO.png" height="70px"/></a></div>'+
					'<div class="user-img dropdown" v-if="user != null">'+
						'<a href="javascript:void(0)" class="header_a" data-toggle="dropdown"><img :src="user.avatar" width="60px"></a>'+
						'<ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu1">'+
							'<li role="presentation" ><a href="center.html" role="menuitem" tabindex="-1">个人中心</a></li>'+
							'<li role="presentation" class="divider"></li>'+
							'<li role="presentation" @click="exitLogin"><a role="menuitem" tabindex="-1">退出</a></li>'+
						'</ul>'+
					'</div>'+
					'<div class="login" v-else>'+
						'<a href="javascript:void(0)" @click="OpenLogin">登陆 | 注册</a>'+
					'</div>'+
					'<div class="dropdown headNavMenu" v-if="IsMenu">'+
						'<button class="btn-down" data-toggle="dropdown">{{currentHeadNav}}&nbsp;<span class="glyphicon glyphicon-th-list"></span></button>'+
						'<ul class="dropdown-menu head-menu" role="menu">'+
							'<li role="presentation" ><a href="index.html">首页</a></li>'+
							'<li role="presentation" ><a href="ItemLobby.html">项目大厅</a></li>'+
							'<li role="presentation" ><a href="community.html">社区</a></li>'+
							'<li role="presentation" ><a href="platform.html">项目发布</a></li>'+
						'</ul>'+
					'</div>'+
					'<div class="header-nav" v-else>'+
						'<ul>'+
							'<li><a href="index.html">首页</a></li>'+
							'<li><a href="ItemLobby.html">项目大厅</a></li>'+
							'<li><a href="community.html">社区</a></li>'+
							'<li><a href="platform.html">项目发布</a></li>'+
						'</ul>'+
					'</div>'+
				'</div></div>',
	data:function(){
		return{
			// 首部导航显示样式
			IsMenu:false,
			currentHeadNav:"",
			// 屏幕宽度
			screenWidth:$(document).width(),
			// 是否登陆
			IsShow_Login:false,
			IsLogin_Show:true,
			IsRegister_Show:false,
			current_login_nav:'current-login-nav',
			// 登陆/注册nav的id样式
			login_id:'current-login-nav',
			register_id:'',
			
			login_userID:'',//登陆id
			login_userPW:'',//登陆密码
			
			register_userID:'',//注册id
			register_userPW:'',//注册密码
			register_resetPW:'',//确认注册密码
			register_userName:'',//注册昵称
			
			IsPWLegal:'',//合法=yes，非法=no，长度不够=little
			IsIDLegal:'',//非法=no，合法=yes
			IsRPWLegal:'',//非法=no，合法=yes
			
			warning_style:['unlegal_style','animated','shake'],
			PW_style:null,
			resetPW_style:null,
			ID_style:null,
			Name_style:null,
			
			Islogin_fail:'',
			message:'',
			
			//用户
			user:null
		}
	},
	created() {
		//检测登陆状态
		const _this = this
		axios({
			method: "get",
			url: "http://114.116.77.118:8888/user/getLoginUser",
			withCredentials: true
		}).then(function(result){
			if(result.data.status == 1){
				_this.user = result.data.data
				_this.CloseLogin()
				_this.messqge = ''
			}else{
				// 页面载入发现没有登陆cookie的处理
				_this.messqge = result.data.message
			}
		}).catch(function(error){
			alert(error)
		})
		// 依据显示宽度改变首部导航栏样式
		this.IsMenuEvent($(document).width())
		let pathname = window.location.pathname
		if(pathname.indexOf("ItemLobby.html") != -1){
			this.currentHeadNav = "项目大厅"
		}else if(pathname.indexOf("community.html") != -1){
			this.currentHeadNav = "社区"
		}else if(pathname.indexOf("platform.html") != -1){
			this.currentHeadNav = "项目发布"
		}else if(pathname.indexOf("/zhixing/pages/") != -1){
			this.currentHeadNav = "首页"
		}
	},
	mounted() {
		window.onresize = () => {
			return (() => {
				this.screenWidth = $(document).width()
			})()
		}
	},
	watch:{
		'screenWidth':function(newVal){
			this.IsMenuEvent(newVal)
		}
	},
	methods:{
		// 可视区域小于767px事件
		IsMenuEvent:function(val){
			if(val < 767){
				this.IsMenu = true
			}else{
				this.IsMenu = false
			}
			console.log(this.IsMenu)
		},
		// 切换登陆
		SwitchLogin:function(){
			this.IsLogin_Show = true
			this.IsRegister_Show = false
			this.login_id = this.current_login_nav
			this.register_id=''
		},
		// 切换注册
		SwitchRegister:function(){
			this.IsLogin_Show = false
			this.IsRegister_Show = true
			this.login_id=''
			this.register_id=this.current_login_nav
			
			// 清除所有警告
			this.ID_focus()
			this.PW_focus()
			this.resetPW_focus()
			this.Name_focus()
		},
		// 打开登陆面板
		OpenLogin:function(){
			this.IsShow_Login = true
		},
		// 关闭登陆面板
		CloseLogin:function(){
			this.IsShow_Login = false
			this.login_userID = ''//登陆id
			this.login_userPW = ''//登陆密码
			this.register_userID = ''//注册id
			this.register_userPW = ''//注册密码
			this.register_resetPW = ''//确认注册密码
			this.register_userName = ''//注册昵称
		},
		// 登陆
		login_btn:function(){
			var _this = this
			var formData = new FormData();
			formData.append("username",_this.login_userID)
			formData.append("password",_this.login_userPW)
			axios({
				method: "post",
				url: "http://114.116.77.118:8888/user/login",
				dataType: "jsonp",
				data:formData,
				crossDomain: true,
				cache: false,
				withCredentials: true // 允许携带cookie
			}).then(function(res){
				if(res.data.status == 1){
					window.location.reload()
					_this.Islogin_fail = false
				}else{
					_this.message = res.data.message
					_this.Islogin_fail = true
				}
			}).catch(function(error){
				alert(error)
			})
		},
		login:function(event){
			if(event.keyCode == '13'){
				this.login_btn()
			}
		},
		// 退出登录
		exitLogin:function(){
			//清空cookie 
			var _this = this
			axios({
				method: "get",
				url: "http://114.116.77.118:8888/user/logout",
				withCredentials: true
			}).then(function(result){
				_this.user = null
				window.location.reload()
			}).catch(function(error){
				alert("退出失败")
			})
		},
		// 注册
		register:function(){
			var _this = this
			if (_this.register_userID < 8 || _this.register_userPW < 8) {
				_this.IsRegisterIDLegal()
				_this.IsRegisterPWLegal()
				_this.IsRegisterPWLegal2()
			}else if(_this.register_userName.length === 0){
				_this.Name_style = _this.warning_style
			}else{
				let formData = new FormData();
				formData.append("username",_this.register_userID)
				formData.append("password",_this.register_userPW)
				formData.append("nickname",_this.register_userName)
				axios({
					method: "post",
					url: "http://114.116.77.118:8888/user/register",
					dataType: "jsonp",
					data:formData,
					crossDomain: true,
					cache: false,
					withCredentials: true // 允许携带cookie
				}).then(function(res){
					if(res.data.status == 1){
						/**
						 * 注册成功操作
						 */
						alert(res.data.message)
						_this.login_userID = _this.register_userID
						// 清除注册信息
						_this.register_userID = ''//注册id
						_this.register_userPW = ''//注册密码
						_this.register_resetPW = ''//确认注册密码
						_this.register_userName = ''//注册昵称
						// 切换登陆
						_this.SwitchLogin()
					}else{
						// 该账号已被注册
						_this.IsIDLegal = 'no'
						_this.ID_style = _this.warning_style
						_this.message = res.data.message
					}
				}).catch(function(error){
					console.log(error)
					alert("网络异常")
				})
			}
		},
		// 密码一致性检测：确认密码处检测
		IsRegisterPWLegal:function(e){
			if(this.register_userPW.length < 8){
				this.IsPWLegal = 'little'
				this.PW_style = this.warning_style
			}else{
				this.PW_style = 'legal_style'
				this.IsPWLegal = ''
				if(this.register_userPW != this.register_resetPW){
					this.IsRPWLegal = 'no'
					this.resetPW_style = this.warning_style
					// e.currentTarget.focus()
				}else{
					this.IsRPWLegal = 'yes'
					this.resetPW_style = 'legal_style'
				}
			}
		},
		//输入密码处检测
		IsRegisterPWLegal2:function(e){
			if(this.register_userPW.length < 8){
				this.IsPWLegal = 'little'
				this.PW_style = this.warning_style
			}else{
				this.PW_style = 'legal_style'
				this.IsPWLegal = ''
				if(this.register_userPW != this.register_resetPW && this.register_resetPW != ''){
					this.IsRPWLegal = 'no'
					this.resetPW_style = this.warning_style
					// e.currentTarget.focus()
				}else if(this.register_userPW == this.register_resetPW){
					this.IsRPWLegal = 'yes'
					this.resetPW_style = 'legal_style'
				}
			}
		},
		// 注册账号检测
		IsRegisterIDLegal:function(e){
			if(this.register_userID.length < 8){
				this.IsIDLegal = 'no'
				this.message = '账号长度不小于8位'
				this.ID_style = this.warning_style
			}else{
				this.IsIDLegal = ''
				this.ID_style = null
			}
		},
		// 昵称检测
		IsNameLegal:function(e){
			if(this.register_userName.length === 0){
				this.Name_style = this.warning_style
			}
		},
		// ID-input获取焦点事件：清除错误警告
		ID_focus:function(){
			this.IsIDLegal = ''
			this.ID_style = null
		},
		// PW-input获取焦点事件：清除错误警告
		PW_focus:function(){
			this.IsPWLegal = ''
			this.PW_style = null
		},
		// resetPW-input获取焦点事件：清除错误警告
		resetPW_focus:function(){
			this.IsRPWLegal = ''
			this.resetPW_style = null
		},
		// Name-input获取焦点事件：清除错误警告
		Name_focus:function(){
			this.Name_style = null
		},
	},
});
new Vue({
	el:'#header',
})