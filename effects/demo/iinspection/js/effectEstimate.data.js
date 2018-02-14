var baseurl = 'http://124.127.117.32:8887/iinbjservice';
var caseList = {};
var html = '';
var total_eff;
//加载全部警情信息 
function getAllCaseInfo(token, page_num, flag){
	$.ajax({
        type: "post",
        url: baseurl + '/rep/findAllCase/',
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
            caseList = res.detail.pageResult.list;
            total_eff = res.detail.pageResult.total;
            html = '';
            for(var i=0;i<caseList.length;i++){
            	translateTimeStamptoTime(caseList[i].date);
            	var listItem = "list"+(i+1);
            	html += '<li class="list-group-item" id="'+listItem+'">'
			            	+ '<input type="checkbox" style="width: 12px;height: 12px;float:left" class="single_check check">'
			            	+ '<span style="float:left;margin-left:5px;width:21%;">'
			            		+ translateTimeStamptoTime(caseList[i].date) 
			            	+ '</span>'
			            	+ '</input>'
			            	+ '<span style="display:block;float:left;width:36.5%; overflow:hidden;text-overflow:ellipsis;white-space: nowrap">' 
			            		+ caseList[i].title
			            	+ '</span>'
			            	+ '<span style="width:26%;display:block;float:left;">'
			            	 	+ caseList[i].categoryName
			            	+ '</span>'
			            	+ '<span style="width:10%;">'
			            		+ caseList[i].police
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
//时间戳转换成时间格式
function translateTimeStamptoTime(timestamp){
	var date = new Date(timestamp);
	Y = date.getFullYear() + '.';
	M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
	D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	return (Y+M+D+h+m);
}

var page = 1;
var flag  = 3;
var token = '2050233';
function pageOnload(){
    getAllCaseInfo(token, page, flag);
    $("#News-Pagination").pagination(total_eff, {
        items_per_page:10, // 每页显示多少条记录
        num_display_entries:8,//分页显示的条目数
        next_text:"下一页",
        prev_text:"上一页",
        num_edge_entries:2, // 连接分页主体，显示的条目数
    });
}