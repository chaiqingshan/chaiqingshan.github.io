/**
 * 本文件包含事件处理相关代码:
 * 1.控制面板左侧加载清除案情散点图层、加载清除警车位置数据图层、加载清除巡逻路线数据图层按钮点击事件
 * 2.改变热力图类型事件
 * 3.禁用和恢复地图拖拽的事件
 * 4.选框触发侧边栏弹出事件
 * 5.点击单个案件触发侧边栏弹出事件
 * 6.数据与开始时间、结束时间、关键词的联动事件(时间改变刷新地图、关键词改变刷新地图)
 * 7.重构ECharts原生的散点鼠标hover的tip事件
 * 8.控制面板初始化ctlboardInit函数: 热力图选择动态生成option；设置日期时间插件的显示
 * 9.页面加载时初始化控制面板，并判断语音助手是否要求开启热力图
 * 10.外来人口网格图按钮相关事件
 * 11.犯罪预测网格图按钮相关事件
 */


/**
 * 侧边栏相关变量声明
 */
// 侧边栏图表
var sideChart = null;
// 侧边栏图表配置
var sideOption = null;
// 侧边栏信息模块(选框时用于展示案件列表，点击单个案件时用于展示案件信息)
var $info = $('#side-list .panel-body');
    // 关键词 
var searchWord = '盗窃';//测试数据
    //案件类型
var caseCategory = [-1];//测试数据
    //派出所
var policeStation='小红门';//测试数据
    //token 
var token = 2050233;//测试数据

/**
 * 初始化控制面板
 */
function ctlboardInit() {
    // 热力图 - 根据数据生成select-option
    $('#heatmap-select').text('');
    $('#heatmap-select').append('<option>关闭</option>');
    $('#heatmap-select').append('<option id="heatmap-all">全部</option>');
    var category = "";
    for (var i = 0; i < typeArr.length; i++) {
        category = typeArr[i];
        $('#heatmap-select').append('<option>' + category + '</option>');
    }

    //初始化起始时间和终止时间
    $('#startTime').attr('value', startTime);
    $('#endTime').attr('value', endTime);


    // 初始化时间刻度
    var gridMargin = ($('#outsider-time-choose').width() - 30) / 24;
    var textMargin = ($('#outsider-time-choose').width() - 15) / 4;
    $('#irs-1 .irs-grid .irs-grid-pol').each(function(index) {
        if (index === 25) {
            $(this).css('display', 'none');
        } else if (index % 6 === 0) {
            $(this).removeClass('small');
        } else {
            $(this).addClass('small');
        }
        $(this).css('left', 8 + index * gridMargin);
    });

    $('#irs-1 .irs-grid .irs-grid-text').each(function(index) {
        if (index === 0) {
            $(this).css('left', 5);
        } else if (index !== 0 && index !== 4) {
            $(this).css('left', index * textMargin - 49);
        } else {
            $(this).css('left', index * textMargin - 100);
        }
    });
}


// 页面加载
$(function() {
    // 初始化控制面板
    ctlboardInit();
    // 语音助手图层选项
    var assistantLayer = $('#layer').val();
    if (assistantLayer === 'heatmap') {
        $('#heatmap-select').val('全部').change();
    }
});

//输入框下拉出现选择框
$('#search-input').focus(function(event) {
    var leftwidth=$('#search-input').offset().left+15;
    console.log(leftwidth);
    $('#search-content').css('left',leftwidth);
    $('#search-content').css('display', 'block');
});
$('#search-input').click(function(event) {
    $('#search-content').css('display', 'block');
    //阻止事件冒泡
    event.stopPropagation();
});

$('#nav').click(function(event) {
    $('#search-content').css('display', 'none');
});
$('#main').click(function(event) {
    $('#search-content').css('display', 'none');
});


// 加载案情和清除案情按钮事件
$('#btn-eventctl').click(function(event) {
    // .btn-load为数据加载状态, .btn-clear为数据清除状态
    // 用这两个类来标记当前图层状态
    if ($(this).hasClass('btn-load')) {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'event_load.png';
        // 修改按钮状态
        $(this).addClass('btn-clear').removeClass('btn-load');

        myChart.showLoading();
        // 对eventData数据按照初始化生成的id进行加载
        var i = 0;
        for (var each in eventData) {
            myChart.setOption({
                series: {
                    id: 'eventDataCategory' + i,
                    data: eventData[each]
                }
            });
            i++;
        }
        // 加载legend
        myChart.setOption({
            legend: {
                data: typeArr
            }
        });
        myChart.hideLoading();
    } else {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'event_clear.png';
        // 修改按钮状态
        $(this).addClass('btn-load').removeClass('btn-clear');

        myChart.showLoading();
        // 清除数据
        var tmpSeries = myChart.getOption().series;
        for (var i = 0; i < typeArr.length; i++) {
            var tmp = tmpSeries.pop();
            if (tmp.type === 'scatter' && tmp.id !== 'carPosition') {
                myChart.setOption({
                    series: {
                        id: tmp.id,
                        data: []
                    }
                });
            }
        }
        // 清除legend
        myChart.setOption({
            legend: {
                data: []
            }
        });
        myChart.hideLoading();
    }
});


// 加载位置与清除位置按钮事件
$('#btn-positionctl').click(function(event) {
    // .btn-load为数据加载状态
    if ($(this).hasClass('btn-load')) {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'position_load.png';
        // 修改按钮状态
        $(this).addClass('btn-clear').removeClass('btn-load');

        // 异步请求
        $.ajax({
            type: "get",
            cache: true,
            async: true,
            url: CAR_POSITION_URL,
            success: function(res) {
                policeCarData = $.parseJSON(res);
                // 加载数据
                myChart.showLoading();
                myChart.setOption({
                    series: [{
                        id: 'carPosition',
                        data: convertPoliceCarJsonData(policeCarData)
                    }]
                });
                myChart.hideLoading();
            }
        });
    } else {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'position_clear.png';
        // 修改按钮状态
        $(this).addClass('btn-load').removeClass('btn-clear');
        // 清除数据
        myChart.showLoading();
        myChart.setOption({
            series: [{
                id: 'carPosition',
                data: []
            }]
        });
        myChart.hideLoading();
    }
});


// 加载路线和清除路线按钮事件
$('#btn-linectl').click(function(event) {
    // .btn-load为数据加载状态
    if ($(this).hasClass('btn-load')) {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'line_load.png';
        // 修改按钮状态
        $(this).addClass('btn-clear').removeClass('btn-load');
        // 加载数据
        myChart.showLoading();
        myChart.setOption({
            series: [{
                id: 'policeCarLine',
                // 暂时去除线路效果
                data: linesData
            }, {
                id: 'policeCarEffect',
                data: linesData
            }]
        });
        myChart.hideLoading();
    } else {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'line_clear.png';
        // 修改按钮状态
        $(this).addClass('btn-load').removeClass('btn-clear');
        // 更新数据
        myChart.showLoading();
        myChart.setOption({
            series: [{
                id: 'policeCarLine',
                data: []
            }, {
                id: 'policeCarEffect',
                data: []
            }]
        });
        myChart.hideLoading();
    }
});

//当前是否是外来人口加载状态
var ISOUTHEAT = false;
// 加载和清除外来人口信息按钮事件
$('#btn-outsider').click(function(event) {
    // .btn-load为数据加载状态
    if ($(this).hasClass('btn-load')) {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'Outsider_load.png';
        // 修改按钮状态
        $(this).addClass('btn-clear').removeClass('btn-load');
        // 显示时间面板
        $('#outsider-time-choose').css('display', 'block');
        ISOUTHEAT = true;

    } else {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'Outsider_clear.png';
        // 修改按钮状态
        $(this).addClass('btn-load').removeClass('btn-clear');
        // 隐藏时间面板
        $('#outsider-time-choose').css('display', 'none');

        // 清除数据
        outsiderData = [];
        // 清除图层
        // mapvOutsiderLayer.destroy();
        // outsiderFirst = 1;
        myChart.setOption({
            series: {
                id: 'outsiderHeatmap',
                data: []
            },

            visualMap: {
                id: 'outsiderVisualMap',
                show: false
            }
        });
        ISOUTHEAT = false;
    }
});

// 外来人口数据时间选择、请求数据、加载数据
$('#outsider-time-choose input')
    .datetimepicker({
        //format: 'yyyy-mm-dd hh:00',
        format: 'yyyy-mm-dd',
        weekStart: 1,
        startView: 'month',
        minView: 'month',
        todayBtn: true,
        todayHighlight: true,
        language: 'zh-CN',
        minuteStep: 1,
        pickerPosition: 'bottom-right',
        autoclose: true
    })
    .on('click', function() {
        // 外来人口热力图没有时间选择限制
        $('#outsider-time-choose input').datetimepicker('setStartDate', null);
    })
    .on('changeDate', function() {
        // 传给后端的时间字符串
        var timeStr = '';
        // 获取开始时间
        timeStr = $(this).val();
        // 时间格式需要转换成字符串"YYYYMMDDhh"
        timeStr = timeStr.split(/\s|-|:/).join('');
        // 隐藏时间面板
        //$('#outsider-time-choose').css('display', 'none');

        // 测试数据
        /* outsiderData = [{ latitude: 39.971966, longitude: 116.557913 },
         { latitude: 40.014113, longitude: 116.478897 },
         { latitude: 39.955093, longitude: 116.457958 }
         ];
         mapvOutsiderLayer = new mapv.baiduMapLayer(bmap, cvtOutsiderData2MapvData(outsiderData), getOutsiderMapvOption());
         mapvOutsiderLayer.show(); */

        // 请求数据
        /* $.ajax({
         type: "POST",
         url: OUTSIDER_URL,
         data: JSON.stringify({
         params: {
         timeStr: timeStr
         }
         }),
         dataType: "json",
         contentType: 'application/json',
         async: false,
         success: function(res) {
         outsiderData = res.detail.outsiders;
         // 绘制图层
         mapvOutsiderLayer = new mapv.baiduMapLayer(bmap, cvtOutsiderData2MapvData(outsiderData), getOutsiderMapvOption());
         mapvOutsiderLayer.show();
         }
         }); */
    });

// 点击时间图标触发时间选择
$('#outsider-time-choose i').on('click', function() {
    $('#outsider-time-choose input').focus().click();
});
var outsiderFirst = 1;
// 外来人口时间轴插件
$("#outsider-time-line").ionRangeSlider({
    min: 0,
    max: 24,
    from: 0,
    to: 24,
    type: 'single', //设置类型,为单向
    step: 1,
    prefix: "", //设置数值前缀
    postfix: "时", //设置数值后缀
    prettify: true,
    hasGrid: true,
    onFinish: function(event) {
        /*bmap.addEventListener("dragend",function(){
         if (ISOUTHEAT == true ) {
         lazy(event);
         }
         });
         bmap.addEventListener("zoomend",function(){
         if (ISOUTHEAT == true ) {
         lazy(event);
         }
         });*/
        //bmap.removeEventListener("moveend", lazy());
        var hour = event.fromNumber;
        var dateStr = $("#outsider-date").val();
        dateStr = dateStr.split(/\s|-|:/).join('');
        if (hour <= 9) {
            dateStr = dateStr + "0" + hour;
        } else {
            dateStr = dateStr + "" + hour;
        }

        //获取可视区域
        var bs = bmap.getBounds();
        //可视区域左下角
        var bssw = bs.getSouthWest();
        //可视区域右上角
        var bsne = bs.getNorthEast();
        //左下纬度
        var leftlatitude = bssw.lat;
        //左下经度
        var leftlongitude = bssw.lng;
        //右上纬度
        var rightlatitude = bsne.lat;
        //右上经度
        var rightlongitude = bsne.lng;
        $.ajax({
            type: "POST",
            url: OUTSIDER_URL,
            data: JSON.stringify({
                params: {
                    dateStr: dateStr,
                    leftlatitude: leftlatitude,
                    leftlongitude: leftlongitude,
                    rightlatitude: rightlatitude,
                    rightlongitude: rightlongitude
                }
            }),
            dataType: "json",
            contentType: 'application/json',
            async: false,
            success: function(res) {
                if (outsiderFirst != 1) {
                    //加载之前先清除上一次的图层
                    mapvOutsiderLayer.destroy();
                }

                outsiderData = res.detail.outsiders;
                // 测试数据
                // outsiderData = [{
                //         "date": "2017061505",
                //         "id": 1,
                //         "latitude": 39.931965,
                //         "longitude": 116.396435,
                //         "uniqueUsers": 2
                //     }, {
                //         "date": "2017061505",
                //         "id": 2,
                //         "latitude": 39.931965,
                //         "longitude": 116.396435,
                //         "uniqueUsers": 3
                //     }, {
                //         "date": "2017061505",
                //         "id": 3,
                //         "latitude": 39.931965,
                //         "longitude": 116.396435,
                //         "uniqueUsers": 4
                //     }, {
                //         "date": "2017061505",
                //         "id": 4,
                //         "latitude": 39.931965,
                //         "longitude": 116.396435,
                //         "uniqueUsers": 5
                //     }, {
                //         "date": "2017061505",
                //         "id": 6,
                //         "latitude": 39.931965,
                //         "longitude": 116.396435,
                //         "uniqueUsers": 6
                //     }];
                // 绘制图层
                // mapvOutsiderLayer = new mapv.baiduMapLayer(bmap, cvtOutsiderData2MapvData(outsiderData), getOutsiderMapvOption());
                // mapvOutsiderLayer.show();
                // outsiderFirst = outsiderFirst + 1;
                myChart.setOption({
                    series: {
                        id: 'outsiderHeatmap',
                        data: cvtOutsiderData2HeatmapData(outsiderData)
                    },

                    visualMap: {
                        id: 'outsiderVisualMap',
                        show: false
                    }
                });
            }
        });
    },
    onChange: function(event) {
        //console.log('onChange');
        //console.log(event.fromNumber);
    }
});

function lazy(event) {
    var hour = event.fromNumber;
    var dateStr = $("#outsider-date").val();
    dateStr = dateStr.split(/\s|-|:/).join('');
    if (hour <= 9) {
        dateStr = dateStr + "0" + hour;
    } else {
        dateStr = dateStr + "" + hour;
    }
    //获取可视区域
    var bs = bmap.getBounds();
    //可视区域左下角
    var bssw = bs.getSouthWest();
    //可视区域右上角
    var bsne = bs.getNorthEast();
    //左下纬度
    var leftlatitude = bssw.lat;
    //左下经度
    var leftlongitude = bssw.lng;
    //右上纬度
    var rightlatitude = bsne.lat;
    //右上经度
    var rightlongitude = bsne.lng;
    $.ajax({
        type: "POST",
        url: OUTSIDER_URL,
        data: JSON.stringify({
            params: {
                dateStr: dateStr,
                leftlatitude: leftlatitude,
                leftlongitude: leftlongitude,
                rightlatitude: rightlatitude,
                rightlongitude: rightlongitude
            }
        }),
        dataType: "json",
        contentType: 'application/json',
        async: false,
        success: function(res) {
            if (outsiderFirst != 1) {
                //加载之前先清除上一次的图层
                mapvOutsiderLayer.destroy();
            }

            outsiderData = res.detail.outsiders;
            myChart.setOption({
                series: {
                    id: 'outsiderHeatmap',
                    data: cvtOutsiderData2HeatmapData(outsiderData)
                },

                visualMap: {
                    id: 'outsiderVisualMap',
                    show: false
                }
            });
        }
    });
}


// 加载和清除犯罪预测信息按钮事件
$('#btn-crime-predict').click(function(event) {
    // .btn-load为数据加载状态
    if ($(this).hasClass('btn-load')) {
        // 显示时间面板
        $('#crime-predict-choose').css('display', 'block');
    } else {
        // 修改按钮图形
        $(this)[0].src = IMG_URL + 'CrimePredict_clear.png';
        // 修改按钮状态
        $(this).addClass('btn-load').removeClass('btn-clear');
        // 隐藏时间面板
        $('#crime-predict-choose').css('display', 'none');
        // 清除数据
        crimePredictData = [];
        // 清除图层
        mapvCrimePredictLayer.destroy();
    }
});

