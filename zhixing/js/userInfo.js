function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
$(function () {
	var id = getQueryString("uid");
	getUserInfo(id);
	getBlogList(id);
	
	var iid = getQueryString("iid");
	if(iid == null){
		$("#choose").remove()
	}
})
function getUserInfo(id){
	$("#userInfoLoading").show()
	var data = {"id":id}
	axios({
		method:"get",
		url:"http://114.116.77.118:8888/user/userInfo",
		params: data,
		dataType:"json",
		withCredentials: true ,// 这里设置了withCredentials
	}).then(function(res){
		if(res.data.status == 1){
			$("#userInfoLoading").hide()
			new Vue({
				el:'#userInfo',
				data:{
					user:res.data.data
				}
			})
		}else{
			alert(res.data.message)
		}
	})
}
function getBlogList(id){
	$("#myBlogsLoading").show()
	var data = {"aid":id}
	axios({
		method:"get",
		url:"http://114.116.77.118:8888/blog/listOnes",
		params: data,
		dataType:"json",
	}).then(function(res){
		if(res.data.status == 1){
			$("#myBlogsLoading").hide()
			new Vue({
				el:'#myBlogs',
				data:{
					blogs:res.data.data
				},
				created() {
					var reg = new RegExp("\n|\r\n","g")
					for(var i = 0;i < this.blogs.length;i++){
						this.blogs[i].content = this.blogs[i].content.replace(reg,"<br/>")
					}
				}
			})
		}else{
			alert(res.data.message)
		}
	})
}

function choose(){
	var uid = getQueryString("uid");
	var iid = getQueryString("iid");
	var data = {"uid":uid,"iid":iid}
	axios({
		method:"post",
		url:"http://114.116.77.118:8888/order/create",
		params:data,
		withCredentials: true ,// 这里设置了withCredentials
	}).then(function(res){
		alert(res.data.message)
	}).catch(function(error){
		alert(error)
	})
}

function Show_userInfo(){
	$("#userInfo").show()
	$("#myBlogs").hide()
	
	var current_li = $(".main-nav li").eq(0)
	current_li.attr("class","current-nav")
	$(".main-nav li").not(current_li).removeAttr("class")
}
function Show_myBlogs(){
	$("#userInfo").hide()
	$("#myBlogs").show()
	
	var current_li = $(".main-nav li").eq(1)
	current_li.attr("class","current-nav")
	$(".main-nav li").not(current_li).removeAttr("class")
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