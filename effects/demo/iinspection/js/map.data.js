/**
 * 此文件包含以下功能:
 * 1.需要将后端请求到的数据格式拆分成key-value，因此首先声明了用于保存键值对的全局对象，全部对象的key为案件的caseId
 * 2.获取警情信息数据的请求函数getCaseData()
 * 3.拆分警情数据为key-value并且转换成用于ECharts的eventData格式的方法
 * 4.页面初始化加载的请求和时间日期设置
 */


/**
 * 全局键值对对象声明，各字段全部转换成key-value(key为caseId)
 * 目前只用到部分数据字段，可根据情况删减
 */

// 报警时间(date)
var caseTime = {};

// 警情标题(title)
var caseTitle = {};

// 警情类别(category数组)
var caseType = {};

// 案情摘要(brief)
var caseAbstract = {};


// 经纬度(location_point.lon, location_point.lat)
var locationPoint = {};

var latitude = {};
var longitude = {};
/**
 * 存储案情类型的集合：用于将案件按类别归类到不同的ECharts的series中
 */
var typeArr = [];

/**
 * 存储以毫秒为单位计算的案件时间：预存储，用于提高后续排序比较的性能
 */
var caseTimeWithMs = {};

/**
 * startTime、endTime、keyword三个全局变量唯一确定某一时刻的数据
 */
// 起始时间
var startTime = '';
// 终止时间
var endTime = '';
// 关键词 
var searchWord = '';//测试数据
//案件类型
var caseCategory = [];//测试数据
//派出所
var policeStation='';//测试数据
//token 
var token = '';//测试数据
/**
 * 用于保存请求到的case数据
 */
var caseData = [];

/**
 * case数据按类别转换后的eventData
 */
var eventData = {};