// 犯罪预测数据的时间选择
$('#crime-predict-choose input')
    .datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        startView: 'month',
        minView: 'month',
        todayBtn: true,
        todayHighlight: true,
        language: 'zh-CN',
        minuteStep: 1,
        pickerPosition: 'bottom-right',
        autoclose: true
    })
    .on('click', function() {
        // 预测犯罪图层的时间选择限制为未来时间
        $('#crime-predict-choose input').datetimepicker('setStartDate', new Date());
    });

// 点击时间图标触发时间选择
$('#crime-predict-choose i').on('click', function() {
    $('#crime-predict-choose input').focus().click();
});

// 犯罪预测确定按钮事件
$('#crime-predict-btngrp button:first').click(function() {
    if ($('#btn-crime-predict').hasClass('btn-load')) {
        // 时间选择
        var timeStr = $('#crime-predict-choose input').val();
        timeStr = timeStr.split('-').join('');
        // 类型选择
        var category = $('#crime-predict-choose select').val();
        // 合法输入时
        if (timeStr !== '' && category !== '0') {
            // 请求数据
            $.ajax({
                type: "POST",
                url: CRIME_PREDICT_URL,
                data: JSON.stringify({
                    params: {
                        timeStr: timeStr,
                        category: category
                    }
                }),
                dataType: "json",
                contentType: 'application/json',
                async: false,
                success: function(res) {
                    crimePredictData = res.detail.crimePredictions;
                    // 绘制图层
                    mapvCrimePredictLayer = new mapv.baiduMapLayer(bmap, cvtCrimePredictData2MapvData(crimePredictData), getCrimePredictMapvOption());
                    mapvCrimePredictLayer.show();
                }
            });

            // 修改按钮图形
            $('#btn-crime-predict')[0].src = IMG_URL + 'CrimePredict_load.png';
            // 修改按钮状态
            $('#btn-crime-predict').addClass('btn-clear').removeClass('btn-load');
            // 隐藏面板
            $('#crime-predict-choose').css('display', 'none');
        }
        // 非法输入弹窗警告
        else {
            alert('请正确选择时间和预测类型！');
        }
    }
});


// 犯罪预测取消按钮事件
$('#crime-predict-btngrp button:last').click(function() {
    // 隐藏面板
    $('#crime-predict-choose').css('display', 'none');
});

// 加载和清除摄像头信息按钮事件
$('#camera_btn').click(function() {
    if ($(this).hasClass('btn-load')) {
        addCamera();
        $(this).addClass('btn-clear').removeClass('btn-load');
    } else {
        clearCamera();
        $(this).addClass('btn-load').removeClass('btn-clear');
    }
});

var cameraCircle = [];
function addCamera() {
    console.log("显示摄像头");
    //清空cameraCircle数组
    cameraCircle.splice(0,cameraCircle.length);
    var myIcon = L.icon({
        iconUrl: './img/careicon15.png',
        iconSize: [15,15]
    });
    var myIconRed = L.icon({
        iconUrl: './img/careiconred.png',
        iconSize: [20,20]
    })
    //加载摄像头范围
    for (var i = 0; i < cameraLocationData.length; i++) {
        if (cameraLocationData[i].lng && cameraLocationData[i].lat) {
            var imageUrl = './img/care.png',
                imageBounds = [[cameraLocationData[i].minLat, cameraLocationData[i].minLng], [cameraLocationData[i].maxLat, cameraLocationData[i].maxLng]];
            var cameraRange = L.imageOverlay(imageUrl, imageBounds).addTo(lmap);
        }
        var cameraObj={
            overlayBottom: cameraRange,
            overlayTop: {},
            id: ""
        };
        cameraCircle.push(cameraObj);
    }

    //加载摄像头
    for (var i = 0; i < cameraLocationData.length; i++) {
        if (cameraLocationData[i].lng && cameraLocationData[i].lat) {
            var point = [cameraLocationData[i].lat, cameraLocationData[i].lng];

            var marker = L.marker(point, {icon: myIcon}).addTo(lmap);

            cameraCircle[i].id = marker._leaflet_id;
            cameraCircle[i].overlayTop = marker;

            marker.on("mouseover", function(e) {
                this.setIcon(myIconRed);
                clearCamera(e.target._leaflet_id);
            });
            marker.on("mouseout", function(e) {
                clearOneCamera(e.target._leaflet_id);
                addCamera();
            });
        }
    }
}
//覆盖物添加监听事件
/*function addLabel(content, marker) {
    marker.addEventListener('click', function() {
        var label = new BMap.Label("我是文字标注哦", { offset: new BMap.Size(20, -10) });
        marker.setLabel(label);
    });
}*/
//清除地图上的摄像头
function clearCamera(id) {
    console.log("清除摄像头");
    for (var obj in cameraCircle) {
        if (cameraCircle[obj].id != id) {
            cameraCircle[obj].overlayTop.remove();
            cameraCircle[obj].overlayBottom.remove();
        }
    }
}
function clearOneCamera(id) {
    for (var obj in cameraCircle) {
        if (cameraCircle[obj].id == id) {
            cameraCircle[obj].overlayTop.remove();
            cameraCircle[obj].overlayBottom.remove();
        }
    }
}

function heatmap(){
	myChart.showLoading();
	var allHeatMapData = [];
	for (var eachCate in eventData) {
		allHeatMapData = allHeatMapData.concat(convertFreqData(eventData[eachCate]));
	}
	myChart.setOption({
		series: {
			id: 'freqHeatmap',
			data: allHeatMapData
		},

		visualMap: {
			id: 'visualMapHeat',
			show: false
		}
	});
	myChart.hideLoading();
}
//用于测试热力图
//heatmap();

// select表单改变事件：改变热力图类型
$('#heatmap-select').change(function() {
    // 获取类别
    var category = $('#heatmap-select option:selected').text();
    // 根据类别加载热力图
    // 选择关闭: 清空热力图数据
    if (category === '关闭') {
        myChart.showLoading();
        myChart.setOption({
            series: {
                id: 'freqHeatmap',
                data: []
            },

            visualMap: {
                id: 'visualMapHeat',
                show: false
            }
        });
        myChart.hideLoading();
    }
    // 选择全部: 循环遍历全部类别数据，转换为热力图数据
    else if (category === '全部') {
        myChart.showLoading();
        var allHeatMapData = [];
        for (var eachCate in eventData) {
            allHeatMapData = allHeatMapData.concat(convertFreqData(eventData[eachCate]));
        }
        myChart.setOption({
            series: {
                id: 'freqHeatmap',
                data: allHeatMapData
            },

            visualMap: {
                id: 'visualMapHeat',
                show: false
            }
        });
        myChart.hideLoading();
    }
    // 选择其他类型: 加载对应类型的热力图数据
    else {
        myChart.showLoading();
        myChart.setOption({
            series: {
                id: 'freqHeatmap',
                data: convertFreqData(eventData[category])
            },

            visualMap: {
                id: 'visualMapHeat',
                show: false
            }
        });
        myChart.hideLoading();
    }
});

/*框选数据预处理及图表参数*/
/*var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++){
        var locationLongitude = [];
        locationLongitude.push(data[i].longitude);
        var location = locationLongitude.concat(data[i].latitude);
        res.push({
            name: [],
            value: location.concat(data[i].date).concat(data[i].category)
        })
    }
    return res;
}*/
//var convertedData = convertData(caseData);
//console.log("convertedData",convertedData);

/*var convertedData = [];
var newArray = [];
for (var key in eventData){
    newArray.push(eventData[key]);
}
console.log("newArray",newArray[0]);
convertedData = newArray[0].concat(newArray[1],newArray[2],newArray[3]);
console.log("convertedData",convertedData);
var stackChart = echarts.init(document.getElementById('duidietu'));

stackChart.setOption({
    backgroundColor: '#404a59',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDurationUpdate: 1000,
    animationEasingUpdate: 'cubicInOut',
    title: {
        text: '警情数量柱状图',
        textStyle: {
            color: '#ffffff'
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['刑事', '社情民意', '治安', '纠纷求助']
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '警情',
            type: 'scatter',
            coordinateSystem: 'leaflet',
            data: [],
            symbolSize: '5'
        },
        {
            name: '纠纷求助',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            data: []
        },
        {
            name: '社情民意',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            data: []
        },
        {
            name: '治安',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            data: []
        },
        {
            name: '刑事',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            data: []
        }
    ]

})*/
/*框选事件渲染函数*/
var stackbarChart;
var pieChart;
myChart.on('brush', function () {
    //禁用地图拖动
    lmap.dragging.disable();
    console.log("brush");
    if (stackbarChart != null && stackbarChart != "" && stackbarChart != undefined) {
        stackbarChart.dispose();
    }
    if (pieChart != null && pieChart != "" && pieChart != undefined) {
        pieChart.dispose();
    }

})

