
jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */
    $.backstretch("assets/img/backgrounds/1.jpg");
    
    /*
        Form validation
    */
    
	$("#form").validate({
		onfocusout:function(element){
			return $(element).valid();//手动校验当前失去焦点的element
		},
		rules:{
			'form-name':'required',
			'form-province':'required',
			'form-city':'required',
			'form-country':'required',
			'form-phone':'required',
			'form-password':{
				'required':true,
				minlength:6
			},
			'form-rpassword':{
				'required':true,
				equalTo: '#form-password'
			},
			'form-school':'required',//志愿者学校
			'form-educationBg':'required',
			'form-idNumber':'required',
			'form-schoolLevel':'required',
			'form-description':'required',
		},
		messages:{
			'form-name':'请输入名称',
			'form-province':'请选择省份',
			'form-city':'请选择城市',
			'form-country':'请选择县市',
			'form-phone':'请输入手机号',
			'form-password':{
				required:'请输入密码',
			},
			'form-rpassword':{
				required:'请再输入一次密码',
				equalTo:'两次输入密码不一致'
			},
			'form-school':'请输入学校名称',
			'form-educationBg':'请选择最高学历',
			'form-idNumber':'请输入身份证号码/机构备案号',
			'form-schoolLevel':'请选择学校级别',
			'form-description':'请输入学校描述',
		}
	})
    
});

new Vue({
	el:".register-part",
	data:{
		identifies:["志愿者","机构","需求方"],
		name:'',
		province:'',
		city:'',
		country:'',
		phone:'',
		password:'',
		rpassword:'',
		school:'',//志愿者学校
		educationBg:'——学历——',
		idNumber:'',
		schoolLevel:'——学校级别——',
		description:'',
		role:'3',
	},
	created() {
		$(".register-different").eq(0).show()
	},
	mounted() {
		$(".form-top-left p").eq(0).css("font-weight","600")
	},
	methods:{
		tav_change:function(i){
			if(i == 0){
				this.role = 3
			}else if(i == 1){
				this.role = 2
			}else{
				this.role = 1
			}
			this.clearInfo()
			let $p = $(".form-top-left p").eq(i).css("font-weight","600")
			$(".form-top-left p").not($p).css("font-weight","200")
			var $register = $(".register-different").eq(i)
			$register.show()
			$(".register-different").not($register).hide()
		},
		register:function(){
			if(this.role == 3){
				this.volunteer_Reg()
			}else if(this.role == 2){
				this.institution()
			}else if(this.role == 1){
				this.schoolR()
			}
			
			let formData = new FormData();
			formData.append("username",this.phone)
			formData.append("password",this.password)
			formData.append("nickname",this.name)
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
					
				}else{
					alert(res.data.message)
				}
			}).catch(function(error){
				console.log(error)
				alert("网络异常")
			})
			
		},
		login:function(){
			const _this = this
			let data = {
				username:_this.phone,
				password:_this.password,
			}
			if($(".error").length != 0){
				$($(".error")[0]).prev().focus();
			}else{
				axios.defaults.crossDoamin = true;
				axios.defaults.withCredentials = true;
				axios({
					method:"post",
					url:"http://132.232.57.130:8083/user/login",
					params:data,
				}).then(res=>{
					if(res.data.code == 1){
						window.location.href = "index.html"
					}else{
						alert(res.data.message)
					}
				}).catch(error=>{
					alert("网络错误")
					console.log(error)
				})
			}
			
			var formData = new FormData();
			formData.append("username",this.phone)
			formData.append("password",this.password)
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
					
				}else{
					alert("fail")
				}
			}).catch(function(error){
				alert(error)
			})
		},
		volunteer_Reg:function(){
			const _this = this
			let data = {
				name:_this.name,
				phone:_this.phone,
				idNumber:_this.idNumber,
				school:_this.school,
				educationBg:_this.educationBg,
				password:_this.password,
				role:_this.role
			}
			if($(".error").length != 0){
				$($(".error")[0]).prev().focus();
			}else{
				axios({
					method:"post",
					url:"http://132.232.57.130:8083/user/register",
					params:data,
				}).then(res=>{
					if(res.data.code == 1){
						alert("注册成功！")
						_this.clearInfo()
						window.location.href = "login.html"
					}else{
						alert(res.data.code)
					}
				}).catch(error=>{
					alert("网络错误")
					console.log(error)
				})
			}
		},
		institution:function(){
			const _this = this
			let data = {
				name:_this.name,
				phone:_this.phone,
				password:_this.password,
				role:_this.role,
				idNumber:_this.idNumber,
				province:_this.province,
				city:_this.city,
				country:_this.country
			}
			if($(".error").length != 0){
				$($(".error")[0]).prev().focus();
			}else{
				axios({
					method:"post",
					url:"http://132.232.57.130:8083/user/register",
					params:data,
				}).then(res=>{
					if(res.data.code == 1){
						alert("注册成功！")
						_this.clearInfo()
						window.location.href = "login.html"
					}else{
						alert("该账号已被注册")
					}
				}).catch(error=>{
					alert("网络错误")
					console.log(error)
				})
			}
		},
		schoolR:function(){
			const _this = this
			let data = {
				name:_this.name,
				phone:_this.phone,
				password:_this.password,
				role:_this.role,
				province:_this.province,
				city:_this.city,
				country:_this.country
			}
			if($(".error").length != 0){
				$($(".error")[0]).prev().focus();
			}else{
				axios({
					method:"post",
					url:"http://132.232.57.130:8083/user/register",
					params:data,
				}).then(res=>{
					if(res.data.code == 1){
						alert("注册成功！")
						_this.clearInfo()
						window.location.href = "login.html"
					}else{
						alert("该账号已被注册")
					}
				}).catch(error=>{
					alert("网络错误")
					console.log(error)
				})
			}
		},
		clearInfo:function(){
			this.name = '',
			this.phone = '',
			this.idNumber = '',
			this.school = '',
			this.schoolLevel = '——学校级别——',
			this.password = '',
			this.rpassword = '',
			this.province = '',
			this.city = '',
			this.country = '',
			this.educationBg = '——学历——'
		},
	}
})