// 获取警情详情
var caseDetail = {};
function getCaseDetail(caseId, token) {
    $.ajax({
        type: "post",
        url: BASE_URL + '/map/loadCaseDetail',
        data: JSON.stringify({
            "params": {
                "case_id": caseId,
                "token": token
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            caseDetail = res.detail.cas;
            //console.log(caseDetail);
        },
        error: function() {
            alert("获取数据失败");
        }
    });
}
// 搜索警情信息
function getCaseData(startTime, endTime, searchWord,caseCategory, policeStation,token) {
    // var search_word = $('#search_word').val(),
    //     police_station = $('#police_station').val();
    $.ajax({
        type: 'post',
        url: BASE_URL + '/map/searchCases',
        data: JSON.stringify({
            "params": {
                "search_word": searchWord,
                //"case_category": caseCategory,
                //"police_station": policeStation,
                "start_date": startTime,
                "end_date": endTime,
                "token": token
            }
        }),
        async:false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            caseData = res.detail.cases;
            //临时死数据
            /*caseData = [{
                "caseId": "123456789",
                "title": "张女士被偷了一部手机",
                "category": 1,
                "longitude": "116.468299",
                "latitude": "39.954188",
                "date": "1515794568000"
            },
                {
                    "caseId": "987654321",
                    "title": "李女士被偷了500元现金",
                    "category": 2,
                    "longitude": "116.460000",
                    "latitude": "39.910000",
                    "date": "1515794368000"
                },
                {
                    "caseId": "987664321",
                    "title": "陈先生被抢劫",
                    "category": 3,
                    "longitude": "116.465000",
                    "latitude": "39.928000",
                    "date": "1515794378000"
                }]*/
            // console.log(caseData)
        },
        error: function() {
            alert("获取数据失败");
        }
    })
}
/**
 * 将caseData转换成eventData
 * @param  {对象} caseData [description]
 * @return {对象数组}     [返回eventData]
 */
function cvtCaseData2eventData() {
    // 初始化全部全局变量
    // 报警时间(date)
    caseTime = {};

    // 警情标题(title)
    title = {};

    // 案情摘要(brief)
    caseAbstract = {};

    // 警情类别(category数组)
    caseType = {};

    // 经纬度(location_point.lon, location_point.lat)
    latitude = {};
    longitude = {};

    // 存储案情类别
    typeArr = [];

    // 存储以毫秒计算的时间，用于比较
    caseTimeWithMs = {};

    // 某些关键属性不存在时将该属性赋值undefined，同时将数据拆分
    for (var i = 0; i < caseData.length; i++) {
        // 拆分各类属性
        var caseId = caseData[i].caseId;
        if (caseData[i].date !== undefined) {
            caseTime[caseId] = caseData[i].date;
        } else {
            caseTime[caseId] = undefined;
        }
        if (caseData[i].title !== undefined) {
            caseTitle[caseId] = caseData[i].title;
            
        } else {
            caseTitle[caseId] = undefined;
        }
        if (caseData[i].category !== undefined) {
            var cate="";
            switch(caseData[i].category) {
                case 0:
                    cate="刑事";
                    break;
                case 1:
                    cate="治安";
                    break;
                 case 2:
                    cate="纠纷";
                    break;
                 case 3:
                    cate="民意";
                    break;
                default:
                    cate="其他";
            }
            caseType[caseId] = cate;
        } else {
            caseType[caseId] = undefined;
        }
        if (caseData[i].brief !== undefined) {
            caseAbstract[caseId] = caseData[i].brief;
        } else {
            caseAbstract[caseId] = undefined;
        }
        if (caseData[i].latitude !== undefined) {
            latitude[caseId] = caseData[i].latitude;
        } else {
            latitude[caseId] = undefined;
        }
        if (caseData[i].longitude !== undefined) {
            longitude[caseId] = caseData[i].longitude;
        } else {
            longitude[caseId] = undefined;
        }
        if (caseData[i].date !== undefined) {
            caseTimeWithMs[caseId] = caseData[i].date;
        } else {
            caseTimeWithMs[caseId] = undefined;
        }

        // 计算类别集合
        /*if (typeArr.indexOf(caseType[caseId]) === -1) {
            if (caseType[caseId] !== undefined) {
                typeArr.push(caseType[caseId]);
            }
        }*/

    }
    typeArr = ["纠纷","民意","刑事","治安"];

    // 调用createEventData函数，将caseData转换成按类别分类的eventData
    return createEventData(typeArr, startTime, endTime);
}
/**
 * 将一段时间内的数据组合出按类别加载的散点数据
 * @param  {String} startTime [yyyy-MM-dd hh:00]
 * @param  {String} endTime   [yyyy-MM-dd hh:00]
 * @return {对象} [eventData,key: 案情类别; value: 事件列表; 
 * 事件列表中的对象为: {name: caseTitle, value: [经度, 纬度, caseId]}]
 */
function createEventData(typeArr, startTime, endTime) {
    // 初始化数据结构
    var eventData = {};
    for (i = 0; i < typeArr.length; i++) {
        eventData[typeArr[i]] = [];
    }

    //startTime = Date.parse(startTime);
    //endTime = Date.parse(endTime);
    // 事件按类别添加
    for (var i = 0; i < caseData.length; i++) {
        var caseId = caseData[i].caseId;
        if (/*caseTime[caseId] >= startTime &&
            caseTime[caseId] <= endTime &&*/
            caseTitle[caseId] !== undefined &&
            latitude[caseId] !== undefined &&
            longitude[caseId] !== undefined) {

            var temp = {};
            temp.name = caseTitle[caseId];
            temp.value = [longitude[caseId], latitude[caseId], caseId];
            if (caseType[caseId] !== undefined)
                eventData[caseType[caseId]].push(temp);
        }
    }

   //console.log(eventData)
    return eventData;
}
/**
 * 页面初始时间设置与数据加载(IIFE方式)
 * 当前设置为默认最近的30天
 */
(function() {
    // endTime为当前时间，精确到小时
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if(hour<10){
        hour='0'+hour;
    }
    endTime = year + '-' + month + '-' + day + ' ' + hour + ':00:00';
    // startTime为当前时间向前推60天，86400000为一天的毫秒数,这里改为7天，因为数据量过大
    var before = new Date(now - 86400000 * 3);
    year = before.getFullYear();
    month = before.getMonth() + 1;
    day = before.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    startTime = year + '-' + month + '-' + day + ' 00:00:00';
    // 关键词 
    searchWord = '盗窃';//测试数据
    //案件类型
    //caseCategory = [1, 3];//测试数据
    //派出所
    //policeStation='小红门';//测试数据
    //token 
    token = 2050233;//测试数据

    // 初始化加载数据
    getCaseData(startTime, endTime, searchWord,caseCategory, policeStation,token)
    //console.log("casedata",caseData);
    eventData = cvtCaseData2eventData(caseData);
    console.log("eventdata",eventData);
}());

//页面初始右侧加载24小时最新警情
/*var caseDataNew = [];
(function() {
    // endTime为当前时间，精确到小时
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if(hour<10){
        hour='0'+hour;
    }
    endTime = year + '-' + month + '-' + day + ' ' + hour + ':00:00';
    //24h
    var before = new Date(now - 86400000);
    year = before.getFullYear();
    month = before.getMonth() + 1;
    day = before.getDate();
    hour = before.getHours();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    startTime = year + '-' + month + '-' + day + ' ' + hour + ':00:00';
    // 关键词
    searchWord = '盗窃';//测试数据
    //案件类型
    //caseCategory = [-1];//测试数据
    //派出所
    //policeStation='小红门';//测试数据
    //token
    token = 2050233;//测试数据

    // 初始化加载数据
    $.ajax({
        type: 'post',
        url: baseurl + '/map/searchCases',
        data: JSON.stringify({
            "params": {
                "search_word": searchWord,
                //"case_category": caseCategory,
                //"police_station": policeStation,
                "start_date": startTime,
                "end_date": endTime,
                "token": token
            }
        }),
        async:false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            caseDataNew = res.detail.cases;
            //临时死数据
            /!*caseDataNew = [{
                "caseId": "9876543211",
                "title": "李女士被偷了500元现金",
                "category": 1,
                "longitude": "116.468299",
                "latitude": "38.954188",
                "date": "1515824271000"
                },
                {
                    "caseId": "9876543210",
                    "title": "王女士被偷了一辆自行车",
                    "category": 2,
                    "longitude": "116.7",
                    "latitude": "36.954188",
                    "date": "1515824371000"
                },
            {
                "caseId": "9876543212",
                "title": "陈先生被偷了一部手机",
                "category": 3,
                "longitude": "116.74",
                "latitude": "36.953188",
                "date": "1515827631000"
            }]*!/
            // console.log(caseData)
        },
        error: function() {
            alert("获取数据失败");
        }
    })
    //console.log("casedataNew",caseDataNew);
}());*/

// websocket推送最新警情

// 使用登录的用户名
var user="zhang";
var websocket = null;
//判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
    websocket = new WebSocket("ws://124.127.117.32:9090/webpush/websocket/"+user);
    // websocket = new WebSocket("ws://localhost:8999/webpush/websocket/"+user);
}
else {
    alert('当前浏览器 Not support websocket')
}