myChart.on('brushselected', renderBrushed);
function renderBrushed(params) {
    lmap.dragging.disable();
    //console.log("brushselected");
    //console.log("params",params);
    //纠纷
    var mainSeries_0 = params.batch[0].selected[6];
    console.log("mainSeries",mainSeries_0);
    //民意
    var mainSeries_1 = params.batch[0].selected[8];
    console.log("mainSeries",mainSeries_1);
    //刑事
    var mainSeries_2 = params.batch[0].selected[10];
    console.log("mainSeries",mainSeries_2);
    //治安
    var mainSeries_3 = params.batch[0].selected[12];
    console.log("mainSeries",mainSeries_3);
    //var categoryData = [];
    //var barData = [];
    //var maxBar = 30;
    //var sum = 0;

    var selectedItems = [];
    for (var i = 0; i < mainSeries_0.dataIndex.length; i++) {
        var rawIndex = mainSeries_0.dataIndex[i];
        var dataItem = eventData['纠纷'][rawIndex];
        //var selectedId = dataItem.value[2];
        selectedItems.push(dataItem);
    }
    for (var i = 0; i < mainSeries_1.dataIndex.length; i++) {
        var rawIndex = mainSeries_1.dataIndex[i];
        var dataItem = eventData['民意'][rawIndex];
        //var selectedId = dataItem.value[2];
        selectedItems.push(dataItem);
    }
    for (var i = 0; i < mainSeries_2.dataIndex.length; i++) {
        var rawIndex = mainSeries_2.dataIndex[i];
        var dataItem = eventData['刑事'][rawIndex];
        //var selectedId = dataItem.value[2];
        selectedItems.push(dataItem);
    }
    for (var i = 0; i < mainSeries_3.dataIndex.length; i++) {
        var rawIndex = mainSeries_3.dataIndex[i];
        var dataItem = eventData['治安'][rawIndex];
        //var selectedId = dataItem.value[2];
        selectedItems.push(dataItem);
    }
    //console.log("select", selectedItems);
    // 对获取到的所有案件按照时间从小到大顺序排序
    selectedItems.sort(function (a, b) {
        return caseTime[a.value[2]] - caseTime[b.value[2]];
    });
    //console.log("select", selectedItems);
    var pieSeriesData = [
        {value:mainSeries_2.dataIndex.length, name:'刑事'},
        {value:mainSeries_1.dataIndex.length, name:'社情民意'},
        {value:mainSeries_3.dataIndex.length, name:'治安'},
        {value:mainSeries_0.dataIndex.length, name:'纠纷求助'}
    ]

    // 柱状图横轴按时间统计(精确到天，时间已经按从小到大排序)
    var xAxisData = [];
    // 类别legend
    //var legendData = [];
    var legendData = ['纠纷','民意','刑事','治安'];
    // 遍历全部数据，生成柱状图横轴数据和类别标签数据
    for (var i = 0; i < selectedItems.length; i++) {
        var selectedCaseId = selectedItems[i].value[2];
        // 时间仅保留年月日部分，去掉时分秒 caseTime是时间戳格式
        var selectedTime = new Date(caseTime[selectedCaseId]);
        var tmpTime = selectedTime.toLocaleString().split(' ')[0];
        // 获取类别
        var tmpType = caseType[selectedCaseId];
        // 构造柱状图横轴时间数据
        if (xAxisData.indexOf(tmpTime) === -1) {
            xAxisData.push(tmpTime);
        }
        // 构造类别标签数据
        /*if (legendData.indexOf(tmpType) === -1) {
            legendData.push(tmpType);
        }*/
    }
    //console.log("xAxisData", xAxisData);
    //console.log("legendData", legendData);
    // 柱状图数据声明
    var statisticBarData = {};

    // 侧边栏图表的series声明
    var sideChartSeries = [];

    // 柱状图和饼图的series数据结构初始化
    // 柱状图数据为statisticBarData[类型] = [按照xAxisData数组中时间对应的案件计数数据]
    // 初始化计数为0
    // 类别
    for (var i = 0; i < legendData.length; i++) {
        var barDataTemp = [];
        // 日期对应的个数
        for (var j = 0; j < xAxisData.length; j++) {
            barDataTemp.push(0);
        }
        statisticBarData[legendData[i]] = barDataTemp;
    }

    // 统计数据
    for (var eachCase = 0; eachCase < selectedItems.length; eachCase++) {
        // 当前案件的id
        var curCaseId = selectedItems[eachCase].value[2];
        // 当前案件的类型
        var curCaseType = caseType[curCaseId];
        // 当前案件的时间
        var curTime = new Date(caseTime[curCaseId]);
        var curCaseTime = curTime.toLocaleString().split(' ')[0];
        // 当前案件时间对应xAxis上的索引位置
        var timeIndex = xAxisData.indexOf(curCaseTime);
        // 柱状图统计
        statisticBarData[curCaseType][timeIndex]++;
    }

    // 将柱状图按类别添加进sideChartSeries
    for (var eachBarData in statisticBarData) {
        seriesTemp = {
            name: eachBarData,
            type: 'bar',
            stack: 'total',
            data: statisticBarData[eachBarData],
            barMaxWidth:　30
        }
        sideChartSeries.push(seriesTemp);
    }

    pieChartOption = {
        title : {
            text: '警情比重饼状图',
            left: 0,
            top: 60,
            textStyle: {
                color: '#ffffff',
                fontSize:　8,
                fontWeight: 500
            }
        },
        color: ['#f93c32', '#4bd964', '#cea917', '#1db0fa'],
        legend: {
            orient: 'horizontal',
            left: '20%',
            top: 10,
            data:
                [
                    {
                        name: '刑事',
                        icon: 'circle',
                        textStyle: {
                            color: '#a8e3ff'
                        }
                    },
                    {
                        name: '社情民意',
                        icon: 'circle',
                        textStyle: {
                            color: '#a8e3ff'
                        }
                    },
                    '\n',
                    {
                        name: '治安',
                        icon: 'circle',
                        textStyle: {
                            color: '#a8e3ff'
                        }
                    },
                    {
                        name: '纠纷求助',
                        icon: 'circle',
                        textStyle: {
                            color: '#a8e3ff'
                        }
                    }]
        },
        series : [
            {
                type: 'pie',
                radius : '40%',
                center: ['50%', '65%'],
                data: pieSeriesData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    pieChart = echarts.init(document.getElementById('piechart_section'));
    pieChart.setOption(pieChartOption);

    //绘制柱状图
    stackbarChart = echarts.init(document.getElementById('stackbarchart_section'));
    stackbarChartOption = {
        title : {
            text: '警情数量柱状图',
            left: 0,
            top: 0,
            textStyle: {
                color: '#ffffff',
                fontSize:　8,
                fontWeight: 500
            }
        },
        tooltip: {
            trigger: 'axis',
            // 坐标轴指示器，坐标轴触发有效
            axisPointer: {
                // 默认为直线，可选为：'line' | 'shadow'
                type: 'shadow'
            }
        },
        color: ['#1db0fa','#4bd964','#f93c32','#cea917'],
        grid: {
            top: 30,
            left: 2,
            containLabel: true,
            height: 150,
            borderColor: '#e3e3e3'
        },
        xAxis: [{
            type: 'category',
            data: xAxisData,
            axisLine: {
                lineStyle: {
                    color: '#e3e3e3'
                }
            }
        }],
        yAxis: [{
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#e3e3e3'
                }
            }
        }],
        axisLabel: {
            textStyle: {
                color: '#ccc'
            }
        },
        series: sideChartSeries
    };

    stackbarChart.setOption(stackbarChartOption);

    if(mainSeries_0.dataIndex.length !== 0
        || mainSeries_1.dataIndex.length !== 0
        || mainSeries_2.dataIndex.length !== 0
        || mainSeries_3.dataIndex.length !== 0
    ){
        $('#inspect').hide();
        $('#details').hide();
        $('#charts').show();
    }



 /*   for (var i = 0; i < Math.min(selectedItems.length, maxBar); i++) {
        categoryData.push(selectedItems[i].name);
        barData.push(selectedItems[i].value[2]);
    }
    this.setOption({
        yAxis: {
            data: categoryData
        },
        xAxis: {
            axisLabel: {show: !!count}
        },
        title: {
            id: 'statistic',
            text: count ? '平均: ' + (sum / count).toFixed(4) : ''
        },
        series: {
            id: 'bar',
            data: barData
        }
    });*/
}



/*        //添加事件列表
        // 清空显示区域
        $info.empty();

        // 创建事件列表组: bootstrap - panel-group
        var $panelGrp = $('<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true"></div>');
        for (var i = 0; i < selectedItems.length; i++) {
            // 按时间顺序插入
            // 其中case-id为自定义标签，存储案情id，用于点击跳转到单个案件侧边栏
            $panelGrp.prepend(
                '<div class="panel panel-default">' +
                '<div class="panel-heading" role="tab" id="heading' + i + '" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '" case-id="' + selectedItems[i].value[2] + '">' +
                '<h4 class="panel-title">' +
                caseTime[selectedItems[i].value[2]] + '：&nbsp;' + selectedItems[i].name +
                '</h4>' +
                '</div>' +
                '<div id="collapse' + i + '" class="panel-body panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '">' +
                caseAbstract[selectedItems[i].value[2]] +
                '</div>' +
                '</div>'
            );
        }
        $panelGrp.appendTo($info);

        // 侧边栏选框的事件列表相关事件
        $('#side-list .panel-group .panel-heading')
        // 侧边栏事件列表点击单个案件时跳转到事件详情
            .click(function(event) {
                var caseId = $(this).attr('case-id');
                clickCase(caseId);
            })
            // 侧边栏事件列表鼠标进入时展开简介
            .mouseenter(function() {
                $(this).siblings('.collapse').collapse('show');
            })
            // 侧边栏事件列表鼠标离开时收回简介
            .parent('.panel')
            .mouseleave(function() {
                $(this).children('.collapse').collapse('hide');
            });
    }
});*/


// 热力图视觉映射组件事件：阻止地图拖拽(此组件暂时未显示)
myChart.on('datarangeselected', function() {
    // 禁用百度地图拖拽
    bmap.disableDragging();
});

/**
 * 点击单个案件后对侧边栏布局的函数
 * @param  {String} caseId     [事件id]
 */
// 点击单个案情事件触发侧边栏显示详情
// 点击事件获取caseid
myChart.on('click', function(event) {
    var caseId = event.data.value[2];
    console.log(caseId);
    clickCase(caseId);
});
//根据caseid获得案件详情的数据，渲染页面
function clickCase(caseId){
    //更改标题
    $('.right_title span').text('警情详情');
    //根据caseid获取详情数据
    getCaseDetail(caseId, token);
    //获取每一项的信息
    //标题
    var caseTitle = caseDetail.title;
    //类别 子类别
    var categoryNum = caseDetail.category;
    var caseCategory = "";
    if(categoryNum == 0){
        caseCategory = "刑事";
    }else if(categoryNum == 1){
        caseCategory = "治安";
    }else if(categoryNum == 2){
        caseCategory = "纠纷";
    }else if(categoryNum == 3){
        caseCategory = "民意";
    }else{
        caseCategory = "其他";
    }
    var caseSubCategory = caseDetail.subcategory;
    //时间
    //重写toLocaleString方法以获得想要的时间格式
    /*Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    };*/
    var getTime = new Date(caseDetail.date);
    //console.log("getTime", getTime);
    var caseTime = getTime.toLocaleString();
    //console.log("casetime",caseTime);
    //详情
    var caseBrief = caseDetail.brief;
    //出警派出所
    var casePolice = caseDetail.police;
    //事主
    var caseIdentity = caseDetail.identity;
    //渲染案件信息
    $('#details .casetitle').text(caseTitle);
    $('#details .first_section p:eq(0)').html("").append(caseCategory).append(" " + caseSubCategory);
    $('#details .first_section p:eq(2)').html("").append(caseTime);
    $('#details .first_section p:eq(3)').html("").append(caseBrief);
    $('#details .first_section p:eq(5) span').html("").append(casePolice);

    $('#details .second_section p:eq(0) span').html("").append(caseIdentity);

    showCaseAssociation(caseId, token);
    showDetails();
}
var relationData = {};
function showCaseAssociation(caseId, token) {
    // ajax请求关系图数据
    $.ajax({
        type: "POST",
        url: BASE_URL + '/map/loadCaseAssociation',
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
            relationData = res.detail.case_associations;
            //console.log("relationdata",relationData);
        }
    });

    // 销毁之前创建的实例
    if (sideChart != null && sideChart != "" && sideChart != undefined) {
        sideChart.dispose();
    }
    // 绘制关系图
    sideChart = echarts.init($('#chart_container')[0]);
    sideChart.hideLoading();
    // 如果有关系图数据则显示
    if (relationData == null){
        sideChart.showLoading({
            text: '暂无信息',
            color: '#c23531',
            textColor: '#fff',
            maskColor: 'rgba(37, 40, 48, 0)',
            zlevel: 0
        });
    }else if (relationData.hasOwnProperty("caseId")) {
        sideOption = createRelationGraphOption(relationData);
        sideChart.setOption(sideOption);
    }


    /*if (relationData.hasOwnProperty("caseId")) {
        sideOption = createRelationGraphOption(relationData);
        sideChart.setOption(sideOption);
    }
    // 没有关系图数据时显示暂无信息
    else {
        sideChart.showLoading({
            text: '暂无信息',
            color: '#c23531',
            textColor: '#fff',
            maskColor: 'rgba(37, 40, 48, 0)',
            zlevel: 0
        });
    }*/
}
/*function clickCase(caseId) {
    //$('#side-chart .panel-title').text('关系图');
    //$('#side-list .panel-title').text('警情信息');
    //$('#side-abstract .panel-title').text('警情概要');
    // 更改标题
    $('.right_title').text('警情详情');

    // 点击单个案件侧边栏各个模块显示与隐藏设置
    $('#side-chart-container').css('display', 'block');
    $('#side-station-info').css('display', 'none');
    $('#side-list').css('display', 'block');
    $('#side-detail').css('display', 'block');
    $('#side-abstract').css('display', 'block');

    // 侧边栏展开
    if ($('#side-panel').width() === 0) {
        $('#side-panel').animate({
            width: '40%'
        }, 500, function() {
            // Animation complete.
        });
    }

    // 添加案情信息
    $info.empty();
    var $ulInfo = $('<ul>');
    $('<li>').addClass('time').text('作案时间：' + caseTime[caseId]).appendTo($ulInfo);
    //$('<li>').addClass('person').text('事主身份：' + identity[caseId]).appendTo($ulInfo);
    $('<li>').addClass('brief').text('案件摘要：' + caseAbstract[caseId]).appendTo($ulInfo);
    $('<li>').addClass('way').text('作案手段：' + subcaseType[caseId]).appendTo($ulInfo);
    $('<li>').addClass('station').text('处警单位派出所：' + localSubstation[caseId]).appendTo($ulInfo);
    $ulInfo.appendTo($info);

    loadCaseBrief(caseId);
    loadCaseChart(caseId);


    // 显示案件详情
    $('#side-detail .panel-body').empty().append(feedback[caseId]);

    // ajax请求关系图数据
    $.ajax({
        type: "POST",
        url: RELATION_DATA_URL,
        data: JSON.stringify({
            params: {
                id: caseId
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            relationData = data.detail.crimeRelationships;
        }
    });


    // 绘制关系图
    sideChart = echarts.init($('#side-chart-container')[0]);
    // 如果有关系图数据则显示
    if (relationData.id) {
        sideOption = createRelationGraphOption(relationData);
        sideChart.setOption(sideOption);
    }
    // 没有关系图数据时显示暂无信息
    else {
        sideChart.showLoading({
            text: '暂无信息',
            color: '#c23531',
            textColor: '#fff',
            maskColor: 'rgba(37, 40, 48, 0)',
            zlevel: 0
        });
    }
}*/


/**
 * 加载案情简要信息
 *
 * @param caseId
 * @returns
 */

/*function loadCaseBrief(caseId) {
    // ajax请求数据
    $.ajax({
        type: "POST",
        url: "/iinspection/case/loadCaseBrief",
        data: JSON.stringify({
            params: {
                caseId: caseId
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            var cas = data.detail.cas;
            if (cas != null && cas.length != 0) {
                $('#side-abstract .panel-body').empty().append(cas.crimeBrief);
            }
        }
    });
}*/

/**
 * 加载案情时间图表信息
 *
 * @param caseId
 */
function loadCaseChart(caseId) {
    // ajax请求关系图数据
    $.ajax({
        type: "POST",
        url: "/iinspection/case/loadCaseChart",
        data: JSON.stringify({
            params: {
                caseId: caseId
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            var caseChart = data.detail.caseChart;
            if (caseChart != null && caseChart.length) {
                $("#case-chart-container").show();
                // $("#case-chart-container").html(caseChart.length);

                var hours = new Array();
                var nums = new Array();
                for (var i = 0; i < caseChart.length; i++) {
                    hours[i] = caseChart[i].byHour;
                    nums[i] = caseChart[i].sumByHourCount;
                }
                if (hours != null && nums != null) {
                    setTimeout(function() {
                        loadChartInfo(hours, nums);
                    }, 380);
                }
            } else {
                $("#case-chart-container").hide();
            }
        }
    });
}

function loadChartInfo(hours, nums) {
    //$("#case-chart-container canvas").css("background","white");document.getElementById('case_chart')
    var caseChart = echarts.init($("#case-chart-container")[0]);
    caseChart.title = '警情时间信息';
    var caseOption = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: hours,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                show: true,
                margin: 10,
                textStyle: {
                    color: 'white',
                },

            },
            axisLine: {
                lineStyle: {
                    color: 'white',
                }
            }
        }],
        yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    margin: 10,
                    textStyle: {
                        color: 'white',
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'white',
                    }
                }
            }

        ],
        series: [{
            //name: '直接访问',
            type: 'bar',
            //barWidth: '60%',
            barWidth: 30, //固定柱子宽度
            data: nums
        }]
    };
    caseChart.setOption(caseOption);
}

/**
 * 地图容器上的点击事件
 * 恢复百度地图拖拽
 */
$('#container').click(function(event) {
    // 恢复百度地图拖拽
    //bmap.enableDragging();
});


/**
 * 侧边栏关闭按钮事件
 */
$('.iconfont').click(function() {
    $('#side-panel').animate({
        width: '0%'
    }, 500, function() {
        // Animation complete.
    });
});


/***********************************************************
 * 数据与时间和搜索关键词的联动
 ***********************************************************/

/**
 * 去掉字符串首尾的空格
 * @param  {String} str [输入的字符串，主要用于对搜索框的查询词处理]
 * @return {String}     [返回去掉首尾空格的查询词]
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*

/!**
 * 刷新地图，数据由开始时间、结束时间、关键词唯一确定
 * @param  {String} startTime [开始时间]
 * @param  {String} endTime   [结束时间]
 * @param  {String} keyword   [关键词]
 *!/
function refreshMap(startTime, endTime, keyword) {
    // 获取刷新前的中心位置和缩放级别
    var center = bmap.getCenter();
    var zoom = bmap.getZoom();
    // 去除关键词前后空格
    keyword = trim(keyword);
    // 请求ESData
    getESData(startTime, endTime, keyword);
    // ESData转换
    eventData = cvtESData2eventData(ESData);
    // 加载echarts配置
    setMyChartOption();
    // 加载百度地图配置
    setBmapOption();
    // 初始化控制面板
    ctlboardInit();
    // 恢复刷新前的中心位置和缩放级别
    bmap.centerAndZoom(new BMap.Point(center.lng, center.lat), zoom);
}


// 起始时间配置以及与结束时间的联动
$('#startTime')
    .datetimepicker({
        format: 'yyyy-mm-dd hh:00',
        weekStart: 1,
        startView: 'month',
        minView: 'day',
        todayBtn: true,
        todayHighlight: true,
        language: 'zh-CN',
        minuteStep: 1,
        pickerPosition: 'bottom-right',
        autoclose: true
    })
    .on('click', function() {
        // 开始时间不能选择结束时间之后的时间
        $('#startTime').datetimepicker('setEndDate', $('#endTime').val());
    })
    // 开始时间改变，刷新地图
    .on('changeDate', function() {
        // 获取开始时间
        startTime = $(this).val();
        // 获取结束时间
        endTime = $('#endTime').val();
        // 获取关键词
        var keyword = $('#search-input').val();
        // 刷新地图
        refreshMap(startTime, endTime, keyword);
    });

// 点击时间图标触发起始时间选择
$('#startTime + span i').on('click', function() {
    $('#startTime').focus().click();
});

// 终止时间配置以及和开始时间的联动
$('#endTime')
    .datetimepicker({
        format: 'yyyy-mm-dd hh:00',
        weekStart: 1,
        startView: 'month',
        minView: 'day',
        todayBtn: true,
        todayHighlight: true,
        language: 'zh-CN',
        minuteStep: 1,
        pickerPosition: 'bottom-right',
        autoclose: true
    })
    .on('click', function() {
        // 终止时间不能选择开始时间之前的时间
        $('#endTime').datetimepicker('setStartDate', $('#startTime').val());
    })
    // 终止时间改变，刷新地图
    .on('changeDate', function() {
        // 获取开始时间
        startTime = $('#startTime').val();
        // 获取结束时间
        endTime = $(this).val();
        // 获取关键词
        var keyword = $('#search-input').val();
        // 刷新地图
        refreshMap(startTime, endTime, keyword);
    });
*/

/*
// 点击时间图标触发终止时间
$('#endTime + span i').on('click', function() {
    $('#endTime').focus().click();
});
*/


/*
// 搜索按钮提交时刷新地图
$('#search-btn').click(function(event) {
    // 获取关键词
    var keyword = $('#search-input').val();
    // 刷新地图
    refreshMap(startTime, endTime, keyword);
});
*/
/*
 // 回车提交搜索请求
 $('#search-input').keydown(function(event) {
 if (event.keyCode === 13) {
 $('#search-btn').click();
 }
 });*/


// 对ECharts原生的散点鼠标hover的tip重构
myChart.on('mouseover', function(event) {
    var curId = event.data.value[2];
    $('#map-scatter-tip').text(caseAbstract[curId]).css('display', 'block');

});

myChart.on('mouseout', function(event) {
    $('#map-scatter-tip').css('display', 'none');
});

var $scatterTip = $('#map-scatter-tip');
$('#container').mousemove(function(event) {
    if ($scatterTip.css('display') !== 'none') {
        $scatterTip.css('left', event.pageX + 'px');
        $scatterTip.css('top', event.pageY + 'px');
    }
});

