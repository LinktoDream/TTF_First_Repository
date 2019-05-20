//弹出框水平垂直居中
(window.onresize = function () {
	var win_height = $(window).height();
	var win_width = $(window).width();
	if (win_width <= 768){
		$(".tailoring-content").css({
			"top": (win_height - $(".tailoring-content").outerHeight())/2,
			"left": 0
		});
	}else{
		$(".tailoring-content").css({
			"top": (win_height - $(".tailoring-content").outerHeight())/2,
			"left": (win_width - $(".tailoring-content").outerWidth())/2
		});
	}
})();
//弹出图片裁剪框
$("#replaceImg").on("click",function () {
	$(".tailoring-container").toggle();
});
//图像上传
function selectImg(file) {
	if (!file.files || !file.files[0]){
		return;
	}
	var reader = new FileReader();
	reader.onload = function (evt) {
		var replaceSrc = evt.target.result;
		//更换cropper的图片
		$('#tailoringImg').cropper('replace', replaceSrc,false);//默认false，适应高度，不失真
	}
	reader.readAsDataURL(file.files[0]);
}
//cropper图片裁剪
$('#tailoringImg').cropper({
	aspectRatio: 1/1,//默认比例
	preview: '.previewImg',//预览视图
	guides: false,  //裁剪框的虚线(九宫格)
	autoCropArea: 0.5,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
	movable: false, //是否允许移动图片
	dragCrop: true,  //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
	movable: true,  //是否允许移动剪裁框
	resizable: true,  //是否允许改变裁剪框的大小
	zoomable: false,  //是否允许缩放图片大小
	mouseWheelZoom: false,  //是否允许通过鼠标滚轮来缩放图片
	touchDragZoom: true,  //是否允许通过触摸移动来缩放图片
	rotatable: true,  //是否允许旋转图片
	crop: function(e) {
		// 输出结果数据裁剪图像。
	}
});
//旋转
$(".cropper-rotate-btn").on("click",function () {
	$('#tailoringImg').cropper("rotate", 90);
});
//复位
$(".cropper-reset-btn").on("click",function () {
	$('#tailoringImg').cropper("reset");
});
//换向
var flagX = true;
$(".cropper-scaleX-btn").on("click",function () {
	if(flagX){
		$('#tailoringImg').cropper("scaleX", -1);
		flagX = false;
	}else{
		$('#tailoringImg').cropper("scaleX", 1);
		flagX = true;
	}
	flagX != flagX;
});

//裁剪后的处理
$("#sureCut").on("click",function () {
	if ($("#tailoringImg").attr("src") == null ){
		return false;
	}else{
		var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
		var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
		$("#finalImg").prop("src",base64url);//显示为图片的形式
		uploadFile(base64url);
		//关闭裁剪框
		closeTailor();
	}
});

//关闭裁剪框
function closeTailor() {
	$(".tailoring-container").toggle();
}
    

function dataURLtoFile(dataurl, filename) { //将base64转换为文件  
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],  
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);  
    while(n--){  
        u8arr[n] = bstr.charCodeAt(n);  
    }  
    return new File([u8arr], filename, {type:mime});  
}
function uploadFile(file) {  
	var formData = new FormData();
	var userid = $(".username").text()
	formData.append("file", dataURLtoFile(file,userid+".png"));   
	$.ajax({  
		url:"http://114.116.77.118:8888/user/updateAvatar",
		type : 'post',  
		data :formData,
		datatype:"json",
		async: false,   
	    cache: false,   
	    contentType: false,   // 告诉jQuery不要去设置Content-Type请求头  
	    processData: false,   // 告诉jQuery不要去处理发送的数据
		xhrFields: {//带cookie
			withCredentials: true // 这里设置了withCredentials
		},
		success : function(result) {  
			if (result.status == 1) {
				window.location.reload();
			} else {
				alert(result.message);
			}
		},
		error: function () {
			alert("上传头像失败！");
		}
	});  
} 
