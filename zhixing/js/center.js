var itemVue = null
var blogVue = null
$(function () {
	var nav = getQueryString("nav");
	if (nav == 2) {
		Show_myBlogs()
	}else if(nav == 3){
		Show_myItems()
	}else{
		Show_userInfo()
	}
	getLoginUser();
	getItemList()
	getBlogList()
	getOrderList()
})
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
function getLoginUser() {
	$("#userInfoLoading").show()
	$.ajax({
		url:"http://114.116.77.118:8888/user/getLoginUser",
		type:"get",
		xhrFields: {
			withCredentials: true // 这里设置了withCredentials
		},
		success:function (result) {
			$("#userInfo").show()
			$("#userInfoLoading").hide()
			new Vue({
				el: "#userInfo",
				data: {
					status: result.status,
					user: result.data,
					radio_value:'',
					
					IsUpdatePW_Show:false,
					oldPW:'',
					newPW:'',
					
					IsPWLegal:true,
					warning_style:['unlegal_style','animated','shake'],
					PW_style:null,
				},
				created() {
					if(this.status === 1){
						if(this.user.gender){
							this.radio_value = 'male'
						}else{
							this.radio_value = 'famale'
						}
					}
				},
				methods:{
					save_userInfo:function(){//保存基础信息
						if(this.radio_value == 'male'){
							this.user.gender = true
						}else{
							this.user.gender = false
						}
						var formData = new FormData()
						formData.append("nickname",this.user.nickname)
						formData.append("gender",this.user.gender)
						formData.append("college",this.user.college)
						formData.append("major",this.user.major)
						formData.append("phone",this.user.phone)
						formData.append("email",this.user.email)
						axios({
							method: "post",
							url: "http://114.116.77.118:8888/user/updateInfo",
							dataType: "jsonp",
							data:formData,
							crossDomain: true,
							cache: false,
							withCredentials: true // 允许携带cookie
						}).then(function(res){
							if(res.data.status == 1){
								alert(res.data.message)
							}else{
								alert(res.data.message)
							}
						}).catch(function(error){
							alert(error)
						})
					},
					// 打开密码修改面板
					Start_updatePW:function(){
						this.IsUpdatePW_Show = true
					},
					// 关闭密码修改面板
					cancel_UDPW:function(){
						this.oldPW = ''
						this.newPW = ''
						this.IsPWLegal = true
						this.PW_style = null
						this.IsUpdatePW_Show = false
					},
					// 确认修改密码
					confirm_UDPW:function(){
						if(this.newPW.length < 8){
							this.PW_style = this.warning_style
							this.IsPWLegal = false
						}else{
							var formData = new FormData()
							formData.append("oldPwd",this.oldPW)
							formData.append("newPwd",this.newPW)
							var _this = this
							axios({
								method: "post",
								url: "http://114.116.77.118:8888/user/updatePwd",
								dataType: "jsonp",
								data:formData,
								crossDomain: true,
								cache: false,
								withCredentials: true // 允许携带cookie
							}).then(function(res){
								if(res.data.status == 1){
									alert(res.data.message+",请重新登陆！")
									_this.IsUpdatePW_Show = false
									_this.oldPW = ''
									_this.newPW = ''
									// 退出当前登陆
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
								}else{
									alert(res.data.message)
								}
							}).catch(function(error){
								alert(error)
							})
						}
					},
					// 打开修改头像面板
					cutImg_toggle:function(){
						document.getElementById("tailoring-container").style.display = "block"
					}
				}
			})
		}
	})
}
function getItemList() {
	$("#myItemsLoading").show()
	$.ajax({
		url:"http://114.116.77.118:8888/item/listMyItems",
		type:"get",
		datatype:"json",
		xhrFields: {
			withCredentials: true // 这里设置了withCredentials
		},
		success:function (result) {
			$("#myItemsLoading").hide()
			itemVue = new Vue({
				el: "#myItems",
				data: {
					items: [],
					status: result.status,
					showLoading:true,
					IsCandidateShow:false
				},
				created() {
					if(result.status == 1){
						this.items = result.data
					}
				},
				methods:{
					// 获取候选人列表
					getCandidates:function(id,index){
						if($(document).width() > 767){
							var data = {"iid":id}
							var _this = this
							axios({
								method:"get",
								url:"http://114.116.77.118:8888/candidate/list",
								dataType:"json",
								params:data,
								crossDomain: true,
								cache: false,
								withCredentials: true, // 允许携带cookie
							}).then(function(res){
								if(res.data.status == 1){
									_this.items[index].candidates = res.data.data
									_this.showLoading = false
									for(var i = 0;i < res.data.data.length;i++){
										if(_this.items[index].candidates[i].state == 1){
											// 被选中的候选者处理
										}
									}
								}else{
									alert(res.data.message)
								}
							}).catch(function(error){
								alert(error)
							})
							$(".candidate-list").eq(index).show()
						}
					},
					openCandidate:function(id,index){
						if(!this.IsCandidateShow){
							var data = {"iid":id}
							var _this = this
							axios({
								method:"get",
								url:"http://114.116.77.118:8888/candidate/list",
								dataType:"json",
								params:data,
								crossDomain: true,
								cache: false,
								withCredentials: true, // 允许携带cookie
							}).then(function(res){
								if(res.data.status == 1){
									_this.items[index].candidates = res.data.data
									_this.showLoading = false
									_this.IsCandidateShow = true
									$(".candidate-list").eq(index).show()
									$(".openCandidate").eq(index).toggleClass("glyphicon-chevron-down")
									$(".openCandidate").eq(index).toggleClass("glyphicon-chevron-up")
									for(var i = 0;i < res.data.data.length;i++){
										if(_this.items[index].candidates[i].state == 1){
											// 被选中的候选者处理
										}
									}
								}else{
									alert(res.data.message)
								}
							}).catch(function(error){
								alert(error)
							})
						}else{
							$(".candidate-list").eq(index).hide()
							this.showLoading = true
							this.IsCandidateShow = false
							$(".openCandidate").eq(index).toggleClass("glyphicon-chevron-down")
							$(".openCandidate").eq(index).toggleClass("glyphicon-chevron-up")
						}
					},
					// 隐藏候选人列表
					hideCandidates:function(index){
						if($(document).width() > 767){
							$(".candidate-list").eq(index).hide()
							this.showLoading = true
						}
					},
					ToItemPage:function(id){
						window.location.href = "item.html?id="+id
					},
					candidate_Info:function(uid,iid){
						window.location.href="userInfo.html?uid="+uid+"&iid="+iid
					},
					// 下架项目
					closeItem:function(id,index){
						if(confirm("确定下架该项目吗？")){
							var data = {"id":id}
							var _this = this
							axios({
								method:"post",
								url:"http://114.116.77.118:8888/item/close",
								dataType:"json",
								params:data,
								crossDomain: true,
								cache: false,
								withCredentials: true, // 允许携带cookie
							}).then(function(res){
								if(res.data.status == 1){
									_this.items[index].state = 0
								}else{
									alert(res.data.message)
								}
							}).catch(function(error){
								alert(error)
							})
						}
					}
				}
			})
		}
	})
}
function getBlogList() {
	$("#myBlogsLoading").show()
	$.ajax({
		url:"http://114.116.77.118:8888/blog/listMyBlogs",
		type:"get",
		datatype:"json",
		xhrFields: {
			withCredentials: true // 这里设置了withCredentials
		},
		success:function (result) {
			$("#myBlogsLoading").hide()
			blogVue = new Vue({
				el: "#myBlogs",
				data: {
					blogs: [],
					status: result.status,
					
					old_src:[],
					img_src:[],
					img_files:[],
					delImg_src:[],
					previewImg_style:null,//图片预览区域是否显示
				},
				created() {
					if(this.status == 1){
						this.blogs = result.data
					}
					// content回车符替换
					var reg = new RegExp("\n|\r\n", "g");//g,表示全部替换
					for(var j = 0;j < this.blogs.length;j++){
						this.blogs[j].content = this.blogs[j].content.replace(reg, "<br/>");
						this.blogs[j].content = this.blogs[j].content.replace(/\s/g,"&nbsp;")
						this.old_src.push(this.blogs[j].pictures)
					}
					$(".edit-part").hide()
				},
				methods:{
					// 删除
					delBlog:function(bid,i){
						if(confirm("真的要删除这条动态吗？") == true){
							var data = {"id": bid};
							var _this = this
							axios({
								url: "http://114.116.77.118:8888/blog/delete",
								method: "post",
								params: data,
								dataType:"json",
								withCredentials: true ,// 这里设置了withCredentials
							}).then(function (result) {
								if (result.data.status == 1) {
									_this.blogs.splice(i,1)
								} else {
									alert(result.data.message);
								}
							}).catch(function (error) {
								alert(error);
							})
						}
					},
					// 编辑
					editBlog:function(bid,i){
						$(".blog-content").eq(i).hide()
						$(".edit-part").eq(i).show()
						var reg = new RegExp("<br/>", "g");//g,表示全部替换
						this.blogs[i].content = this.blogs[i].content.replace(reg,"\r\n")
						if(this.img_files.length > 0 || this.old_src.length > 0){
							this.previewImg_style = {display:"flex"}
						}else{
							this.previewImg_style = null
						}
					},
					// 取消编辑
					cancleEdite:function(i) {
						$(".blog-content").eq(i).show()
						$(".edit-part").eq(i).hide()
						var reg = new RegExp("\n|\r\n", "g");//g,表示全部替换
						this.blogs[i].content = this.blogs[i].content.replace(reg,"<br/>")
						if(this.img_files.length > 0 || this.old_src.length > 0){
							this.previewImg_style = {display:"flex"}
						}else{
							this.previewImg_style = null
						}
					},
					// 点赞
					doFavour:function (bid,i) {
						var _this = this
						var data = {"bid": bid};
						axios({
							url: "http://114.116.77.118:8888/favour/doFavour",
							method: "get",
							params: data,
							dataType:"json",
							withCredentials: true ,// 这里设置了withCredentials
							}).then(function (result) {
								if (result.data.status == 1) {
									_this.blogs[i].favourCount++
								} else {
									alert(result.data.message);
								}
							}).catch(function (error) {
								alert(error);
							})
					},
					/*****头像预览*****/
					// 删除新图片
					delPic:function(index){
						this.img_files.splice(index,1)
						this.update_imgSrc()
						if(this.img_files.length > 0 || this.old_src.length > 0){
							this.previewImg_style = {display:"flex"}
						}else{
							this.previewImg_style = null
						}
					},
					// 删除原来图片
					deloldPic:function(index){
						// 当前展示的图片url数组中去除该图片
						this.old_src.splice(index,1)
						// 记录待删除的图片
						this.delImg_src.push(this.img_files[index])
						if(this.old_src.length > 0 || this.img_files.length > 0){
							this.previewImg_style = {display:"flex"}
						}else{
							this.previewImg_style = null
						}
					},
					//上传图片
					files_change:function(){
						var files = document.getElementById('pictures').files
						for(var i = 0;i < files.length;i++){
							this.img_files.push(files[i])
						}
						this.update_imgSrc()
						if(this.img_files.length > 0 || this.old_src.length > 0){
							this.previewImg_style = {display:"flex"}
						}else{
							this.previewImg_style = null
						}
					},
					// 依据图片文件数组更新图片预览路径数组
					update_imgSrc:function(){
						this.img_src.splice(0,this.img_src.length)//清空原来的图片预览路径数组
						for(var i = 0;i < this.img_files.length;i++){
							this.img_src.push(this.getObjectURL(this.img_files[i]))
						}
					},
					//建立一个可存取到该file的url
					getObjectURL:function(file) {
						var url = null ;
						if (window.createObjectURL!=undefined) { // basic
							url = window.createObjectURL(file) ;
						} else if (window.URL!=undefined) { // mozilla(firefox)
							url = window.URL.createObjectURL(file) ;
						} else if (window.webkitURL!=undefined) { // webkit or chrome
							url = window.webkitURL.createObjectURL(file) ;
						}
						return url ;
					},
					/*****头像预览-end*****/
					publishBlog:function(bid,i) {
						var files = this.img_files;
						var content = this.blogs[i].content
						// 请求当前blog对象
						var data = {"id": bid}
						var _this = this
						axios({
						    url:"http://114.116.77.118:8888/blog/getById",
						    method:"get",
						    params:data,
						    datatype:"json",
							cache: false,
							processData: false,
							contentType: false,
							withCredentials: true,
						}).then(function(result){
							if(result.data.status == 1){
								var blog = result.data.data
								// 清除blog.pictures内保存的已删除图片url
								for(var p = 0;p < _this.delImg_src.length;p++){
									for(var t = 0;t < blog.pictures.length;t++){
										if(blog.pictures[t].url == _this.delImg_src[p]){
											blog.pictures.splice(t,1)
										}
									}
								}
								// 逐一上传图片
								var callBackTime = 0
								for(var i = 0;i < files.length;i++){
									var fData = new FormData();
									fData.append("file",files[i])
									axios({
										method:"post",
										url:"http://114.116.77.118:8888/file/upPicture",
										dataType:"json",
										data: fData,
										cache: false,
										processData: false,
										contentType: false,
										withCredentials: true
									}).then(function(result){
										if(result.data.status == 1){
											callBackTime++
											var picture = {
												"bid":blog.id,
												"url":result.data.data
											}
											blog.pictures.push(picture)
											if(callBackTime == files.length){
												blog.content = content
												var blogobject = new FormData();
												blogobject.append("blog",blog)
												axios({
													method:"post",
													url: "http://114.116.77.118:8888/blog/update",
													data: blogobject,
													dataType:"json",
													cache: false,
													processData: false,
													contentType: false,
													withCredentials: true
												}).then(function(result){
													if (result.data.status == 1) {
														window.location.reload();
													} else {
														alert(result.data.message);
													}
												}).catch(function (error) {
													alert("发布失败");
												})
											}
										}else{
											alert(result.data.message)
										}
									}).catch(function(error){
										alert(error)
									})
								}
								if(files.length == 0){
									blog.content = content
									var blogobject = {"blog":blog};
									axios({
										method:"post",
										url: "http://114.116.77.118:8888/blog/update",
										params: blogobject,
										dataType:"json",
										cache: false,
										processData: false,
										contentType: false,
										withCredentials: true
									}).then(function(result){
										if (result.data.status == 1) {
											window.location.reload();
										} else {
											alert(result.data.message);
										}
									}).catch(function (error) {
										alert("发布失败");
									})
								}
							}else{
								alert(result.data.message)
							}
						}).catch(function(error){
							alert(error)
						})
						// 删除服务器内的图片
						for(var j = 0;j < this.delImg_src.length;j++){
							var fData = {"url":delImg_src[j]}
							axios({
								method:"post",
								url:"http://114.116.77.118:8888/file/delPicture",
								dataType:"json",
								data: fData,
								cache: false,
								processData: false,
								contentType: false,
								withCredentials: true
							}).then(function(result){
								if(result.data.status == 1){
									
								}else{
									alert(result.data.message)
								}
							}).catch(function(error){
								alert(error)
							})
						}
					},
					
					
				}
			})
		}
	})
}
function getOrderList(){
	$(".myOrdersH3").eq(1).toggleClass("currOrders")
	new Vue({
		el:"#myOrders",
		data:{
			orders:[],
			showAsList:false,
			// 屏幕宽度
			screenWidth:$(document).width(),
		},
		created() {
			this.getMyCreated()
			console.log(this.showAsList)
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
				if(newVal < 767){
					this.showAsList = true
				}else{
					this.showAsList = false
				}
			}
		},
		methods:{
			// 获取自己创建的订单
			getMyCreated:function(){
				$("#myOrdersLoading").show()
				var _this = this
				axios({
					url: "http://114.116.77.118:8888/order/listMyCreated",
					method: "get",
					dataType:"json",
					withCredentials: true ,// 这里设置了withCredentials
				}).then(function (result) {
					$("#myOrdersLoading").hide()
					if (result.data.status == 1) {
						_this.orders = result.data.data
						
						// for(var i = 0;i < _this.orders.length;i++){
						// 	_this.getUserByID(_this.orders[i].aid,_this.orders[i].author)
						// 	_this.getUserByID(_this.orders[i].uid,_this.orders[i].user)
						// 	_this.getItenByID(_this.orders[i].iid,_this.orders[i].itemTitle)
						// }
					} else {
						// alert(result.data.message);
					}
				}).catch(function (error) {
					alert(error);
				})
			},
			// 获取自己接的订单
			getMyJoined:function(){
				$("#myOrdersLoading").show()
				var _this = this
				axios({
					url: "http://114.116.77.118:8888/order/listMyJoined",
					method: "get",
					dataType:"json",
					withCredentials: true ,// 这里设置了withCredentials
				}).then(function (result) {
					$("#myOrdersLoading").hide()
					if (result.data.status == 1) {
						_this.orders = result.data.data
					} else {
						// alert(result.data.message);
					}
				}).catch(function (error) {
					alert(error);
				})
			},
			// 订单类型切换
			change_ordersToCreated:function(){
				$(".myOrdersH3").eq(0).toggleClass("currOrders")
				$(".myOrdersH3").eq(1).toggleClass("currOrders")
				this.getMyCreated()
			},
			change_ordersToJoined:function(){
				$(".myOrdersH3").eq(0).toggleClass("currOrders")
				$(".myOrdersH3").eq(1).toggleClass("currOrders")
				this.getMyJoined()
			},
			
			// 根据id获取用户信息
			getUserByID:function(id,user){
				var data = {"id":id}
				axios({
					method:"get",
					url:"http://114.116.77.118:8888/user/userInfo",
					params: data,
					dataType:"json",
					withCredentials: true ,// 这里设置了withCredentials
				}).then(function(res){
					if(res.data.status == 1){
						user = res.data.data.username
					}else{
						alert(res.data.message)
					}
				})
			},
			// 根据id获取项目信息
			getItenByID:function(id,item){
				var data = {"id":id}
				axios({
					method:"get",
					url:"http://114.116.77.118:8888/item/getById",
					params: data,
					dataType:"json",
					withCredentials: true ,// 这里设置了withCredentials
				}).then(function(res){
					if(res.data.status == 1){
						item = res.data.data.title
					}else{
						alert(res.data.message)
					}
				})
			},
			// 跳转到item详情页面
			ToItemPage:function(id){
				window.location.href = "item.html?id="+id
			}
			
		}
	})
}