//导航栏账号和消息提示
$('.mouseover2').mousemove(function() {

    $('#userMsg').show();

}).mouseout(function() {
    
    $('#userMsg').hide();
});
$('.mouseover3').mousemove(function() {
    $('#Msg-content').show();
    $('.top-angle').show();



}).mouseout(function() {
    $('#Msg-content').hide();
    $('.top-angle').hide();
});
//搜索框搜索
var caseorpeople=0;
$('#people-choose-btn').click(function() {
    /* $('#case-choose-btn').removeClass('underLine');
     $(this).addClass('underLine');*/
    $('#case-choosed').hide();
    $('#people-choosed').show();
    caseorpeople=1;
    $('#case-choosed span').removeClass('purple');
    console.log(caseorpeople);
});
$('#case-choose-btn').click(function() {
    /*   $('#people-choose-btn').removeClass('underLine');
       $(this).addClass('underLine');*/
    $('#people-choosed').hide();
    $('#case-choosed').show();
    caseorpeople=0;
    $('#people-choosed span').removeClass('purple');
    console.log(caseorpeople);
});
//案件筛选按钮
var str='';
var num=0;
$('#people-choosed span').click(function() {
    $(this).toggleClass('purple');

});
var c0=0;
$('#case-choosed span:eq(0) ').click(function() {
    if(c0==0){
        $(this).addClass('purple');
        str+=$(this).text()+' ';
        num++;
        c0=1;
    }
    else{
        $(this).removeClass('purple');
        str=str.replace(($(this).text()+" "),'');
        num--;
        c0=0;
    }
    console.log(str);
});
var c1=0;
$('#case-choosed span:eq(1) ').click(function() {
    if(c1==0){
        $(this).addClass('purple');
        str+=$(this).text()+' ';
        num++;
        c1=1;
    }
    else{
        $(this).removeClass('purple');
        str=str.replace(($(this).text()+" "),'');
        num--;
        c1=0;
    }
    console.log(str);
});
var c2=0;
$('#case-choosed span:eq(2) ').click(function() {
    if(c2==0){
        $(this).addClass('purple');
        str+=$(this).text()+' ';
        num++;
        c2=1;
    }
    else{
        $(this).removeClass('purple');
        str=str.replace(($(this).text()+" "),'');
        num--;
        c2=0;
    }
    console.log(str);
});
var c3=0;
$('#case-choosed span:eq(3) ').click(function() {
    if(c3==0){
        $(this).addClass('purple');
        str+=$(this).text()+' ';
        num++;
        c3=1;
    }
    else{
        $(this).removeClass('purple');
        str=str.replace(($(this).text()+" "),'');
        num--;
        c3=0;
    }
    console.log(str);
});
function showCstrCase() {
    console.log(num);
    if(num==4||num==0){
        $("#choose-style").show();
        $("#xingshi").hide();
        $("#zhian").hide();
        $("#sheqing").hide();
        $("#jiufen").hide();
        $('#choose-style label').show();
    }
    if(num==1){
        $('#choose-style').hide();
        $("#xingshi").hide();
        $("#zhian").hide();
        $("#sheqing").hide();
        $("#jiufen").hide();
        if(c0==1){
            $('#xingshi').show();
        }
        if(c1==1){
            $('#zhian').show();
        }
        if(c2==1){
            $('#sheqing').show();
        }
        if(c3==1){
            $('#jiufen').show();
        }
    }
    if(num==2||num==3){
        $("#xingshi").hide();
        $("#zhian").hide();
        $("#sheqing").hide();
        $("#jiufen").hide();
        $("#choose-style ").show();
        $('#choose-style label').hide();
        if(c0==1){
            $('#inlineCheckbox1').show();
        }
        if(c1==1){
            $('#inlineCheckbox2').show();
        }
        if(c2==1){
            $('#inlineCheckbox3').show();
        }
        if(c3==1){
            $('#inlineCheckbox4').show();
        }
        $('#inlineCheckbox0').show();
    }
}
//搜索按钮事件
$('#search-button').click(function () {
    console.log(caseorpeople);
    if(caseorpeople==0){
        $('#people-alt').hide();
        $('#alt-btn').show();
        $('#case-container').show();
        showCstrCase();
        $('#caseStyleChoose').css('background', 'url("./img/alt-title2.png") no-repeat');
        j=1;k=1;

    }
    else{
        $('#people-alt').show();
        $('#alt-btn').hide();
        showCstrPeople();
        $('.contactusdiyou').animate({ right: '0' }, 300);
        i=1;
    }


})
//常控人员添加比较
var peopleMsg=new Array();
$('#people-choose-table  button').click(function () {
    var dotNum=1;
    var html='';
    if($(this).text()=='添加比较'){
        $(this).html('已添加').css('background','inherit');
        var text=$(this).parent().parent().find('span').text();
        var t=text.search('（');
        text=text.slice(0,t);
        peopleMsg.push(text);
        console.log(peopleMsg);
        $('#peopleChoose').css('background', 'url("./img/alt-title2.png") no-repeat');
        p=1;
    }
    else{
        $(this).html('添加比较').css('background','#55AEDD');
        var text=$(this).parent().parent().find('span').text();
        var t=text.search('（');
        text=text.slice(0,t);
        var index=peopleMsg.indexOf(text);
        peopleMsg.splice(index,1);
        console.log(peopleMsg);
    }
    $('#people-choose-box').show();
    html+=' <label class="checkbox-inline ">\
            <input type="checkbox" id="selectAll_people" value="option1" onclick="selectAll(this)">全选\
            </label>';
    peopleMsg.map(function (item) {
        html+='<label class="checkbox-inline check">\
            <input type="checkbox" name="people" onclick="deSelectAll()" value="option'+dotNum+'">'+item+
            '<span class="dot'+dotNum+' dot"></span>\
            </label>';
        dotNum++;
    });
    console.log(html);
    $('#people-choose-box').html(html);
});
function showCstrPeople() {

}


//侧边栏的事件
var i = 0;
$(".contactusdiyou .hoverbtn ").click(function() {
    if (i == 0) {
        // $(" .contactusdiyou .hoverimg").attr("src", "./img/hoverbtnbg2.png");
        $('.contactusdiyou').animate({ right: '0' }, 300);
        i = 1;
    } else {
        // $(".contactusdiyou .hoverimg").attr("src", "./img/hoverbtnbg.png");
        $('.contactusdiyou').animate({ right: '-330px' }, 300, function() {});
        i = 0;
    }
});
//全选按钮
$(function() {
    $("#selectAll").click(function() {
        $('input[name="checkbox"]').prop("checked", this.checked);
    });
    var $subBox = $("input[name='checkbox']");
    $subBox.click(function() {
        $("#selectAll").prop("checked", $subBox.length == $("input[name='checkbox']:checked").length ? true : false);
    });
});
//全选-刑事
$(function() {
    $("#selectAll_xingshi").click(function() {
        $('input[name="xingshi"]').prop("checked", this.checked);
    });
    var $subBox = $("input[name='xingshi']");
    $subBox.click(function() {
        $("#selectAll_xingshi").prop("checked", $subBox.length == $("input[name='xingshi']:checked").length ? true : false);
    });
});
//全选-治安
$(function() {
    $("#selectAll_zhian").click(function() {
        $('input[name="zhian"]').prop("checked", this.checked);
    });
    var $subBox = $("input[name='zhian']");
    $subBox.click(function() {
        $("#selectAll_zhian").prop("checked", $subBox.length == $("input[name='zhian']:checked").length ? true : false);
    });
});
//全选-社情
$(function() {
    $("#selectAll_sheqing").click(function() {
        $('input[name="sheqing"]').prop("checked", this.checked);
    });
    var $subBox = $("input[name='sheqing']");
    $subBox.click(function() {
        $("#selectAll_sheqing").prop("checked", $subBox.length == $("input[name='sheqing']:checked").length ? true : false);
    });
});
//全选-治安
$(function() {
    $("#selectAll_jiufen").click(function() {
        $('input[name="jiufen"]').prop("checked", this.checked);
    });
    var $subBox = $("input[name='jiufen']");
    $subBox.click(function() {
        $("#selectAll_jiufen").prop("checked", $subBox.length == $("input[name='jiufen']:checked").length ? true : false);
    });
});
//全选-人员
function selectAll(e) {
    $('input[name="people"]').prop("checked", e.checked);
}
function deSelectAll() {
    var $subBox = $("input[name='people']");
    $("#selectAll_people").prop("checked", $subBox.length == $("input[name='people']:checked").length ? true : false);
}

//案件种类案件筛选按钮
var j = 0;
function toggleStyle() {
    $('#caseStyleChoose').click(function() {
        console.log(str);
        showCstrCase();
        if (j == 0) {
            $('#case-container').show();
            j = 1;
        } else {
            $('#case-container').hide();
            j = 0;
        }

    });
}
toggleStyle();
var p=0;
function peopleStylechoose() {
    $('#peopleChoose').click(function () {
        if(p==0){
            $('#people-choose-box').show();
            p=1;k=0;
        }
        else{
            $('#people-choose-box').hide();
            p=0;k=1;
        }
    });
}
peopleStylechoose();
//切换变换图片
var k = 0;
function toggleBgImg() {
    $('.toggleBg').click(function() {
        if (k == 0) {
            $(this).css('background', 'url("./img/alt-title2.png") no-repeat');
            k = 1;
        } else {
            $(this).css('background', 'url("./img/alt-title.png") no-repeat');
            k = 0;
        }
    });
}
toggleBgImg();
//柱状图切换动画
function turnRightEcharts() {
    var z = 0;
    $('#turn-right-btn').click(function() {
        if (z == 0) {
            $('#calendar-big').hide();
            $('#calendar-small').show();
            $('#show-by-month').animate({ width: '800px' }, 300);
            $('#show-by-month').show();
            showByMonths();
            timedMsg();
            $('#turn-right-btn img').attr('src', './img/arrow-left.png');
            z = 1;
        } else {
            $('#calendar-big').show();
            $('#calendar-small').hide();
            /* $('#show-by-month').animate({width:'0px'},300);*/
            $('#turn-right-btn img').attr('src', './img/arrow-right.png');
            $('#show-by-month').hide();
            z = 0;
        }
    });
}
turnRightEcharts();
function timedMsg() {
    console.log('zai');
    setTimeout(showByMonths(), 1000);
}
/*时间选择器
起始时间配置以及与结束时间的联动*/
$('#start-Time')
    .datetimepicker({
        format: 'yyyy-mm-dd hh:00:00',
        weekStart: 1,
        startView: 'month',
        minView: 'day',
        todayBtn: true,
        todayHighlight: true,
        language: 'zh-CN',
        minuteStep: 1,
        pickerPosition: 'bottom-right',
        autoclose: true
    })
    .on('click', function() {
        // 开始时间不能选择结束时间之后的时间
        $('#start-Time').datetimepicker('setEndDate', $('#end-Time').val());
    })
    // 开始时间改变，刷新地图
    .on('changeDate', function() {
        // 获取开始时间
        startTime = $(this).val();
        // 获取结束时间
        endTime = $('#end-Time').val();

    });

// 点击时间图标触发起始时间选择
$('#start-Time + span i').on('click', function() {
    $('#start-Time').focus().click();
});

// 终止时间配置以及和开始时间的联动
$('#end-Time')
    .datetimepicker({
        format: 'yyyy-mm-dd hh:00:00',
        weekStart: 1,
        startView: 'month',
        minView: 'day',
        todayBtn: true,
        todayHighlight: true,
        language: 'zh-CN',
        minuteStep: 1,
        pickerPosition: 'bottom-right',
        autoclose: true
    })
    .on('click', function() {
        // 终止时间不能选择开始时间之前的时间
        $('#end-Time').datetimepicker('setStartDate', $('#start-Time').val());
    })
    // 终止时间改变，刷新地图
    .on('changeDate', function() {
        // 获取开始时间
        startTime = $('#start-Time').val();
        // 获取结束时间
        endTime = $(this).val();

    });

// 点击时间图标触发终止时间
$('#end-Time + span i').on('click', function() {
    $('#end-Time').focus().click();
});
// 时间选择面板显示隐藏
$('#time_choose').click(function () {
    $('#time-ctl').show();
})
$('#time-choose-complete').click(function () {
    $('#time-ctl').hide();
});
$('.close_time').click(function () {
    $('#time-ctl').hide();
});
// //点击地图、情报推理时触发事件
// $('#nav-ul-left>li>a').click(function (e) {
//     var event=e||window.event;
//     var ele=event.srcElement||e.target;
//     var length=ele.offset().left;
//     console.log(length);
//     $('#triangle').animate({left:length},300);
// });


/*chai event*/