//连接发生错误的回调方法
websocket.onerror = function () {
    /*setMessageInnerHTML("WebSocket连接发生错误");*/
    console.log("WebSocket连接发生错误");
};

//连接成功建立的回调方法
websocket.onopen = function () {
    /*setMessageInnerHTML("WebSocket连接成功");*/
    console.log("WebSocket连接成功");
}

//接收到消息的回调方法
websocket.onmessage = function (event) {
    // setMessageInnerHTML(event.data);
    var message = {};
    message = JSON.parse(event.data);
    // console.log("websocket接收数据",message);
    // var detail = message[detail];
    // console.log("detail",detail);
    var latestCases = [];
    var newAlarms = [];
    //var messagelength = Object.getOwnPropertyNames(message).length;
    //console.log("message",messagelength);
    // 根据type字段判断返回数据的类型
    if (message['type'] == "case") {
        latestCases = message.detail;
    } else if (message['type'] == "alarm") {
        newAlarms = message.detail;
    }
    console.log("latestCases", latestCases);
    // 最新警情渲染页面
    showLatestCases(latestCases);
}

//连接关闭的回调方法
/*websocket.onclose = function () {
    setMessageInnerHTML("WebSocket连接关闭");
}*/

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function () {
    closeWebSocket();
}

//将消息显示在网页上
/*
function setMessageInnerHTML(innerHTML) {
    document.getElementById('message').innerHTML += innerHTML + '<br/>';
}
*/

//关闭WebSocket连接
function closeWebSocket() {
    websocket.close();
}

//获取派出所信息
var policeStationList = [];
(function() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/map/loadPoliceStations',
        data: JSON.stringify({
            "params": {
                "token": token
            }
        }),
        async:false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            policeStationList = res.detail.police_stations;
        },
        error: function() {
            alert("获取数据失败");
        }
    })
}());

// 获取警情预测信息
var casePrediction = [];
function getCasePrediction(date, category) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/map/loadCasePrediction',
        data: JSON.stringify({
            "params": {
                "token": token,
                "date": "2018-01-31",
                "category": 1
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function (res) {
            casePrediction = res.detail.case_pred;
        },
        error: function () {
            alert("获取数据失败");
        }
    })
};