/*刑侦画布*/
/*命名规则:尽量使用原译英文,存在冲突或者需要加后缀则用下划线_(例tab_id)*/
/*全局变量*/
var activeTab;//点击的tab	
var previousTab;//存放上一个tab页，默认为空。
var list;
var token;
var details_msg;//案情详情
var graph;//画布信息
var add_canvas;//加载画布的加号
var addIndex;//存放左侧加号索引
var searchCase_id /*= '00000c75-3278-4d31-84b6-f837dbb34ae3'*/;//当前展开的画布案情id
/*获取元素*/


/*页面加载即执行*/
$(function(){ 
　　	$.ajax({
        type: "post",
        url: BASE_URL + '/user/login',
        data: JSON.stringify({
            "params": {
              "account":"hogan",               
        		  "password":"hogan",                
        		  "ds_category":1   
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            token = res.detail.token;
        },
        error: function() {
            alert("获取数据失败");
        }
    });
	/*var unixTimestamp = new Date( 1477386005*1000 ) ;
	commonTime = unixTimestamp.toLocaleString();
	console.log(commonTime);*/
}); 

/*功能实现*/
/*添加tab选项卡*/
function addTab(add_index) {
	var tab_id = add_index;//$("#tab-ul").children("li").length;//用于标识当前画布的唯一标识和tab选项的标识
	//tab_id++;
	var tab_ul = $("#tab-ul"),//存放li标签的ul
	    tab_lis = tab_ul.children("li"),
	    content_body = $("#content-body");//存放画布的div
	if (!tab_lis.length && content_body.children().length ===1) {
		content_body.children().remove();
		/*添加tab选项卡*/
		var tab_li = '<li role="presentation" class="active tab_li" style="width: 33%;height: 100%;padding: 0px;margin:0px;border-right:1px solid #fff;border-bottom: 0px;">' +
                     		'<a href="#tab'+tab_id+'" aria-controls = "tab'+tab_id+'" role="tab" data-toggle="tab" style="padding: 0px 15px; height: 100%;width: 100%;border:0px;">' +
                                '<button type="button" class="close" aria-label="Close" style="width: 20px;height: 20px;margin-top: 3px;float: left;opacity: 1;">' +
                                    '<span aria-hidden="true" style="margin: 0px; width: 20px;height: 20px;" ><img src="img/刑侦画布 关闭.png" style="width:17px;height:17px;"></span></button>' + 
                                '<span style="height: 30px;width: 100%;margin: 0px;">' + 
                                    '<input type="text" value="刑侦画布'+tab_id+'" style="width: 80%;height: 25px;border: none;margin-top: 3px;background-color: inherit;" disabled="disabled">' +
                                '</span></a></li>';
		tab_ul.append(tab_li);
		/*添加tab选项内容*/
		searchCase_id = list[add_index].caseId;//存放当前要展开画布的节点的案情id
		var tab_content = '<div role="tabpanel" class="tab-pane active" id="tab'+tab_id+'" style="width: 100%;height: 100%;border: 0px;">' +
                    '<iframe src="graph.html" style="width: 100%;height: 100%;border: 0px;">tab1</iframe></div>';
		content_body.append(tab_content);
	}
	else {
		var tab_li = '<li role="presentation" class="tab_li" style="width: 33%;height: 100%;padding: 0px;margin:0px;border-right:1px solid #fff;border-bottom: 0px;">' +
                     		'<a href="#tab'+tab_id+'" aria-controls = "tab'+tab_id+'" role="tab" data-toggle="tab" style="padding: 0px 15px; height: 100%;width: 100%;border:0px;">' +
                                '<button type="button" class="close" aria-label="Close" style="width: 20px;height: 20px;margin-top: 3px;float: left;opacity: 1;">' +
                                    '<span aria-hidden="true" style="margin: 0px; width: 20px;height: 20px;" ><img src="img/刑侦画布 关闭.png" style="width:17px;height:17px;"></span></button>' + 
                                '<span style="height: 30px;width: 100%;margin: 0px;">' + 
                                    '<input type="text" value="刑侦画布'+tab_id+'" style="width: 80%;height: 25px;border: none;margin-top: 3px;background-color: inherit;" disabled="disabled">' +
                                '</span></a></li>';
		tab_ul.append(tab_li);
		/*添加tab选项内容*/
		var tab_content = '<div role="tabpanel" class="tab-pane" id="tab'+tab_id+'" style="width: 100%;height: 100%;border: 0px;">' +
                    '<iframe src="graph.html" style="width: 100%;height: 100%;border: 0px;">tab2</iframe></div>';
		content_body.append(tab_content);
	}
	/*动态创建tab标签页*/
	//实现事件响应函数，当tab页被点击时被触发
  $('a[data-toggle="tab"]').on('shown.bs.tab',function(e){
    //获取当前被显示的tab页标签的aria-controls属性值
    activeTab = $(e.target).attr("aria-controls");
    //获取前一个被显示的tab页标签的aria-controls属性值
    previousTab = null;
    previousTab = $(e.relatedTarget).attr("aria-controls");
    //console.log(activeTab); 
  });
  //点击待关闭按钮tab也上的X后的响应事件
  $(".close").click(function(e) {
    var thisTab = $(e.target).parent().parent().parent().attr("aria-controls");
    addIndex = thisTab.split("")[thisTab.split("").length - 1];
    //console.log($(e.target).parent().parent().parent().attr("aria-controls"));
    $(this).parent().parent().css("display","none");
    $("#"+thisTab).css("display","none");
    $(this).parent().parent().remove();
    $("#"+thisTab).remove();
    var tabs=$("#tab-ul").children("li").length;
    if(!previousTab){
    	$('#tab-ul a[href="#'+previousTab+'"]').tab('show');
    }
    if (!tabs) {
    	$("#content-body").children().remove();
    	$("#content-body").append('<img src="./img/添加.png" class="middle-add" style="cursor: pointer;">');
    	//add_canvas.parent().parent().children().eq(add_index).children().eq(3).show(500);//显示加号
    }
    add_canvas.parent().parent().children().eq(addIndex).children().eq(3).show(500);//显示加号
    return false;
  });
  var tabs = $(".tab_li");
  var indexOld = -1;
  tabs.each(function(){
    var tab  = $(this);
    var index = $(this).index();
    var preTab;
    tab.click(function(e) {
            if(index==indexOld){
                var thisTab = $(this).children().children().eq(1).children().eq(0);
                preTab = thisTab;
                thisTab.attr("disabled",false);
            }
            else if(indexOld==-1){
                console.log("first click");
            }
            else{
                console.log("diffrent");
            }
            indexOld=index;
    })
  })
}
/*动态创建tab标签页*/
$(function(){
  //实现事件响应函数，当tab页被点击时被触发
  $('a[data-toggle="tab"]').on('shown.bs.tab',function(e){
    //获取当前被显示的tab页标签的aria-controls属性值
    activeTab = $(e.target).attr("aria-controls");
    //获取前一个被显示的tab页标签的aria-controls属性值
    previousTab = $(e.relatedTarget).attr("aria-controls");
    $(e.relatedTarget).children().eq(1).children().eq(0).attr("disabled",true);
  });
  //点击待关闭按钮tab也上的X后的响应事件
  $(".close").click(function(e) {
    var thisTab = $(e.target).parent().parent().parent().attr("aria-controls");
    addIndex = thisTab.split("")[thisTab.split("").length - 1];
    $(this).parent().parent().css("display","none");
    $("#"+thisTab).css("display","none");
    $(this).parent().parent().remove();
    $("#"+thisTab).remove();
    if(!previousTab){
    	$('#tab-ul a[href="#'+previousTab+'"]').tab('show');
    }
    add_canvas.parent().parent().children().eq(addIndex).children().eq(3).show(500);//显示加号
    return false;
  });
  var tabs = $(".tab_li");
  var indexOld = -1;
  tabs.each(function(){
    var tab  = $(this);
    var index = $(this).index();
    var preTab;
    tab.click(function(e) {
            if(index==indexOld){
                var thisTab = $(this).children().children().eq(1).children().eq(0);
                preTab = thisTab;
                thisTab.attr("disabled",false);
            }
            else if(indexOld==-1){
                console.log("first click");
            }
            else{
                console.log("diffrent");
            }
            indexOld=index;
    })
  })
});
/*搜索案情*/
function search() {
	var search_value = $('#search-value').val();
	var search_result = $('.search-result');
	//addTab();
	console.log(search_value);
	if (search_value !== "") {
		search_result.children().remove();
		getCaseDetail(search_value);
    	if (list.length>0) {
    		for (var i = 0; i < list.length; i++) {
    			search_result.append('<div><p title="'+list[i].title+'">'+list[i].title+'</p><p title="'+list[i].caseId+'"">警情编号 '+list[i].caseId+'</p><span onclick="moreDetails(this)"><label style="font-weight:500;cursor:pointer;">查看更多</label><img src="img/刑侦画布 查看更多.png" class="img"></span><img src="img/刑侦画布添加搜索.png" class="addition" onclick="loadCanvas(this)"><div class="details"></div></div>');
    		}
    	}		
	}
	else{
		alert("请输入搜索关键词...");
	}
	
}
function getCaseDetail(search_value) {
	$.ajax({
        type: "post",
        url: BASE_URL + '/rel/searchCases',
        data: JSON.stringify({
            "params": {
                 "page_num":1,                
        		     "search_word":""+search_value,               
                 "token":""+token 
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            caseDetail = res.detail.pageResult;
            list = caseDetail.list;
        },
        error: function() {
            alert("获取数据失败");
        }
    });
}
/*点击查看更多细节*/
function moreDetails(e) {
	var text = $(e).text();
	var details = $(e).parent().children().eq(4);
	if (text === '查看更多') {
        $(e).children().eq(0).text("收起");
		    $(e).children().eq(1).css("transform-origin","50% 40%");
       	$(e).children().eq(1).transition({ rotate: 180 });
       	//details.text('定义滚动条就是利用伪元素与伪类，那什么是伪元素和伪类呢伪类大家应该很熟悉:link,:focus,:hover，此外CSS3中又增加了许多伪类选择器，如:nth-child，:last-child，:nth-last-of-type()等。CSS中的伪元素大家以前看过：:first-line,:first-letter,:before,:after。那么在CSS3中，伪元素进行了调整，在以前的基础上增加了一个“：”也就是现在变成了“::first-letter,::first-line,::before,::after”，另外CSS3还增加了一个“::selection”。两个“：：”和一个“：”在css3中主要用来区分伪类和伪元素。webkit的伪类和伪元素的实现很强，可以把滚动条当成一个页面元素来定义，再结合一些高级的CSS3属性，比如渐变、圆角、RGBa等等。然后如果有些地方要用图片，可以把图片也可以转换成Base64，不然每次都得加载那个多个图片，增加请求数。任何对象都可以设置：边框、阴影、背景图片等等，创建的滚动条任然会按照操作系统本身的设置来完成其交互的行为。下面的伪类可以应用到上面的伪元素中。有点小复杂，具体怎么写可以看第一个demo，那里也有注释。</div>');
       	var index = details.parent().index();
       	checkMore(index,token);
       	details.append('<label class="type"><label class="red-point"></label>'+details_msg.categoryName+'</label><br>');
       	var unixTimestamp = new Date( list[index].date) ;
		    commonTime = unixTimestamp.toLocaleString();
       	details.append('<label class="time">'+commonTime+'</label><br>');
       	details.append('<label class="content">'+details_msg.brief+'</label><br>');
       	details.append('<label class="front">警情序号&nbsp;</label><label class="letter">'+list[index].caseId+'</label><br>');
       	details.append('<label class="front">出警派出所&nbsp;</label><label class="letter">'+details_msg.police+'</label><br>');
       	details.append('<label class="front">事主&nbsp;</label><label class="letter">'+details_msg.identity+'</label><br>');
       	details.append('<label class="front">反馈信息&nbsp;</label><br>');
       	if (!details_msg.content) {
       		details.append('<p class="response">无</p>');
       	}
       	else {
       		details.append('<p class="response" title="'+details_msg.content+'">'+details_msg.content+'</p>');
       	}
       	var h = details.height() + 95;
       	$(e).parent().transition({ height: h });
       	
	}
	if (text === '收起') {
		$(e).children().eq(0).text("查看更多");
		$(e).children().eq(1).css("transform-origin","50% 50%");
		$(e).children().eq(1).transition({ rotate: 0 });
		$(e).parent().transition({ height: 70 });
		details.children().remove();
	}
}
function checkMore(index,token) {
	$.ajax({
        type: "post",
        url: BASE_URL + '/map/loadCaseDetail',
        data: JSON.stringify({
            "params": {               
        		 "case_id":""+list[index].caseId,               
        		 "token":""+token 
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            details_msg = res.detail.cas;
        },
        error: function() {
            alert("获取数据失败");
        }
    });
}
/*点击“加号”打开画布功能*/
function loadCanvas(e) {
	add_canvas = $(e);
	add_canvas.hide(500); 
	var index = $(e).parent().index();
  searchCase_id = list[index].caseId;
	addTab(index);
}
/*获取画布信息*/
function getCanvasMsg(index,token) {
	$.ajax({
        type: "post",
        url: BASE_URL + '/rel/loadCaseCanvas',
        data: JSON.stringify({
            "params": {               
        		 "case_id":""+list[index].caseId/*00000c75-3278-4d31-84b6-f837dbb34ae3*/,               
        		 "token":""+token 
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            var g = res.detail;
            for(var i = 0;i<g.nodes.length;i++) {
              g.nodes[i].attributes = {"x":0,"y":50};
            }
            graph = g;
        },
        error: function() {
            alert("获取数据失败");
        }
    });
}