$(".openNav").click(function(){
	if($(".openNav").hasClass("glyphicon-chevron-right")){
		$(".main-nav").animate({
			left:'0'
		})
	}else{
		$(".main-nav").animate({
			left:'-43%'
		})
	}
	$(".openNav").toggleClass("glyphicon-chevron-right")
	$(".openNav").toggleClass("glyphicon-chevron-left")
})

$(".main-content").click(function(){
	if($(".openNav").hasClass("glyphicon-chevron-left")){
		$(".main-nav").animate({
			left:'-43%'
		})
		$(".openNav").toggleClass("glyphicon-chevron-right")
		$(".openNav").toggleClass("glyphicon-chevron-left")
	}
})

function Show_userInfo(){
	$("#userInfo").show()
	$("#myBlogs").hide()
	$("#myItems").hide()
	$("#myOrders").hide()
	
	var current_li = $(".main-nav li").eq(0)
	current_li.attr("class","current-nav")
	$(".main-nav li").not(current_li).removeAttr("class")
}
function Show_myBlogs(){
	$("#userInfo").hide()
	$("#myBlogs").show()
	$("#myItems").hide()
	$("#myOrders").hide()
	
	var current_li = $(".main-nav li").eq(1)
	current_li.attr("class","current-nav")
	$(".main-nav li").not(current_li).removeAttr("class")
	
	// getBlogList()
}
function Show_myItems(){
	$("#userInfo").hide()
	$("#myBlogs").hide()
	$("#myItems").show()
	$("#myOrders").hide()
	
	var current_li = $(".main-nav li").eq(2)
	current_li.attr("class","current-nav")
	$(".main-nav li").not(current_li).removeAttr("class")
	
	// getItemList()
}
function Show_myOrders(){
	$("#userInfo").hide()
	$("#myBlogs").hide()
	$("#myItems").hide()
	$("#myOrders").show()
	
	var current_li = $(".main-nav li").eq(3)
	current_li.attr("class","current-nav")
	$(".main-nav li").not(current_li).removeAttr("class")
}