// 所有文本框获得焦点后，placeholder消失
$("body").on("focus","input[placeholder]",function(){
    let valueBak=$(this).attr("xplaceholder");
    if(!valueBak){
        $(this).attr("xplaceholder", $(this).attr("placeholder"));
    }
    $(this).attr("placeholder", "");
}).on("blur", "input[placeholder]", function(){
    $(this).attr("placeholder", $(this).attr("xplaceholder"));
});
// 展开收起edit按钮
function showEditItem(event){
    $("#edit_item").toggleClass('move_right');
    if($('#edit_img').hasClass('edit_active')){
        $('#edit_img').attr("src", "./img/编辑.png");
        $('#edit_img').removeClass('edit_active');
    }else{
        $('#edit_img').addClass('edit_active');
        $('#edit_img').attr("src", "./img/编辑中.png");
    }
}
// 展开收起底部chart
function showChart(){
    $('.bottom_chart').animate({width:"toggle",opacity:"toggle"},"500");
}
// 左侧筛选面板展开收起
function toggleFilter(event){
    $(".filter").slideToggle();
   if($(event.target).hasClass('glyphicon-triangle-bottom')){
        $(event.target).removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-top');
   }else{
         $(event.target).addClass('glyphicon-triangle-bottom').removeClass('glyphicon-triangle-top')
   }
}
// 右侧面板展开收起
function toggleRightPanel(event){
    if($(event.target).hasClass('glyphicon-menu-left')){
        $(event.target).removeClass('glyphicon-menu-left').addClass('glyphicon-menu-right');
         $(".right_panel").animate({right:"30px"}, 500);
   }else{
         $(event.target).addClass('glyphicon-menu-left').removeClass('glyphicon-menu-right');
          $(".right_panel").animate({right:"-300px"}, 500);
   }
}
//右侧显示详情
function showDetails(){
    $('#inspect').hide();
    $('#charts').hide();
    $('#details').show();
}
function back(){
    $('#details').hide();
    $('#charts').hide();
    $('#inspect').show();
}
var timeChart=echarts.init(document.getElementById("timeChart"));
//timeChart.setOption(timeOption);
var xData=[];//x轴显示的时间
var xDataFull = [];//x轴的完整时间用于向后台请求数据
var caseNumData=[];//y轴
var timeOption = {
    grid: {
        bottom: 80
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            animation: false,
            label: {
                backgroundColor: '#0750A0'
            }
        }
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100,
            handleColor:"#63ADFF"
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
    ],
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: false},
            //  改变x轴颜色
            axisLine:{
                lineStyle:{
                    color:'#fff'
                }
            },
            //  改变x轴字体颜色和大小
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize:'10'
                },
            },
            data : xData
        }
    ],
    yAxis: [
        {
            name: '流量',
            type: 'value',
            /*max: 400,*/
            /*boundaryGap: [0, '100%'],*/
            splitLine:{
                show:false
            },
            //不显示y轴
            /*        axisLine:{
                        show:false
                    }, */
            // 去除y轴上的刻度线
            /*    axisTick: {
                        show: false
                },*/
            // 去除Y轴字体
            /* axisLabel: {
                       show:false
                    },*/
        },
    ],
    series: [
        {
            name:'案件数量',
            type:'line',
            smooth: true,
            animation: false,
            areaStyle: {
                normal: {
                    color: "#ffffff"
                }
            },
            lineStyle: {
                normal: {
                    width: 1,
                    color: "#0750A0"
                }
            },
            data:caseNumData
        }
    ]
};
// 根据datazoom起始终止位置动态显示时间范围内的散点图
var xlength;
timeChart.on('datazoom', function(params){
    //console.log(params);
    //console.log(params.start);
    //console.log(params.end);
    //根据位置百分比计算得到开始时间和结束时间
    var newStart = xDataFull[Math.round(params.start*(xlength-1)/100)];
    var newEnd = xDataFull[Math.round(params.end*(xlength-1)/100)];
    //console.log("newstart=",newStart);
    //console.log("newend=",newEnd);
    //向后台获取数据
    getCaseData(newStart, newEnd, searchWord,caseCategory, policeStation,token);
    // 先清除地图上已经加载的散点图和热力图
    hideScatter();
    hideHeatMap();
    eventData = cvtCaseData2eventData(caseData);
    //console.log("casedata",caseData);
    //console.log("nums=",caseData.length);
    loadNewMapLayer();
});
// 获取最近d天数据
function getRecentData(d){
    var now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        second = now.getSeconds();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if(hour < 10) {
        hour = '0' + hour;
    }
    if(minute < 10) {
        minute = '0' + minute;
    }
    if(second < 10) {
        second = '0' + second;
    }
    var currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' +  minute + ':' + second;
    var startDate = new Date(now - 86400000 * d),
        startYear = startDate.getFullYear(),
        startMonth = startDate.getMonth() + 1,
        startDay = startDate.getDate(),
        startHour = startDate.getHours(),
        startMinute = startDate.getMinutes(),
        startSecond = startDate.getSeconds();
    if (startMonth < 10) {
        startMonth = '0' + startMonth;
    }
    if (startDay < 10) {
        startDay = '0' + startDay;
    }
    if (startHour < 10) {
        startHour = '0' + startHour;
    }
    if (startMinute < 10) {
        startMinute = '0' + startMinute;
    }
    if (startSecond < 10) {
        startSecond= '0' + startSecond;
    }
    var startTime = startYear + '-' + startMonth + '-' + startDay + ' ' + startHour + ':' + startMinute + ':' + startSecond;
    var endTime = currentTime;
    // 获取后台数据
    getCaseData(startTime, endTime, searchWord,caseCategory, policeStation,token);
    //console.log("casedata",caseData);
    hideScatter();
    hideHeatMap();
    eventData = cvtCaseData2eventData(caseData);
    // console.log("eventData",eventData);
    // setMyChartOption();
    loadNewMapLayer();
    // 渲染底部echarts
    // 获取x轴时间数组
    var start=Date.parse(startTime),
        end=Date.parse(currentTime);
    //console.log("start",start);
    //console.log("end",end);
    //每次按下按钮都要先清空xData
    xData.splice(0,xData.length);
    caseNumData.splice(0,caseNumData.length);
    //根据选择的不同时间范围显示不同的横坐标
    //24h以内的横坐标为小时，24h以上的横坐标为天
    if(d == 1){
        for(var i=start;i<=end;i+=3600000){
            var item=new Date(i),
                itemYear=item.getFullYear(),
                itemMonth=item.getMonth()+1,
                itemDay=item.getDate(),
                itemHour=item.getHours();
            if(itemMonth<10){
                itemMonth='0'+itemMonth;
            }
            if(itemDay<10){
                itemDay='0'+itemDay;
            }
            if(itemHour<10){
                itemHour='0'+itemHour;
            }
            /*var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';*/
            var xDataItem=itemHour+':00:00';
            var xDataItemFull=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';
            //var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay;
            xData.push(xDataItem);//x轴时间
            xDataFull.push(xDataItemFull);
            // 获取y轴数据
            var num = 0;
            for (var j = 0; j < caseData.length; j++) {
                if (caseData[j].date >= i && caseData[j].date <= (i + 3600000)) {
                    num++;
                }
            }
            caseNumData.push(num);
        }
    }else{
        for(var i=start;i<=end;i+=86400000){
            var item=new Date(i),
                itemYear=item.getFullYear(),
                itemMonth=item.getMonth()+1,
                itemDay=item.getDate(),
                itemHour=item.getHours();
            if(itemMonth<10){
                itemMonth='0'+itemMonth;
            }
            if(itemDay<10){
                itemDay='0'+itemDay;
            }
            if(itemHour<10){
                itemHour='0'+itemHour;
            }
            /*var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';*/
            //var xDataItem=itemHour+':00:00';
            var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay;
            var xDataItemFull=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';
            xData.push(xDataItem);//x轴时间
            xDataFull.push(xDataItemFull);
            // 获取y轴数据
            var num = 0;
            for (var j = 0; j < caseData.length; j++) {
                if (caseData[j].date >= i && caseData[j].date <= (i + 86400000)) {
                    num++;
                }
            }
            caseNumData.push(num);
        }
    }
    xlength = xDataFull.length;
    //console.log("xlength=",xlength);
    //console.log("xdata",xData);
    //console.log("caseData.length=",caseData.length);
    //console.log("caseNumData",caseNumData);
    timeChart.setOption(timeOption);
}
// 获取自定义时间数据
function getCustomData(){
    var startTime=$("#start-Time").val(),
        endTime=$("#end-Time").val();
    $('#time-ctl').hide();
    getCaseData(startTime, endTime, searchWord,caseCategory, policeStation,token);
    eventData = cvtCaseData2eventData(caseData);
    //console.log(eventData);
}
// 将起止时间转换为x轴数组
function convertToXAxis(){
    var startTime=$("#start-Time").val(),
        endTime=$("#end-Time").val(),
        start=Date.parse(startTime),
        end=Date.parse(endTime);
    xData.splice(0,xData.length);
    caseNumData.splice(0,caseNumData.length);
    //根据选择的不同时间范围显示不同的横坐标
    //24h以内的横坐标为小时，24h以上的横坐标为天
    if((end-start)/86400000 <= 1){
        for(var i=start;i<=end;i+=3600000){
            var item=new Date(i),
                itemYear=item.getFullYear(),
                itemMonth=item.getMonth()+1,
                itemDay=item.getDate(),
                itemHour=item.getHours();
            if(itemMonth<10){
                itemMonth='0'+itemMonth;
            }
            if(itemDay<10){
                itemDay='0'+itemDay;
            }
            if(itemHour<10){
                itemHour='0'+itemHour;
            }
            /*var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';*/
            var xDataItem=itemHour+':00:00';
            var xDataItemFull=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';
            //var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay;
            xData.push(xDataItem);//x轴时间
            xDataFull.push(xDataItemFull);
            // 获取y轴数据
            var num = 0;
            for (var j = 0; j < caseData.length; j++) {
                if (caseData[j].date >= i && caseData[j].date <= (i + 3600000)) {
                    num++;
                }
            }
            caseNumData.push(num);
        }
    }else{
        for(var i=start;i<=end;i+=86400000){
            var item=new Date(i),
                itemYear=item.getFullYear(),
                itemMonth=item.getMonth()+1,
                itemDay=item.getDate(),
                itemHour=item.getHours();
            if(itemMonth<10){
                itemMonth='0'+itemMonth;
            }
            if(itemDay<10){
                itemDay='0'+itemDay;
            }
            if(itemHour<10){
                itemHour='0'+itemHour;
            }
            /*var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';*/
            //var xDataItem=itemHour+':00:00';
            var xDataItem=itemYear+'-'+itemMonth+'-'+itemDay;
            var xDataItemFull=itemYear+'-'+itemMonth+'-'+itemDay+' '+itemHour+':00:00';
            xData.push(xDataItem);//x轴时间
            xDataFull.push(xDataItemFull);
            // 获取y轴数据
            var num = 0;
            for (var j = 0; j < caseData.length; j++) {
                if (caseData[j].date >= i && caseData[j].date <= (i + 86400000)) {
                    num++;
                }
            }
            caseNumData.push(num);
        }
    }
    xlength = xDataFull.length;
    /*for(var i=start;i<=end;i+=3600000){
        var item=new Date(i),
            year=item.getFullYear(),
            month=item.getMonth()+1,
            day=item.getDate(),
            hour=item.getHours();
        if(month<10){
            month='0'+month;
        }
        if(day<10){
            day='0'+day;
        }
        if(hour<10){
            hour='0'+hour;
        }
        var xDataItem=year+'-'+month+'-'+day+' '+hour+':00:00';
        xData.push(xDataItem);*/
}
// 时间选择弹窗完成按钮点击事件
$('#time-choose-complete').on('click',function(){
    getCustomData();//根据自定义时间段获取数据
    convertToXAxis();//将自定义时间转换为底部时间轴
    setMyChartOption();//重新渲染地图echarts
    timeChart.setOption(timeOption);//重新渲染底部echarts
})
// 显示隐藏热力图
function hideHeatMap() {
    myChart.setOption({
        series: {
            id: 'freqHeatmap',
            data: []
        },

        visualMap: {
            id: 'visualMapHeat',
            show: false
        }
    });
}
$("#heat_btn").on('click',function(){
    // .btn-load为数据加载状态, .btn-clear为数据清除状态
    // 用这两个类来标记当前图层状态
    if ($(this).hasClass('btn-load')) {
        // 修改按钮状态
        $(this).addClass('btn-clear').removeClass('btn-load');
        heatmap();
    } else {
        // 修改按钮状态
        $(this).addClass('btn-load').removeClass('btn-clear');
        hideHeatMap();
    }
})
// 显示隐藏散点图
// 显示散点图
function showScatter() {
    /*myChart.setOption({
        series: [{
            id: 'eventDataCategory',
            data: eventData
        },
            {
                id: 'eventDataCategorySurface',
                data: eventData
            }
        ]
    });*/
    var i = 0;
    for (var each in eventData) {
        myChart.setOption({
            series: [
                {
                    id: 'eventDataCategory' + i,
                    data: eventData[each],
                },
                {
                    id: 'eventDataCategorySurface' + i,
                    data: eventData[each],
                }
            ]
        });
        i++;
    }
}
// 隐藏散点图
function hideScatter() {
   /* myChart.setOption({
        series: [{
            id: 'eventDataCategory',
            data: []
        },
            {
                id: 'eventDataCategorySurface',
                data: []
            }
        ]
    });*/
    var i = 0;
    for (var each in eventData) {
        myChart.setOption({
            series: [
                {
                    id: 'eventDataCategory' + i,
                    data: []
                },
                {
                    id: 'eventDataCategorySurface' + i,
                    data: []
                }
            ]
        });
        i++;
    }
}
$('#scatter_btn').on('click',function(){
    // .btn-load为数据加载状态, .btn-clear为数据清除状态
    // 用这两个类来标记当前图层状态
    // .btn-load为数据加载状态, .btn-clear为数据清除状态
    // 用这两个类来标记当前图层状态
    if ($(this).hasClass('btn-load')) {
        // 修改按钮状态
        $(this).addClass('btn-clear').removeClass('btn-load');
        // 对eventData数据按照初始化生成的id进行加载
        showScatter();
    } else {
        // 修改按钮状态
        $(this).addClass('btn-load').removeClass('btn-clear');
        // 清除数据
        hideScatter();
    }
})

// 24小时警情监控
function showLatestCases(cases) {
    var caseSorted = cases.sort(compare('caseDate'));
    //console.log("caseSorted", caseSorted);
    var timeInterval = "";
    var now = new Date();
    for (var i = 0; i < caseSorted.length; i++){
        var interval = now - caseSorted[i].caseDate;
        var minutes = parseInt(interval / 60000);
        if(minutes <= 59){
            timeInterval = minutes + "分钟";
        }else {
            var hours = parseInt(minutes / 60);
            var leftMinutes = parseInt(minutes % 60);
            timeInterval = hours + "小时" + leftMinutes + "分钟";
        }
        /*var clickCaseId = caseSorted[i].caseId;*/
        $('#inspect ul').prepend("<li class='case_item'>" + "<p class='case_title' onclick='clickCase(\"" + caseSorted[i].caseId + "\")'>" + "<span class='dot dot_blue'></span>" + caseSorted[i].caseTitle + "</p>" + "<p class='case_time'>" + timeInterval + "前" + "</p>")
    }
}
//根据caseDataNew数组中每一个案件对象的时间排序
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

//用获取的派出所数据渲染下拉列表
/*(function() {
    console.log("policeStation", policeStationList);
    for(var i = 0; i < policeStationList.length; i++){
        $('#police_station').append("<option>" + policeStationList[i] + "</option>");
    }
}());*/
//获取用户输入的搜索信息
var keyword = "",
    searchCategory = [],
    policeStationChosen = "";
function getSearchInfo() {
    //input输入框
    keyword = document.getElementById('search_input').value;
    //console.log("keyword", keyword);
    searchCategory.splice(0,searchCategory.length);
    if (all_li_police[0].className == "li_clicked") {
        searchCategory.push(-1);
    }else {
        for (var i = 1; i < all_li_police.length; i++){
            if(all_li_police[i].className == "li_clicked"){
                searchCategory.push(i - 1);
            }
        }
    }
    //console.log("search", searchCategory);
    policeStationChosen = $('#police_station').val();
    //console.log("policeStation", policeStationChosen);
}
//点击搜索按钮向后台发送请求
$('.left_panel .search_btn').on('click', function () {
    //$(".filter").slideToggle();
    console.log("搜索");
    getSearchInfo();
    var searchWord = keyword;
    var caseCategory = searchCategory;
    var policeStation = policeStationChosen;
    //如果用户没有进行操作直接返回
    if(searchWord == "" && caseCategory.length == 0 && policeStation == "十八里店"){
        return;
    }else if(searchCategory[0] == -1){
        $.ajax({
            type: 'post',
            url: BASE_URL + '/map/searchCases',
            data: JSON.stringify({
                "params": {
                    "search_word": searchWord,
                    "police_station": policeStation,
                    "token": token
                }
            }),
            async:false,
            dataType: 'json',
            contentType: 'application/json',
            success: function(res) {
                caseData = res.detail.cases;
            },
            error: function() {
                alert("获取数据失败");
            }
        })
    }else{
        $.ajax({
            type: 'post',
            url: BASE_URL + '/map/searchCases',
            data: JSON.stringify({
                "params": {
                    "search_word": searchWord,
                    "case_category": caseCategory,
                    "police_station": policeStation,
                    "token": token
                }
            }),
            async:false,
            dataType: 'json',
            contentType: 'application/json',
            success: function(res) {
                caseData = res.detail.cases;
            },
            error: function() {
                alert("获取数据失败");
            }
        })
    }
    // 先清除地图上已经加载的散点图和热力图
    hideScatter();
    hideHeatMap();
    // 获得新的数据
    eventData = cvtCaseData2eventData(caseData);
    loadNewMapLayer();
})

function loadNewMapLayer() {
    // 显示新的散点图 并且把相关按钮的状态设置正确
    showScatter();
    //heatmap();
    if ($('#scatter_btn').hasClass('btn-load')){
        $('#scatter_btn').addClass('btn-clear').removeClass('btn-load');
    }
    if ($('#heat_btn').hasClass('btn-clear')){
        $('#heat_btn').addClass('btn-load').removeClass('btn-clear');
    }
}

