new Vue({
	el:'.main-content',
	data:{
		img_src:[],
		img_files:[],
		previewImg_style:null,//图片预览区域是否显示
		text_content:'',
		blogs:[],
		showLoading:true,//页面加载显示加载图片
		pageSize:10,
		currPage:1,
		loadMoreLoadingPIC:false//加载更多动态时显示加载图片
	},
	created() {
		this.getBlogList(this.pageSize,1)
	},
	methods:{
		/*****图片预览*****/
		// 删除图片
		delPic:function(index){
			this.img_files.splice(index,1)
			this.update_imgSrc()
			if(this.img_files.length > 0){
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
			if(this.img_files.length > 0){
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
		/*****图片预览-end*****/
		publishBlog:function() {
			var files = this.img_files;
			var content = this.text_content;
			var formData = new FormData();
			
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
						formData.append("picUrls",result.data.data)
						if(callBackTime == files.length){
							formData.append("content", content);
							axios({
								method:"post",
								url: "http://114.116.77.118:8888/blog/publish",
								data: formData,
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
				formData.append("content", content);
				axios({
					method:"post",
					url: "http://114.116.77.118:8888/blog/publish",
					data: formData,
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
		},
		doFavour:function (bid,i) {
			var _this = this
			var data = {"bid": bid};
			axios({
				method:"get",
				url: "http://114.116.77.118:8888/favour/doFavour",
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
				alert("点赞失败。");
			})
		},
		getBlogList:function (Psize,currP) {
			var _this = this
			var data = {
				currPage:currP,
				pageSize:Psize
			}
			axios({
				method:"get",
				url:"http://114.116.77.118:8888/blog/listByTime",
				datatype:"json",
				params:data
			}).then(function (result) {
				//加载图片隐藏
				_this.showLoading = false
				_this.loadMoreLoadingPIC = false
				if(result.data.status == 1){
					//累加blog
					_this.blogs.push.apply(_this.blogs,result.data.data)
					// 替换动态中的空格和回车符
					var reg = new RegExp("\n|\r\n", "g");//g,表示全部替换
					for(var j = 0;j < _this.blogs.length;j++){
						_this.blogs[j].content = _this.blogs[j].content.replace(reg, "<br/>");
						_this.blogs[j].content = _this.blogs[j].content.replace(/\s/g, "&nbsp;");
					}
				}else{
					alert(result.data.message)
				}
			}).catch(function (error) {
				alert(error);
			})
		},
		loadMore:function(){
			this.currPage++
			this.loadMoreLoadingPIC = true
			this.getBlogList(this.pageSize,this.currPage)
		}
		
	}
})
$(function () {
	getLoginUser();
})
function getLoginUser() {
	$.ajax({
		url:"http://114.116.77.118:8888/user/getLoginUser",
		type:"get",
		datatype:"json",
		xhrFields: {
			withCredentials: true // 这里设置了withCredentials
		},
		success:function (result) {
			
		}
	})
}