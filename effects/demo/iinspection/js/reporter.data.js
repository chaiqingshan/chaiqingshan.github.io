var baseurl = 'http://124.127.117.32:8887/iinbjservice';
var reportList = {};
var html = '';
var total;
//加载全部未读报表信息
function getAllReportInfo(token, page_num, flag){
	$.ajax({
        type: "post",
        url: baseurl + '/rep/loadUnreadCaseReport/',
        data: JSON.stringify({
            "params": {
                "token": token,
                "page_num": page_num,
                "flag": flag
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            reportList = res.detail.pageResult.list;
            total = res.detail.pageResult.total;
            html = '';
            for(var i=0;i<reportList.length;i++){
            	var timeStr = reportList[i].startDate.split(".");
                var year = timeStr[2];
                var month = timeStr[0];
                var week = translateDateToWeek(reportList[i].startDate);
                var rightTime = translateTimeStamptoTime(reportList[i].genDate);
            	var listItem = "list"+(i+1);
            	var spanItem = "span"+(i+1);
            	var reportId = reportList[i].reportId;
            	html  += '<li class="list-group-item" id="'+listItem+'" reportId="'+reportId+'">'
                            + '<input type="checkbox" style="width: 12px;height: 12px;float:left" class="single_check check">'
                            + '<span style="float:left;margin-left:5px;display:block;width:120px;float:left;">'
                                + year + '年' + month + '月'
                            + '</span>'
                            + '<span style="margin-left:-20px;display:block;width:200px;float:left;">'
                                + '第' + week + '周警情周报'
                            + '</span>'
                            + '<span style="display:block;width:150px;float:left;margin-left:370px;">'
                                + rightTime
                            + '</span>'
                            + '<span class="pull-right hide" id="'+spanItem+'">'
                            	+ '<i class="iconfont" style="margin-right:10px;color:#999999;">&#xe606;</i>'
                                + '<i class="iconfont" style="color:#999999;">&#xe602;</i>'
                       		+ '</span>'
                        + '</li>';
            }
            $("#div").append(html); 
        },
        error: function() {
            alert("获取数据失败");
        }
    });
}
//给定时间字符串，返回第几月的第几周
function translateDateToWeek(dateStr){
// 将字符串转为标准时间格式
    dateStr = Date.parse(dateStr);
    dateStr = new Date(dateStr);
  // 先计算出该日期为第几周
    var week = Math.ceil(dateStr.getDate()/7);
    var month = dateStr.getMonth() + 1;
  // 判断这个月前7天是周几，如果不是周一，则计入上个月
    if  (dateStr.getDate() < 7) {
        if (dateStr.getDay() !== 1) {
            week = 5;
            month = dateStr.getMonth();
        }
    }
    return week;
}
//时间戳转换成时间格式
function translateTimeStamptoTime(timestamp){
    var date = new Date(timestamp);
    M = date.getMonth()+1  + '月';
    D = date.getDate() + '日 ';
    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return (M+D+h+m);
}

var page = 1;
var flag  = 1;
var token = '98b94cb14cf4410fb964a9e8575a7010';
function pageOnload(){
    getAllReportInfo(token, page, flag);
    $("#News-Pagination").pagination(total, {
        items_per_page:10, // 每页显示多少条记录
        num_display_entries:8,//分页显示的条目数
        next_text:"下一页",
        prev_text:"上一页",
        num_edge_entries:2, // 连接分页主体，显示的条目数
    });
}