var htmlDetail = '<div class="month_paper" style="width: 90%;margin:0 auto;">'
			        + '<label style="padding-left: 10px;color:#999999"><a href="reporter.html" style="color:#0850a1">未读列表</a> > 2017.08.01 第一周警情周报</label>'
			        + '<label style="float:right;"><a style="color:#0850a1">上一封</a> <a style="color:#0850a1">下一封</a></label>'
			    + '</div>'
			    + '<div style="width:90%;margin:0 auto;"><label style="padding-left: 10px;font-weight:500;">2017.08.01 第一周警情周报</label></div>'
			    + '<div class="month_paper" style="width: 90%;margin:0 auto;color:#999999;margin-top:-20px;">'
			        + '<label style="padding-left: 10px;">上传时间：2017年08月08日（星期三） 中午14:23</label>'
			        + '<label style="float:right;">'
	                    + '<a style="margin-right: 5px;"> <img class="download-img" src="./img/down_new_old.png"></a>'
	                    + '<a style="margin-right: 5px;"> <img class="phone-img" src="./img/phone_new_old.png"></a>'
                    + '</label>'
			    + '</div>'
			    + '<div style="width: 85%;margin:0 auto;margin-bottom: 50px;color: #111111;font-size: 16px;letter-spacing:2px;" id="content"></div>'
//点击对应的li标签，显示对应的详情
$("#div").on('click','li',function(e){
    var reportId = $(e.target).attr('reportId');
    console.log(reportId);
    for(var i=0;i<reportList.length;i++){
    	if(reportList[i].reportId == reportId){
    		$("#right-common").empty();
    		// $("#News-Pagination").hide();
    	    $("#right-common").append(htmlDetail);
    	    $("#content").append(reportList[i].content);
    	}
    }
});
//点击对应的span标签，显示详情
$("#div").on('click','span',function(e){
    var reportId = $(this).parent().attr('reportId');
    for(var i=0;i<reportList.length;i++){
    	if(reportList[i].reportId == reportId){
    		$("#right-common").empty();
    		$("#page").hide();
    	    $("#right-common").append(htmlDetail);
    	    $("#content").append(reportList[i].content);
    	}
    }
});
//阻止向上冒泡
$("#div").on('click','.iconfont',function(e){
    var reportid = $(this).parent().parent().attr('reportid');
    console.log(reportid);
    var url = 'http://124.127.117.32:8887/iinbjservice/rep/downloadReportDoc?reportId=' + reportid;
    window.location = url;
    e.stopPropagation();
});