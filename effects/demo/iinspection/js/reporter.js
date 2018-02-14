/*下载图标，手机图标悬浮变色*/
$("#div").on("mouseover",".iconfont",function(){
	$(this).css('color','#333333');
});
$("#div").on("mouseout",".iconfont",function(){
	$(this).css('color','#999999');
})