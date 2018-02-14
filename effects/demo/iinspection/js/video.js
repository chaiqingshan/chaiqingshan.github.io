$(document).ready(function(){
	$("#dropdown tr").click(function(){
		var text=$(this).children().text()+'<img src="./img/dropdown.png" style="width: 10px;height: 10px;float: right;margin-top:5px;">'
		$("#camera_select").html(text);
		if(($(this).index()+1)<10){
			var location='http://124.127.117.32:8889/minyi/RMDMY_0'+($(this).index()+1)+".mp4";
		}else{
			var location='http://124.127.117.32:8889/minyi/RMDMY_'+($(this).index()+1)+".mp4";
		}
		
		$("#video").attr("src",location);
		$("#video").play();
	});
	$("#dropdown").on('mouseover','tr',function(e){
	$(this).css("background","#f7fbff");
	});
	$("#dropdown").on('mouseout','tr',function(e){
		$(this).css("background","");
	});
});