/*// 格子热力图的相关设置
// 定义颜色 1-诈骗 2-盗窃
var COLORS = ["#00BCFF", "#3F8EFF"];
// 每一个格子的经纬度跨度
var cellSizeCoord = [0.002946, 0.002244];
// 获取警情预测信息后存储经纬度和百分比信息
var coordinateData = [];
function getCoordinateData() {
    getCasePrediction();
    var dataTmp = [];
    var longitude = '';
    var latitude = '';
    var percentage = '';
    var category = '';
    for (var i = 0; i < casePrediction.length; i ++){
        longitude = casePrediction[i].longitude;
        latitude = casePrediction[i].latitude;
        percentage = casePrediction[i].percentage;
        category = casePrediction[i].category;
        dataTmp.push([longitude, latitude, category]);
    }
    coordinateData = dataTmp;
    console.log("coordinateData", coordinateData);
}
getCoordinateData();

// 自定义图形渲染逻辑
function renderItem(params, api) {
    console.log("api", api);
    // 获取dataItem中的第一个值和第二个值
    var lngData = api.value(0);
    var latData = api.value(1);

    var pointLeftTop = [
        (lngData - cellSizeCoord[0] / 2).toFixed(6),
        (latData + cellSizeCoord[1] / 2).toFixed(6)
    ];
    var pointRightBottom = [
        (lngData + cellSizeCoord[0] / 2).toFixed(6),
        (latData - cellSizeCoord[1] / 2).toFixed(6)
    ];

    return {
        type: 'rect',
        shape: {
            x: pointLeftTop[0],
            y: pointLeftTop[1],
            width: pointRightBottom[0] - pointLeftTop[0],
            height: pointRightBottom[1] - pointLeftTop[1]
        }
    };
}
renderItem();
option = {
    tooltip: {},
    visualMap: {
        type: 'piecewise',
        inverse: true,
        top: 10,
        left: 10,
        pieces: [{
            value: 1, color: COLORS[0]
        }, {
            value: 2, color: COLORS[1]
        }],
        borderColor: '#ccc',
        borderWidth: 2,
        backgroundColor: '#eee',
        dimension: 2,
        inRange: {
            color: COLORS,
            opacity: 0.7
        }
    },
    series: [
        {
            type: 'custom',
            coordinateSystem: 'leaflet',
            name: 'Average',
            renderItem: renderItem,
            animation: false,
            itemStyle: {
                emphasis: {
                    color: 'yellow'
                }
            },
            encode: {
                tooltip: 2
            },
            data: coordinateData
        }
    ]
};
myChart.setOption(option);*/


