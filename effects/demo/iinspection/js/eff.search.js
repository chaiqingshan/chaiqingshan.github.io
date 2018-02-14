var baseurl = 'http://124.127.117.32:8887/iinbjservice';
var caseList = {};
var html = '';
var total_search_eff;
//搜索警情信息
function getAllCaseBySearchWord(search_word, case_category, police_station, start_date, end_date, token, page_num, flag){
    $.ajax({
        type: "post",
        url: baseurl + '/map/searchCases',
        data: JSON.stringify({
            "params": {
                "search_word": search_word,
                "case_category": case_category,
                "police_station": police_station,
                "start_date": start_date,
                "end_date": end_date,
                "token": token,
                "page_num": page_num,
                "flag" :flag
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            caseList = res.detail.pageResult.list;
            if(caseList.length == 0){
                alert("没有符合要求的数据");
            }
            total_search_eff = res.detail.pageResult.total;
            html = '';
            for(var i=0;i<caseList.length;i++){
                var listItem = "list"+(i+1);
                html += '<li class="list-group-item" id="'+listItem+'">'
                            + '<input type="checkbox" style="width: 12px;height: 12px;float:left" class="single_check check">'
                            + '<span style="float:left;margin-left:5px;width:205px;">'
                                + translateTimeStamptoTime(caseList[i].date) 
                            + '</span>'
                            + '</input>'
                            + '<span style="display:block;float:left;width:370px; overflow:hidden;text-overflow:ellipsis;white-space: nowrap">' 
                                + caseList[i].title
                            + '</span>'
                            + '<span style="width:175px;display:block;float:left;">'
                                + translatenumtoCharacter(caseList[i].category)
                            + '</span>'
                            + '<span style="display:block;float:left;width:170px; overflow:hidden;text-overflow:ellipsis;white-space: nowrap">'
                                + isEmpty(caseList[i].location)
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
//判断是否为空
function isEmpty(word){
    if(word != null)
        return word;
    return '辖区未定义';
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
function translatenumtoCharacter(n){
    var page = n;
    switch(page){
        case 0:
            return "刑事类";
            break;
        case 1:
            return "治安类";
            break;
        case 2:
            return "纠纷类";
            break;
        case 3:
            return "民意类";
            break;
    }
}
function translateTypeToNum(type){
    switch(type){
        case '全部':
            return [0,1,2,3];
            break;
        case '刑事类':
            return [0];
            break;
        case '治安类':
            return [1];
            break;
        case '纠纷求助类':
            return [2];
            break;
        case '社情民意类':
            return [3];
            break;
    }
}
var token; 
var search_word;
var flag;
var start_date;
var end_date;
var police_station;
var page;
var case_category;
$("#search-button").click(function(e){
    token = '2050233'; 
    page = 1;
    search_word = $("#search-word").val();
    start_date = $('#from').val();
    end_date = $('#to').val();
    police_station = $('#input_place').html();
    console.log(police_station);
    case_category = $('#input_type').html();
    console.log(translateTypeToNum(case_category));
    flag = 7;
    $("#div").empty();
    getAllCaseBySearchWord(search_word, translateTypeToNum(case_category), police_station, start_date, end_date, token, page, flag);
    $("#News-Pagination").pagination(total_search_eff, {
        items_per_page:10, // 每页显示多少条记录
        num_display_entries:8,//分页显示的条目数
        next_text:"下一页",
        prev_text:"上一页",
        num_edge_entries:2, // 连接分页主体，显示的条目数
    })
});