/*
var COLORS = ["#070093", "#1c3fbf", "#1482e5", "#70b4eb", "#b4e0f3", "#ffffff"];
var lngExtent = [39.5, 40.6];
var latExtent = [115.9, 116.8];
var cellCount = [50, 50];
var cellSizeCoord = [
    (lngExtent[1] - lngExtent[0]) / cellCount[0],
    (latExtent[1] - latExtent[0]) / cellCount[1]
];
var gapSize = 0;
var data = [[0,0,5],[1,0,5],[2,0,5],[3,0,5],[4,0,5],[5,0,5],[6,0,5],[7,0,5],[8,0,5],[9,0,5],[10,0,5],[11,0,5],[12,0,5],[13,0,5],[14,0,5],[15,0,5],[16,0,5],[17,0,5],[18,0,5],[19,0,5],[20,0,5],[21,0,5],[22,0,5],[23,0,5],[24,0,5],[25,0,5],[26,0,5],[27,0,5],[28,0,5],[29,0,5],[30,0,5],[31,0,5],[32,0,5],[33,0,5],[34,0,5],[35,0,5],[36,0,5],[37,0,5],[38,0,5],[39,0,5],[40,0,5],[41,0,5],[42,0,5],[43,0,5],[44,0,5],[45,0,5],[46,0,5],[47,0,5],[48,0,5],[49,0,5],[0,1,5],[1,1,5],[2,1,5],[3,1,5],[4,1,5],[5,1,5],[6,1,5],[7,1,5],[8,1,5],[9,1,5],[10,1,5],[11,1,5],[12,1,5],[13,1,5],[14,1,5],[15,1,5],[16,1,5],[17,1,5],[18,1,5],[19,1,5],[20,1,5],[21,1,5],[22,1,5],[23,1,5],[24,1,5],[25,1,5],[26,1,5],[27,1,5],[28,1,5],[29,1,5],[30,1,5],[31,1,5],[32,1,5],[33,1,5],[34,1,5],[35,1,5],[36,1,5],[37,1,5],[38,1,5],[39,1,5],[40,1,5],[41,1,5],[42,1,5],[43,1,5],[44,1,5],[45,1,5],[46,1,5],[47,1,5],[48,1,5],[49,1,5],[0,2,5],[1,2,5],[2,2,5],[3,2,5],[4,2,5],[5,2,5],[6,2,5],[7,2,5],[8,2,5],[9,2,5],[10,2,5],[11,2,5],[12,2,5],[13,2,5],[14,2,5],[15,2,5],[16,2,5],[17,2,5],[18,2,5],[19,2,5],[20,2,5],[21,2,5],[22,2,5],[23,2,5],[24,2,4],[25,2,5],[26,2,5],[27,2,5],[28,2,5],[29,2,5],[30,2,5],[31,2,5],[32,2,5],[33,2,5],[34,2,4],[35,2,5],[36,2,5],[37,2,5],[38,2,5],[39,2,5],[40,2,5],[41,2,5],[42,2,5],[43,2,5],[44,2,5],[45,2,5],[46,2,5],[47,2,5],[48,2,5],[49,2,5],[0,3,5],[1,3,5],[2,3,5],[3,3,5],[4,3,5],[5,3,5],[6,3,5],[7,3,5],[8,3,5],[9,3,5],[10,3,5],[11,3,5],[12,3,5],[13,3,5],[14,3,5],[15,3,5],[16,3,5],[17,3,5],[18,3,5],[19,3,5],[20,3,5],[21,3,5],[22,3,5],[23,3,5],[24,3,5],[25,3,5],[26,3,5],[27,3,5],[28,3,5],[29,3,5],[30,3,5],[31,3,5],[32,3,5],[33,3,4],[34,3,5],[35,3,5],[36,3,5],[37,3,5],[38,3,5],[39,3,5],[40,3,5],[41,3,5],[42,3,5],[43,3,5],[44,3,5],[45,3,5],[46,3,5],[47,3,5],[48,3,5],[49,3,5],[0,4,5],[1,4,5],[2,4,5],[3,4,5],[4,4,5],[5,4,5],[6,4,5],[7,4,5],[8,4,5],[9,4,5],[10,4,5],[11,4,5],[12,4,5],[13,4,5],[14,4,5],[15,4,5],[16,4,5],[17,4,4],[18,4,5],[19,4,5],[20,4,5],[21,4,5],[22,4,5],[23,4,5],[24,4,5],[25,4,5],[26,4,5],[27,4,5],[28,4,5],[29,4,5],[30,4,5],[31,4,5],[32,4,5],[33,4,4],[34,4,5],[35,4,5],[36,4,5],[37,4,5],[38,4,5],[39,4,5],[40,4,5],[41,4,5],[42,4,5],[43,4,5],[44,4,5],[45,4,5],[46,4,5],[47,4,5],[48,4,5],[49,4,5],[0,5,5],[1,5,5],[2,5,5],[3,5,5],[4,5,5],[5,5,5],[6,5,5],[7,5,5],[8,5,5],[9,5,5],[10,5,5],[11,5,5],[12,5,5],[13,5,5],[14,5,5],[15,5,5],[16,5,5],[17,5,5],[18,5,5],[19,5,5],[20,5,5],[21,5,5],[22,5,5],[23,5,5],[24,5,5],[25,5,5],[26,5,5],[27,5,5],[28,5,5],[29,5,5],[30,5,5],[31,5,5],[32,5,5],[33,5,5],[34,5,5],[35,5,5],[36,5,5],[37,5,5],[38,5,5],[39,5,5],[40,5,5],[41,5,5],[42,5,5],[43,5,5],[44,5,5],[45,5,5],[46,5,5],[47,5,5],[48,5,5],[49,5,5],[0,6,5],[1,6,5],[2,6,5],[3,6,5],[4,6,5],[5,6,5],[6,6,5],[7,6,5],[8,6,5],[9,6,5],[10,6,5],[11,6,5],[12,6,5],[13,6,5],[14,6,5],[15,6,5],[16,6,5],[17,6,5],[18,6,5],[19,6,5],[20,6,5],[21,6,5],[22,6,5],[23,6,5],[24,6,5],[25,6,5],[26,6,4],[27,6,5],[28,6,5],[29,6,4],[30,6,5],[31,6,5],[32,6,5],[33,6,5],[34,6,5],[35,6,5],[36,6,5],[37,6,5],[38,6,5],[39,6,5],[40,6,5],[41,6,5],[42,6,5],[43,6,5],[44,6,5],[45,6,5],[46,6,5],[47,6,5],[48,6,5],[49,6,5],[0,7,5],[1,7,5],[2,7,5],[3,7,5],[4,7,5],[5,7,5],[6,7,5],[7,7,5],[8,7,5],[9,7,5],[10,7,5],[11,7,5],[12,7,5],[13,7,5],[14,7,5],[15,7,5],[16,7,5],[17,7,4],[18,7,5],[19,7,4],[20,7,4],[21,7,5],[22,7,5],[23,7,5],[24,7,5],[25,7,5],[26,7,5],[27,7,5],[28,7,5],[29,7,5],[30,7,5],[31,7,5],[32,7,5],[33,7,5],[34,7,5],[35,7,5],[36,7,5],[37,7,5],[38,7,5],[39,7,5],[40,7,5],[41,7,5],[42,7,5],[43,7,5],[44,7,5],[45,7,5],[46,7,5],[47,7,5],[48,7,5],[49,7,5],[0,8,5],[1,8,5],[2,8,5],[3,8,5],[4,8,5],[5,8,4],[6,8,5],[7,8,4],[8,8,5],[9,8,5],[10,8,5],[11,8,5],[12,8,5],[13,8,5],[14,8,5],[15,8,4],[16,8,5],[17,8,5],[18,8,5],[19,8,5],[20,8,5],[21,8,5],[22,8,4],[23,8,4],[24,8,4],[25,8,5],[26,8,5],[27,8,5],[28,8,4],[29,8,4],[30,8,5],[31,8,5],[32,8,4],[33,8,4],[34,8,5],[35,8,5],[36,8,5],[37,8,5],[38,8,5],[39,8,5],[40,8,5],[41,8,5],[42,8,5],[43,8,5],[44,8,5],[45,8,5],[46,8,5],[47,8,5],[48,8,5],[49,8,5],[0,9,5],[1,9,5],[2,9,5],[3,9,5],[4,9,5],[5,9,5],[6,9,5],[7,9,5],[8,9,4],[9,9,5],[10,9,5],[11,9,4],[12,9,5],[13,9,4],[14,9,5],[15,9,4],[16,9,4],[17,9,5],[18,9,5],[19,9,5],[20,9,5],[21,9,5],[22,9,5],[23,9,5],[24,9,4],[25,9,5],[26,9,4],[27,9,4],[28,9,4],[29,9,5],[30,9,5],[31,9,5],[32,9,5],[33,9,5],[34,9,4],[35,9,5],[36,9,5],[37,9,5],[38,9,5],[39,9,5],[40,9,5],[41,9,5],[42,9,5],[43,9,5],[44,9,5],[45,9,5],[46,9,5],[47,9,5],[48,9,5],[49,9,5],[0,10,5],[1,10,5],[2,10,5],[3,10,5],[4,10,5],[5,10,5],[6,10,5],[7,10,5],[8,10,5],[9,10,5],[10,10,5],[11,10,5],[12,10,5],[13,10,5],[14,10,5],[15,10,4],[16,10,5],[17,10,5],[18,10,5],[19,10,4],[20,10,5],[21,10,4],[22,10,4],[23,10,4],[24,10,4],[25,10,4],[26,10,4],[27,10,5],[28,10,5],[29,10,4],[30,10,5],[31,10,4],[32,10,5],[33,10,5],[34,10,5],[35,10,4],[36,10,5],[37,10,5],[38,10,5],[39,10,5],[40,10,5],[41,10,5],[42,10,5],[43,10,5],[44,10,5],[45,10,5],[46,10,5],[47,10,5],[48,10,5],[49,10,5],[0,11,5],[1,11,5],[2,11,5],[3,11,5],[4,11,5],[5,11,5],[6,11,5],[7,11,5],[8,11,5],[9,11,5],[10,11,4],[11,11,4],[12,11,4],[13,11,2],[14,11,2],[15,11,2],[16,11,5],[17,11,4],[18,11,4],[19,11,1],[20,11,1],[21,11,4],[22,11,4],[23,11,5],[24,11,4],[25,11,4],[26,11,4],[27,11,4],[28,11,4],[29,11,4],[30,11,4],[31,11,4],[32,11,5],[33,11,5],[34,11,5],[35,11,4],[36,11,4],[37,11,4],[38,11,5],[39,11,5],[40,11,5],[41,11,5],[42,11,5],[43,11,5],[44,11,5],[45,11,5],[46,11,5],[47,11,5],[48,11,5],[49,11,5],[0,12,5],[1,12,5],[2,12,5],[3,12,5],[4,12,5],[5,12,5],[6,12,5],[7,12,5],[8,12,4],[9,12,4],[10,12,4],[11,12,2],[12,12,2],[13,12,2],[14,12,2],[15,12,5],[16,12,4],[17,12,4],[18,12,4],[19,12,4],[20,12,1],[21,12,4],[22,12,4],[23,12,4],[24,12,5],[25,12,4],[26,12,4],[27,12,4],[28,12,4],[29,12,4],[30,12,4],[31,12,4],[32,12,4],[33,12,4],[34,12,4],[35,12,4],[36,12,4],[37,12,4],[38,12,5],[39,12,5],[40,12,5],[41,12,5],[42,12,5],[43,12,5],[44,12,5],[45,12,5],[46,12,5],[47,12,5],[48,12,5],[49,12,5],[0,13,5],[1,13,5],[2,13,5],[3,13,5],[4,13,5],[5,13,5],[6,13,5],[7,13,5],[8,13,4],[9,13,4],[10,13,4],[11,13,4],[12,13,1],[13,13,4],[14,13,2],[15,13,4],[16,13,4],[17,13,4],[18,13,4],[19,13,4],[20,13,4],[21,13,4],[22,13,4],[23,13,4],[24,13,4],[25,13,4],[26,13,4],[27,13,4],[28,13,5],[29,13,4],[30,13,4],[31,13,4],[32,13,5],[33,13,4],[34,13,4],[35,13,5],[36,13,4],[37,13,4],[38,13,5],[39,13,4],[40,13,4],[41,13,5],[42,13,5],[43,13,4],[44,13,5],[45,13,5],[46,13,5],[47,13,5],[48,13,5],[49,13,5],[0,14,5],[1,14,5],[2,14,5],[3,14,5],[4,14,5],[5,14,5],[6,14,5],[7,14,5],[8,14,4],[9,14,4],[10,14,4],[11,14,2],[12,14,2],[13,14,4],[14,14,1],[15,14,4],[16,14,4],[17,14,4],[18,14,4],[19,14,4],[20,14,4],[21,14,4],[22,14,2],[23,14,4],[24,14,2],[25,14,3],[26,14,3],[27,14,3],[28,14,4],[29,14,3],[30,14,4],[31,14,5],[32,14,3],[33,14,3],[34,14,4],[35,14,4],[36,14,4],[37,14,4],[38,14,5],[39,14,5],[40,14,5],[41,14,5],[42,14,5],[43,14,5],[44,14,5],[45,14,5],[46,14,5],[47,14,5],[48,14,5],[49,14,5],[0,15,5],[1,15,5],[2,15,5],[3,15,5],[4,15,5],[5,15,5],[6,15,5],[7,15,5],[8,15,5],[9,15,4],[10,15,4],[11,15,4],[12,15,4],[13,15,1],[14,15,1],[15,15,1],[16,15,4],[17,15,2],[18,15,2],[19,15,4],[20,15,3],[21,15,3],[22,15,2],[23,15,2],[24,15,1],[25,15,1],[26,15,3],[27,15,3],[28,15,3],[29,15,3],[30,15,5],[31,15,5],[32,15,4],[33,15,4],[34,15,4],[35,15,4],[36,15,4],[37,15,5],[38,15,5],[39,15,2],[40,15,5],[41,15,5],[42,15,5],[43,15,5],[44,15,5],[45,15,5],[46,15,5],[47,15,5],[48,15,5],[49,15,5],[0,16,5],[1,16,5],[2,16,5],[3,16,5],[4,16,5],[5,16,5],[6,16,5],[7,16,5],[8,16,5],[9,16,4],[10,16,3],[11,16,4],[12,16,4],[13,16,1],[14,16,4],[15,16,4],[16,16,4],[17,16,4],[18,16,3],[19,16,2],[20,16,4],[21,16,2],[22,16,2],[23,16,1],[24,16,0],[25,16,0],[26,16,0],[27,16,0],[28,16,3],[29,16,4],[30,16,4],[31,16,4],[32,16,4],[33,16,4],[34,16,3],[35,16,4],[36,16,4],[37,16,4],[38,16,5],[39,16,5],[40,16,5],[41,16,5],[42,16,5],[43,16,5],[44,16,4],[45,16,5],[46,16,5],[47,16,5],[48,16,5],[49,16,5],[0,17,5],[1,17,5],[2,17,5],[3,17,5],[4,17,4],[5,17,5],[6,17,4],[7,17,5],[8,17,4],[9,17,4],[10,17,3],[11,17,4],[12,17,4],[13,17,4],[14,17,4],[15,17,4],[16,17,4],[17,17,4],[18,17,3],[19,17,2],[20,17,3],[21,17,2],[22,17,1],[23,17,1],[24,17,1],[25,17,0],[26,17,1],[27,17,1],[28,17,3],[29,17,4],[30,17,4],[31,17,3],[32,17,3],[33,17,4],[34,17,4],[35,17,4],[36,17,4],[37,17,4],[38,17,4],[39,17,4],[40,17,5],[41,17,4],[42,17,5],[43,17,5],[44,17,5],[45,17,5],[46,17,5],[47,17,5],[48,17,5],[49,17,5],[0,18,5],[1,18,5],[2,18,5],[3,18,5],[4,18,5],[5,18,5],[6,18,5],[7,18,4],[8,18,4],[9,18,3],[10,18,3],[11,18,4],[12,18,4],[13,18,4],[14,18,4],[15,18,2],[16,18,4],[17,18,2],[18,18,3],[19,18,2],[20,18,4],[21,18,1],[22,18,0],[23,18,0],[24,18,0],[25,18,3],[26,18,1],[27,18,4],[28,18,1],[29,18,1],[30,18,1],[31,18,4],[32,18,3],[33,18,4],[34,18,3],[35,18,3],[36,18,4],[37,18,4],[38,18,4],[39,18,5],[40,18,4],[41,18,4],[42,18,5],[43,18,4],[44,18,4],[45,18,5],[46,18,5],[47,18,5],[48,18,5],[49,18,5],[0,19,5],[1,19,5],[2,19,5],[3,19,5],[4,19,5],[5,19,5],[6,19,4],[7,19,4],[8,19,3],[9,19,4],[10,19,3],[11,19,4],[12,19,3],[13,19,4],[14,19,2],[15,19,2],[16,19,1],[17,19,3],[18,19,1],[19,19,0],[20,19,0],[21,19,1],[22,19,0],[23,19,1],[24,19,0],[25,19,0],[26,19,1],[27,19,0],[28,19,0],[29,19,1],[30,19,4],[31,19,4],[32,19,3],[33,19,3],[34,19,4],[35,19,4],[36,19,4],[37,19,4],[38,19,4],[39,19,4],[40,19,4],[41,19,5],[42,19,5],[43,19,4],[44,19,5],[45,19,5],[46,19,5],[47,19,5],[48,19,5],[49,19,5],[0,20,5],[1,20,5],[2,20,5],[3,20,5],[4,20,5],[5,20,4],[6,20,4],[7,20,4],[8,20,4],[9,20,4],[10,20,3],[11,20,4],[12,20,3],[13,20,4],[14,20,2],[15,20,1],[16,20,1],[17,20,1],[18,20,1],[19,20,0],[20,20,0],[21,20,1],[22,20,1],[23,20,1],[24,20,1],[25,20,1],[26,20,0],[27,20,0],[28,20,0],[29,20,1],[30,20,1],[31,20,0],[32,20,4],[33,20,3],[34,20,4],[35,20,2],[36,20,4],[37,20,4],[38,20,4],[39,20,4],[40,20,4],[41,20,5],[42,20,4],[43,20,5],[44,20,5],[45,20,5],[46,20,5],[47,20,5],[48,20,5],[49,20,5],[0,21,5],[1,21,5],[2,21,5],[3,21,5],[4,21,5],[5,21,4],[6,21,5],[7,21,4],[8,21,3],[9,21,4],[10,21,4],[11,21,4],[12,21,4],[13,21,3],[14,21,2],[15,21,3],[16,21,4],[17,21,1],[18,21,1],[19,21,0],[20,21,0],[21,21,0],[22,21,1],[23,21,0],[24,21,0],[25,21,1],[26,21,2],[27,21,0],[28,21,1],[29,21,1],[30,21,1],[31,21,4],[32,21,4],[33,21,4],[34,21,3],[35,21,2],[36,21,4],[37,21,1],[38,21,4],[39,21,4],[40,21,4],[41,21,4],[42,21,5],[43,21,4],[44,21,5],[45,21,5],[46,21,5],[47,21,5],[48,21,5],[49,21,5],[0,22,5],[1,22,5],[2,22,5],[3,22,5],[4,22,5],[5,22,4],[6,22,4],[7,22,4],[8,22,4],[9,22,3],[10,22,4],[11,22,3],[12,22,2],[13,22,2],[14,22,2],[15,22,0],[16,22,0],[17,22,0],[18,22,1],[19,22,0],[20,22,0],[21,22,0],[22,22,0],[23,22,0],[24,22,0],[25,22,0],[26,22,0],[27,22,0],[28,22,1],[29,22,1],[30,22,1],[31,22,0],[32,22,1],[33,22,3],[34,22,4],[35,22,2],[36,22,4],[37,22,1],[38,22,4],[39,22,2],[40,22,4],[41,22,1],[42,22,5],[43,22,1],[44,22,5],[45,22,5],[46,22,5],[47,22,5],[48,22,5],[49,22,5],[0,23,5],[1,23,5],[2,23,5],[3,23,5],[4,23,5],[5,23,5],[6,23,4],[7,23,4],[8,23,4],[9,23,3],[10,23,3],[11,23,1],[12,23,1],[13,23,1],[14,23,2],[15,23,0],[16,23,0],[17,23,0],[18,23,0],[19,23,0],[20,23,0],[21,23,0],[22,23,0],[23,23,1],[24,23,0],[25,23,1],[26,23,1],[27,23,2],[28,23,0],[29,23,0],[30,23,0],[31,23,0],[32,23,4],[33,23,1],[34,23,1],[35,23,2],[36,23,2],[37,23,2],[38,23,0],[39,23,2],[40,23,0],[41,23,1],[42,23,1],[43,23,1],[44,23,5],[45,23,5],[46,23,5],[47,23,5],[48,23,5],[49,23,5],[0,24,5],[1,24,5],[2,24,5],[3,24,5],[4,24,5],[5,24,5],[6,24,5],[7,24,4],[8,24,4],[9,24,4],[10,24,4],[11,24,4],[12,24,1],[13,24,1],[14,24,1],[15,24,1],[16,24,1],[17,24,0],[18,24,1],[19,24,1],[20,24,0],[21,24,0],[22,24,1],[23,24,2],[24,24,0],[25,24,0],[26,24,0],[27,24,0],[28,24,0],[29,24,0],[30,24,1],[31,24,1],[32,24,1],[33,24,4],[34,24,4],[35,24,1],[36,24,1],[37,24,2],[38,24,2],[39,24,2],[40,24,2],[41,24,4],[42,24,0],[43,24,5],[44,24,5],[45,24,4],[46,24,5],[47,24,5],[48,24,5],[49,24,5],[0,25,5],[1,25,5],[2,25,5],[3,25,5],[4,25,5],[5,25,5],[6,25,5],[7,25,4],[8,25,4],[9,25,4],[10,25,4],[11,25,4],[12,25,1],[13,25,1],[14,25,3],[15,25,1],[16,25,0],[17,25,0],[18,25,0],[19,25,0],[20,25,0],[21,25,0],[22,25,0],[23,25,1],[24,25,1],[25,25,0],[26,25,0],[27,25,0],[28,25,1],[29,25,0],[30,25,1],[31,25,1],[32,25,1],[33,25,3],[34,25,4],[35,25,4],[36,25,4],[37,25,2],[38,25,2],[39,25,4],[40,25,4],[41,25,4],[42,25,5],[43,25,5],[44,25,5],[45,25,5],[46,25,5],[47,25,5],[48,25,5],[49,25,5],[0,26,5],[1,26,5],[2,26,5],[3,26,5],[4,26,5],[5,26,5],[6,26,5],[7,26,5],[8,26,4],[9,26,4],[10,26,1],[11,26,1],[12,26,1],[13,26,1],[14,26,1],[15,26,0],[16,26,0],[17,26,2],[18,26,1],[19,26,0],[20,26,0],[21,26,1],[22,26,0],[23,26,0],[24,26,1],[25,26,0],[26,26,0],[27,26,0],[28,26,0],[29,26,1],[30,26,1],[31,26,0],[32,26,4],[33,26,2],[34,26,2],[35,26,2],[36,26,2],[37,26,4],[38,26,2],[39,26,4],[40,26,1],[41,26,4],[42,26,4],[43,26,4],[44,26,4],[45,26,5],[46,26,5],[47,26,5],[48,26,5],[49,26,5],[0,27,5],[1,27,5],[2,27,5],[3,27,5],[4,27,5],[5,27,5],[6,27,5],[7,27,5],[8,27,5],[9,27,2],[10,27,4],[11,27,4],[12,27,4],[13,27,1],[14,27,1],[15,27,0],[16,27,1],[17,27,0],[18,27,0],[19,27,0],[20,27,1],[21,27,1],[22,27,0],[23,27,1],[24,27,0],[25,27,0],[26,27,0],[27,27,0],[28,27,0],[29,27,1],[30,27,1],[31,27,0],[32,27,1],[33,27,1],[34,27,3],[35,27,4],[36,27,4],[37,27,4],[38,27,4],[39,27,4],[40,27,2],[41,27,5],[42,27,5],[43,27,5],[44,27,5],[45,27,4],[46,27,5],[47,27,5],[48,27,5],[49,27,5],[0,28,5],[1,28,5],[2,28,5],[3,28,5],[4,28,5],[5,28,5],[6,28,5],[7,28,5],[8,28,2],[9,28,4],[10,28,2],[11,28,2],[12,28,4],[13,28,2],[14,28,3],[15,28,0],[16,28,1],[17,28,0],[18,28,0],[19,28,0],[20,28,1],[21,28,0],[22,28,0],[23,28,0],[24,28,0],[25,28,0],[26,28,0],[27,28,0],[28,28,0],[29,28,0],[30,28,1],[31,28,0],[32,28,0],[33,28,1],[34,28,1],[35,28,4],[36,28,4],[37,28,4],[38,28,4],[39,28,4],[40,28,4],[41,28,5],[42,28,5],[43,28,5],[44,28,5],[45,28,5],[46,28,5],[47,28,5],[48,28,5],[49,28,5],[0,29,5],[1,29,5],[2,29,5],[3,29,5],[4,29,5],[5,29,5],[6,29,5],[7,29,5],[8,29,5],[9,29,5],[10,29,4],[11,29,4],[12,29,4],[13,29,2],[14,29,2],[15,29,0],[16,29,0],[17,29,0],[18,29,0],[19,29,1],[20,29,0],[21,29,0],[22,29,0],[23,29,0],[24,29,1],[25,29,2],[26,29,0],[27,29,0],[28,29,0],[29,29,1],[30,29,0],[31,29,0],[32,29,0],[33,29,3],[34,29,4],[35,29,4],[36,29,3],[37,29,3],[38,29,3],[39,29,4],[40,29,4],[41,29,5],[42,29,5],[43,29,5],[44,29,4],[45,29,5],[46,29,5],[47,29,5],[48,29,5],[49,29,5],[0,30,5],[1,30,5],[2,30,5],[3,30,5],[4,30,5],[5,30,4],[6,30,4],[7,30,4],[8,30,5],[9,30,4],[10,30,3],[11,30,4],[12,30,4],[13,30,4],[14,30,4],[15,30,1],[16,30,1],[17,30,1],[18,30,0],[19,30,1],[20,30,0],[21,30,1],[22,30,0],[23,30,0],[24,30,1],[25,30,0],[26,30,0],[27,30,0],[28,30,0],[29,30,1],[30,30,1],[31,30,4],[32,30,4],[33,30,4],[34,30,4],[35,30,4],[36,30,3],[37,30,3],[38,30,3],[39,30,5],[40,30,5],[41,30,4],[42,30,5],[43,30,5],[44,30,5],[45,30,5],[46,30,5],[47,30,5],[48,30,5],[49,30,5],[0,31,5],[1,31,5],[2,31,5],[3,31,5],[4,31,5],[5,31,5],[6,31,5],[7,31,5],[8,31,5],[9,31,4],[10,31,3],[11,31,4],[12,31,2],[13,31,3],[14,31,3],[15,31,3],[16,31,0],[17,31,0],[18,31,0],[19,31,1],[20,31,2],[21,31,2],[22,31,1],[23,31,0],[24,31,0],[25,31,3],[26,31,1],[27,31,1],[28,31,4],[29,31,2],[30,31,1],[31,31,4],[32,31,3],[33,31,2],[34,31,2],[35,31,4],[36,31,3],[37,31,4],[38,31,4],[39,31,4],[40,31,4],[41,31,5],[42,31,5],[43,31,5],[44,31,5],[45,31,5],[46,31,5],[47,31,5],[48,31,5],[49,31,5],[0,32,5],[1,32,5],[2,32,5],[3,32,5],[4,32,5],[5,32,5],[6,32,5],[7,32,5],[8,32,5],[9,32,4],[10,32,3],[11,32,2],[12,32,2],[13,32,2],[14,32,1],[15,32,3],[16,32,4],[17,32,3],[18,32,0],[19,32,2],[20,32,2],[21,32,1],[22,32,0],[23,32,1],[24,32,0],[25,32,0],[26,32,0],[27,32,0],[28,32,1],[29,32,1],[30,32,4],[31,32,3],[32,32,3],[33,32,4],[34,32,3],[35,32,4],[36,32,3],[37,32,3],[38,32,4],[39,32,5],[40,32,4],[41,32,5],[42,32,5],[43,32,5],[44,32,5],[45,32,5],[46,32,5],[47,32,5],[48,32,5],[49,32,5],[0,33,5],[1,33,5],[2,33,5],[3,33,5],[4,33,5],[5,33,4],[6,33,4],[7,33,5],[8,33,4],[9,33,5],[10,33,2],[11,33,4],[12,33,2],[13,33,4],[14,33,4],[15,33,4],[16,33,2],[17,33,3],[18,33,2],[19,33,0],[20,33,4],[21,33,0],[22,33,1],[23,33,1],[24,33,1],[25,33,0],[26,33,1],[27,33,0],[28,33,4],[29,33,1],[30,33,1],[31,33,3],[32,33,3],[33,33,4],[34,33,4],[35,33,3],[36,33,4],[37,33,3],[38,33,5],[39,33,4],[40,33,4],[41,33,5],[42,33,5],[43,33,5],[44,33,5],[45,33,4],[46,33,5],[47,33,5],[48,33,5],[49,33,5],[0,34,5],[1,34,5],[2,34,5],[3,34,5],[4,34,5],[5,34,5],[6,34,5],[7,34,5],[8,34,5],[9,34,4],[10,34,4],[11,34,4],[12,34,4],[13,34,4],[14,34,3],[15,34,4],[16,34,3],[17,34,3],[18,34,1],[19,34,2],[20,34,1],[21,34,2],[22,34,1],[23,34,2],[24,34,1],[25,34,2],[26,34,1],[27,34,1],[28,34,0],[29,34,0],[30,34,3],[31,34,3],[32,34,4],[33,34,4],[34,34,4],[35,34,4],[36,34,4],[37,34,5],[38,34,5],[39,34,5],[40,34,5],[41,34,5],[42,34,5],[43,34,5],[44,34,5],[45,34,5],[46,34,5],[47,34,5],[48,34,5],[49,34,5],[0,35,4],[1,35,4],[2,35,5],[3,35,5],[4,35,4],[5,35,4],[6,35,4],[7,35,4],[8,35,4],[9,35,5],[10,35,4],[11,35,4],[12,35,4],[13,35,3],[14,35,3],[15,35,4],[16,35,1],[17,35,3],[18,35,4],[19,35,4],[20,35,4],[21,35,4],[22,35,3],[23,35,2],[24,35,2],[25,35,3],[26,35,2],[27,35,3],[28,35,2],[29,35,2],[30,35,2],[31,35,3],[32,35,3],[33,35,4],[34,35,4],[35,35,5],[36,35,5],[37,35,5],[38,35,5],[39,35,5],[40,35,5],[41,35,5],[42,35,5],[43,35,5],[44,35,5],[45,35,5],[46,35,5],[47,35,5],[48,35,5],[49,35,5],[0,36,5],[1,36,5],[2,36,5],[3,36,5],[4,36,5],[5,36,5],[6,36,5],[7,36,5],[8,36,5],[9,36,5],[10,36,5],[11,36,4],[12,36,2],[13,36,1],[14,36,4],[15,36,1],[16,36,2],[17,36,1],[18,36,1],[19,36,1],[20,36,4],[21,36,4],[22,36,4],[23,36,1],[24,36,2],[25,36,1],[26,36,3],[27,36,3],[28,36,3],[29,36,3],[30,36,5],[31,36,4],[32,36,4],[33,36,4],[34,36,4],[35,36,4],[36,36,5],[37,36,5],[38,36,5],[39,36,5],[40,36,5],[41,36,5],[42,36,4],[43,36,5],[44,36,5],[45,36,5],[46,36,2],[47,36,5],[48,36,5],[49,36,5],[0,37,5],[1,37,5],[2,37,5],[3,37,5],[4,37,5],[5,37,5],[6,37,5],[7,37,5],[8,37,5],[9,37,4],[10,37,5],[11,37,5],[12,37,5],[13,37,4],[14,37,1],[15,37,1],[16,37,4],[17,37,2],[18,37,2],[19,37,2],[20,37,5],[21,37,5],[22,37,5],[23,37,5],[24,37,1],[25,37,2],[26,37,2],[27,37,4],[28,37,3],[29,37,5],[30,37,5],[31,37,2],[32,37,4],[33,37,4],[34,37,4],[35,37,5],[36,37,5],[37,37,5],[38,37,5],[39,37,5],[40,37,5],[41,37,5],[42,37,5],[43,37,2],[44,37,5],[45,37,5],[46,37,5],[47,37,5],[48,37,5],[49,37,5],[0,38,5],[1,38,5],[2,38,5],[3,38,5],[4,38,5],[5,38,5],[6,38,5],[7,38,5],[8,38,5],[9,38,4],[10,38,5],[11,38,5],[12,38,2],[13,38,2],[14,38,1],[15,38,2],[16,38,1],[17,38,4],[18,38,4],[19,38,5],[20,38,4],[21,38,5],[22,38,4],[23,38,2],[24,38,2],[25,38,5],[26,38,5],[27,38,4],[28,38,4],[29,38,5],[30,38,4],[31,38,5],[32,38,5],[33,38,5],[34,38,5],[35,38,5],[36,38,5],[37,38,5],[38,38,5],[39,38,5],[40,38,5],[41,38,5],[42,38,5],[43,38,5],[44,38,5],[45,38,5],[46,38,5],[47,38,5],[48,38,5],[49,38,5],[0,39,5],[1,39,5],[2,39,5],[3,39,5],[4,39,5],[5,39,5],[6,39,5],[7,39,5],[8,39,5],[9,39,4],[10,39,5],[11,39,5],[12,39,4],[13,39,2],[14,39,4],[15,39,2],[16,39,2],[17,39,4],[18,39,4],[19,39,5],[20,39,4],[21,39,5],[22,39,5],[23,39,5],[24,39,5],[25,39,5],[26,39,5],[27,39,5],[28,39,4],[29,39,4],[30,39,4],[31,39,4],[32,39,4],[33,39,5],[34,39,5],[35,39,5],[36,39,5],[37,39,5],[38,39,5],[39,39,5],[40,39,5],[41,39,5],[42,39,5],[43,39,5],[44,39,5],[45,39,5],[46,39,5],[47,39,5],[48,39,5],[49,39,5],[0,40,5],[1,40,5],[2,40,5],[3,40,5],[4,40,5],[5,40,4],[6,40,5],[7,40,5],[8,40,5],[9,40,5],[10,40,5],[11,40,4],[12,40,4],[13,40,4],[14,40,2],[15,40,2],[16,40,4],[17,40,2],[18,40,5],[19,40,5],[20,40,5],[21,40,5],[22,40,5],[23,40,4],[24,40,4],[25,40,5],[26,40,5],[27,40,4],[28,40,5],[29,40,5],[30,40,4],[31,40,4],[32,40,5],[33,40,4],[34,40,5],[35,40,5],[36,40,5],[37,40,5],[38,40,5],[39,40,5],[40,40,5],[41,40,5],[42,40,5],[43,40,5],[44,40,5],[45,40,5],[46,40,5],[47,40,5],[48,40,5],[49,40,5],[0,41,5],[1,41,5],[2,41,5],[3,41,5],[4,41,5],[5,41,5],[6,41,5],[7,41,5],[8,41,5],[9,41,5],[10,41,5],[11,41,5],[12,41,5],[13,41,4],[14,41,4],[15,41,4],[16,41,4],[17,41,4],[18,41,5],[19,41,5],[20,41,5],[21,41,5],[22,41,5],[23,41,5],[24,41,5],[25,41,5],[26,41,4],[27,41,5],[28,41,5],[29,41,2],[30,41,5],[31,41,4],[32,41,5],[33,41,5],[34,41,5],[35,41,5],[36,41,5],[37,41,5],[38,41,5],[39,41,5],[40,41,5],[41,41,5],[42,41,5],[43,41,5],[44,41,5],[45,41,5],[46,41,5],[47,41,5],[48,41,5],[49,41,5],[0,42,5],[1,42,5],[2,42,5],[3,42,5],[4,42,5],[5,42,5],[6,42,5],[7,42,5],[8,42,5],[9,42,5],[10,42,5],[11,42,4],[12,42,4],[13,42,5],[14,42,5],[15,42,4],[16,42,4],[17,42,5],[18,42,5],[19,42,5],[20,42,5],[21,42,5],[22,42,5],[23,42,5],[24,42,5],[25,42,5],[26,42,5],[27,42,5],[28,42,5],[29,42,2],[30,42,5],[31,42,5],[32,42,5],[33,42,5],[34,42,5],[35,42,5],[36,42,5],[37,42,5],[38,42,5],[39,42,5],[40,42,5],[41,42,5],[42,42,5],[43,42,5],[44,42,5],[45,42,5],[46,42,5],[47,42,5],[48,42,5],[49,42,5],[0,43,5],[1,43,5],[2,43,5],[3,43,5],[4,43,5],[5,43,5],[6,43,5],[7,43,5],[8,43,5],[9,43,5],[10,43,5],[11,43,5],[12,43,5],[13,43,2],[14,43,5],[15,43,5],[16,43,5],[17,43,5],[18,43,5],[19,43,5],[20,43,5],[21,43,5],[22,43,5],[23,43,5],[24,43,5],[25,43,5],[26,43,5],[27,43,5],[28,43,5],[29,43,5],[30,43,4],[31,43,4],[32,43,4],[33,43,4],[34,43,5],[35,43,5],[36,43,5],[37,43,5],[38,43,4],[39,43,4],[40,43,4],[41,43,5],[42,43,5],[43,43,5],[44,43,5],[45,43,5],[46,43,5],[47,43,5],[48,43,5],[49,43,5],[0,44,5],[1,44,5],[2,44,5],[3,44,5],[4,44,5],[5,44,5],[6,44,5],[7,44,5],[8,44,5],[9,44,5],[10,44,5],[11,44,5],[12,44,5],[13,44,2],[14,44,5],[15,44,5],[16,44,5],[17,44,5],[18,44,5],[19,44,5],[20,44,4],[21,44,5],[22,44,5],[23,44,5],[24,44,5],[25,44,5],[26,44,5],[27,44,5],[28,44,5],[29,44,5],[30,44,2],[31,44,4],[32,44,2],[33,44,2],[34,44,2],[35,44,4],[36,44,4],[37,44,5],[38,44,5],[39,44,4],[40,44,5],[41,44,4],[42,44,5],[43,44,5],[44,44,5],[45,44,5],[46,44,5],[47,44,5],[48,44,5],[49,44,5],[0,45,5],[1,45,5],[2,45,5],[3,45,5],[4,45,5],[5,45,5],[6,45,5],[7,45,5],[8,45,5],[9,45,5],[10,45,5],[11,45,5],[12,45,5],[13,45,5],[14,45,5],[15,45,5],[16,45,5],[17,45,5],[18,45,5],[19,45,4],[20,45,5],[21,45,5],[22,45,5],[23,45,5],[24,45,5],[25,45,5],[26,45,5],[27,45,5],[28,45,5],[29,45,5],[30,45,4],[31,45,2],[32,45,2],[33,45,2],[34,45,2],[35,45,4],[36,45,4],[37,45,4],[38,45,4],[39,45,4],[40,45,5],[41,45,4],[42,45,4],[43,45,5],[44,45,5],[45,45,5],[46,45,5],[47,45,5],[48,45,5],[49,45,5],[0,46,5],[1,46,5],[2,46,5],[3,46,5],[4,46,5],[5,46,5],[6,46,5],[7,46,5],[8,46,5],[9,46,5],[10,46,5],[11,46,5],[12,46,5],[13,46,5],[14,46,5],[15,46,5],[16,46,5],[17,46,5],[18,46,5],[19,46,5],[20,46,5],[21,46,5],[22,46,5],[23,46,5],[24,46,5],[25,46,5],[26,46,5],[27,46,5],[28,46,5],[29,46,4],[30,46,4],[31,46,4],[32,46,4],[33,46,2],[34,46,2],[35,46,4],[36,46,2],[37,46,4],[38,46,5],[39,46,4],[40,46,5],[41,46,5],[42,46,5],[43,46,5],[44,46,5],[45,46,5],[46,46,5],[47,46,5],[48,46,5],[49,46,5],[0,47,5],[1,47,5],[2,47,5],[3,47,5],[4,47,5],[5,47,5],[6,47,5],[7,47,5],[8,47,5],[9,47,5],[10,47,5],[11,47,5],[12,47,5],[13,47,5],[14,47,5],[15,47,5],[16,47,5],[17,47,5],[18,47,5],[19,47,5],[20,47,5],[21,47,5],[22,47,5],[23,47,5],[24,47,5],[25,47,5],[26,47,5],[27,47,5],[28,47,5],[29,47,5],[30,47,5],[31,47,5],[32,47,4],[33,47,5],[34,47,4],[35,47,5],[36,47,5],[37,47,5],[38,47,5],[39,47,5],[40,47,4],[41,47,4],[42,47,5],[43,47,5],[44,47,5],[45,47,5],[46,47,5],[47,47,5],[48,47,5],[49,47,5],[0,48,5],[1,48,5],[2,48,5],[3,48,5],[4,48,5],[5,48,5],[6,48,5],[7,48,5],[8,48,5],[9,48,5],[10,48,5],[11,48,5],[12,48,5],[13,48,4],[14,48,5],[15,48,4],[16,48,5],[17,48,5],[18,48,5],[19,48,5],[20,48,5],[21,48,5],[22,48,5],[23,48,5],[24,48,5],[25,48,5],[26,48,5],[27,48,5],[28,48,5],[29,48,5],[30,48,5],[31,48,5],[32,48,5],[33,48,5],[34,48,5],[35,48,5],[36,48,5],[37,48,5],[38,48,5],[39,48,5],[40,48,5],[41,48,4],[42,48,4],[43,48,5],[44,48,5],[45,48,5],[46,48,5],[47,48,5],[48,48,5],[49,48,5],[0,49,5],[1,49,5],[2,49,5],[3,49,5],[4,49,5],[5,49,5],[6,49,5],[7,49,5],[8,49,5],[9,49,5],[10,49,5],[11,49,5],[12,49,5],[13,49,5],[14,49,5],[15,49,5],[16,49,5],[17,49,5],[18,49,5],[19,49,5],[20,49,5],[21,49,5],[22,49,5],[23,49,5],[24,49,5],[25,49,5],[26,49,5],[27,49,5],[28,49,5],[29,49,5],[30,49,5],[31,49,5],[32,49,5],[33,49,5],[34,49,5],[35,49,5],[36,49,5],[37,49,5],[38,49,5],[39,49,5],[40,49,5],[41,49,4],[42,49,5],[43,49,5],[44,49,5],[45,49,5],[46,49,5],[47,49,5],[48,49,5],[49,49,5]];

function renderItem(params, api) {
    console.log("params", params);
    console.log("api", api);
    var context = params.context;
    var lngIndex = api.value(0);
    var latIndex = api.value(1);
    var coordLeftTop = [
        +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
        +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
    ];



    var pointLeftTop = getCoord(params, api, lngIndex, latIndex);
    var pointRightBottom = getCoord(params, api, lngIndex + 1, latIndex + 1);

    return {
        type: 'rect',
        shape: {
            x: pointLeftTop[0],
            y: pointLeftTop[1],
            width: pointRightBottom[0] - pointLeftTop[0],
            height: pointRightBottom[1] - pointLeftTop[1]
        },
        style: api.style({
            stroke: 'rgba(0,0,0,0.1)'
        }),
        styleEmphasis: api.styleEmphasis()
    };
}
//var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function getCoord(params, api, lngIndex, latIndex) {
    var coords = params.context.coords || (params.context.coords = []);
    var key = lngIndex + '-' + latIndex;

    // bmap returns point in integer, which makes cell width unstable.
    // So we have to use right bottom point.
    return coords[key] || (coords[key] = api.coord([
        +(latExtent[0] + lngIndex * cellSizeCoord[0]).toFixed(6),
        +(lngExtent[0] + latIndex * cellSizeCoord[1]).toFixed(6)
    ]));
}

option = {
    tooltip: {},
    visualMap: {
        type: 'piecewise',
        inverse: true,
        top: 10,
        left: 10,
        pieces: [{
            value: 0, color: COLORS[0]
        }, {
            value: 1, color: COLORS[1]
        }, {
            value: 2, color: COLORS[2]
        }, {
            value: 3, color: COLORS[3]
        }, {
            value: 4, color: COLORS[4]
        }, {
            value: 5, color: COLORS[5]
        }],
        borderColor: '#ccc',
        borderWidth: 2,
        backgroundColor: '#eee',
        dimension: 2,
        inRange: {
            color: COLORS,
            opacity: 0.7
        }
    },

    /!*bmap: {
        center: [116.46, 39.92],
        zoom: 11.8,
        roam: true,

    },*!/
    /!*leaflet: {
        center: [116.46, 39.92],
        zoom: 12,
        roam: true,
        tile: {
            url: 'http://wprd03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        }
    },*!/
    series: [
        {
            type: 'custom',
            coordinateSystem: 'leaflet',
            name: 'Average',
            renderItem: renderItem,
            animation: false,
            itemStyle: {
                emphasis: {
                    color: 'yellow'
                }
            },
            encode: {
                tooltip: 2
            },
            data: data
        }
    ]
};
myChart.setOption(option);
*/
