/**
 * 本文件包含数据向ECharts图表需要的格式转换的相关函数：
 * 1.案件散点数据格式转换convertEventData2Series: 将eventData转换成按类别分类的散点图series
 * 2.热力图数据格式转换convertFreqData
 */


/**
 * 将案情数据转换成按类别的series散点数据
 * @param  {对象数组} data   [事件数据eventData]
 * @param  {对象数组} series [echarts.option中的mySeries]
 */
function convertEventData2Series(data, series) {
    var srs = {};
    var i = 0;
    // console.log(data)
    // 将data中每一类的案件数据导入到一个series对象中
    for (var each in data) {
		
		srsSurface = {
            // id用于清除案情按钮
            id: 'eventDataCategorySurface' + i,
            type: 'scatter',
            // name用于legend
            name: each,
            coordinateSystem: 'leaflet',
            // data是案情散点数据
            data: data[each],
            // 散点图散点点大小
            symbolSize: 30,
            
            itemStyle: {
                normal: {
					opacity: 0.1,
                    // 改变散点颜色, colorList中的颜色循环显示
                    color: function(params) {
                        /*var colorList = [
							'#00A86C','#E9435F','#F5BE9E','#0276BD','#52BBF6','#C4F1FE','#F7920F',
							'#A8E5A3','#F08CBB','#FFFFFF','#B6BDC1','#F6D52A','#62D0D1','#CFB32E',
							'#9DBE76','#A06AC0','#B3247F','#5AD099','#BA8769','#FC9D9C','#9E152D',
							'#59873D'
                        ];*/
                        var colorList = [
                            '#1db0fa','#4bd964','#f93c32','#cea917'
                        ];
                        return colorList[(params.seriesIndex - 5) / 2];
                    }
                }
            },
            
        };
		series.push(srsSurface);
        srs = {
            // id用于清除案情按钮
            id: 'eventDataCategory' + i,
            type: 'scatter',
            // name用于legend
            name: each,
            coordinateSystem: 'leaflet',
            // data是案情散点数据
            data: data[each],
            // 散点图散点点大小
            symbolSize: 8,
            label: {
                normal: {
                    show: false
                },
                // hover时显示的文字
                emphasis: {
                    show: true,
                    position: 'right',
                    formatter: function(params) {
                        return caseAbstract[params.value[2]];
                    },
                    textStyle: {
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    // 改变散点颜色, colorList中的颜色循环显示
                    color: function(params) {
                        /*var colorList = [
							'#00A86C','#E9435F','#F5BE9E','#0276BD','#52BBF6','#C4F1FE','#F7920F',
							'#A8E5A3','#F08CBB','#FFFFFF','#B6BDC1','#F6D52A','#62D0D1','#CFB32E',
							'#9DBE76','#A06AC0','#B3247F','#5AD099','#BA8769','#FC9D9C','#9E152D',
							'#59873D'
                        ];*/
                        var colorList = [
                            '#f93c32','#1db0fa','#cea917','#4bd964'
                        ];
                        return colorList[params.seriesIndex % 5];
                    }
                }
            },
            // tips文字信息(ECharts原生在百度地图上有bug，已使用了自己重构的)
            tooltip: {
                show: false,
                position: function(pos, params, dom, rect, size) {
                    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                    // var obj = { top: pos[1] };
                    // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                    // return obj;
                },

                formatter: function(params) {
                    return params.name + ': ' + caseAbstract[params.value[2]];
                }
            }
        };
		
        series.push(srs);
		
        i++;
    }
    /*var srs = {};
    // console.log(data)
    // 将data中每一类的案件数据导入到一个series对象中
    srsSurface = {
            // id用于清除案情按钮
            id: 'eventDataCategorySurface',
            type: 'scatter',
            // name用于legend
            name: 'cases',
            coordinateSystem: 'leaflet',
            // data是案情散点数据
            data: data,
            // 散点图散点点大小
            symbolSize: 28,

            itemStyle: {
                normal: {
                    opacity: 0.2,
                    // 改变散点颜色, colorList中的颜色循环显示
                    color: function(params) {
                        var colorList = [
                            '#00A86C','#E9435F','#F5BE9E','#0276BD','#52BBF6','#C4F1FE','#F7920F',
                            '#A8E5A3','#F08CBB','#FFFFFF','#B6BDC1','#F6D52A','#62D0D1','#CFB32E',
                            '#9DBE76','#A06AC0','#B3247F','#5AD099','#BA8769','#FC9D9C','#9E152D',
                            '#59873D'
                        ];
                        return colorList[params.seriesIndex % colorList.length];
                    }
                }
            },

        };
        series.push(srsSurface);
        srs = {
            // id用于清除案情按钮
            id: 'eventDataCategory',
            type: 'scatter',
            // name用于legend
            name: 'cases',
            coordinateSystem: 'leaflet',
            // data是案情散点数据
            data: data,
            // 散点图散点点大小
            symbolSize: 13,
            label: {
                normal: {
                    show: false
                },
                // hover时显示的文字
                emphasis: {
                    show: true,
                    position: 'right',
                    formatter: function(params) {
                        return caseAbstract[params.value[2]];
                    },
                    textStyle: {
                        fontSize: 14
                    }
                }
            },
            itemStyle: {
                normal: {
                    // 改变散点颜色, colorList中的颜色循环显示
                    color: function(params) {
                        var colorList = [
                            '#00A86C','#E9435F','#F5BE9E','#0276BD','#52BBF6','#C4F1FE','#F7920F',
                            '#A8E5A3','#F08CBB','#FFFFFF','#B6BDC1','#F6D52A','#62D0D1','#CFB32E',
                            '#9DBE76','#A06AC0','#B3247F','#5AD099','#BA8769','#FC9D9C','#9E152D',
                            '#59873D'
                        ];
                        return colorList[params.seriesIndex % colorList.length];
                    }
                }
            },
            // tips文字信息(ECharts原生在百度地图上有bug，已使用了自己重构的)
            tooltip: {
                show: false,
                position: function(pos, params, dom, rect, size) {
                    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                    // var obj = { top: pos[1] };
                    // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                    // return obj;
                },

                formatter: function(params) {
                    return params.name + ': ' + caseAbstract[params.value[2]];
                }
            }
        };
        series.push(srs);*/
}


/**
 * 转换热力图频度数据
 * @param  {对象数组} data [eventData[类别]，即对应类别的事件列表]
 * @return {二维数组}      [行对应不同的数据项,列分别为经度、维度、频度]
 */
function convertFreqData(data) {
	
    var res = [];
    for (var i = 0; i < data.length; i++) {
		if(data[i].value[0]!="null"&&data[i].value[1]!="null"){
			// 热力频度均赋值为10
			res.push([parseFloat(data[i].value[0]), parseFloat(data[i].value[1]), 10]);
		}
        
    }
	
    return res;
}

/* 警情关系图*/
/**
 * 创建关系图的nodes数据
 * @param  {JSON对象} relationData [请求返回的relationData(过滤掉前几级key)]
 * @return {对象数组}               [关系图配置项中的nodes(或data)]
 */
function createRelationGraphNodes(relationData) {
    var nodes = [];
    // 创建案件ID结点(中心结点)
    nodes.push({
        name: '当前警情',
        symbolSize: 40,
        itemStyle: {
            normal: {
                color: '#0f8bfa'
            }
        }
    });
    // 创建事主身份结点
    nodes.push({
        name: '事主',
        category: '事主',
        symbolSize: 30,
        itemStyle: {
            normal: {
                color: '#b08362'
            }
        }
    });
    // 创建附近案件结点
    nodes.push({
        name: '附近',
        category: '附近',
        symbolSize: 25,
        itemStyle: {
            normal: {
                color: '#1886d4'
            }
        }
    });
    // 创建嫌疑人结点
    nodes.push({
        name: '嫌疑人',
        category: '嫌疑人',
        symbolSize: 30,
        itemStyle: {
            normal: {
                color: '#25b6b9'
            }
        }
    });
    if (relationData.identity) {
        // 添加事主身份子结点
        nodes.push({
            name: relationData.identity,
            value: relationData.caseId,
            category: '事主',
            symbolSize: 20
        });
    }
    // 添加附近案件子结点
    var i = 0;
    for (i = 0; i < 5 && i < relationData.nearCaseValues.length; i++) {
        nodes.push({
            /*name: relationData.nearCaseValues[i] + '(' + relationData.nearCaseIds[i] + ')',*/
            name: relationData.nearCaseValues[i],
            value: relationData.nearCaseIds[i],
            category: '附近',
            symbolSize: 20
        });
    }
    // 添加嫌疑人子结点
    for (i = 0; i < 5 && i < relationData.suspectValues.length; i++) {
        nodes.push({
            name: relationData.suspectValues[i],
            category: '嫌疑人',
            symbolSize: 20
        });
    }
    return nodes;
}


/**
 * 创建关系图的links数组
 * @param  {JSON对象} relationData [请求返回的relationData(过滤掉前几级key)]
 * @return {对象数组}               [关系图配置项中的links(或edges)]
 */
function createRelationGraphLinks(relationData) {
    var links = [];
    // 连接案件ID中心结点与下一级子结点
    links.push({
        source: '当前警情',
        target: '事主',
        value: 40
    });
    links.push({
        source: '当前警情',
        target: '附近',
        value: 40
    });
    links.push({
        source: '当前警情',
        target: '嫌疑人',
        value: 40
    });
    // 连接事主身份和下一级子结点
    if (relationData.identity) {
        links.push({
            source: '事主',
            target: relationData.identity,
            value: 30
        });
    }
    // 连接附近案件和下一级子结点
    var i = 0;
    for (i = 0; i < 5 && i < relationData.nearCaseValues.length; i++) {
        links.push({
            source: '附近',
            target: relationData.nearCaseValues[i],
            value: 20
            /*(function() {
                var distance = relationData.nearCaseDistances[i];
                if (distance >= 0 && distance <= 10) {
                    return distance + 1;
                } else {
                    return distance / 10 + distance % 10 + 10;
                }
            }())*/
        });
    }
    // 连接嫌疑人和下一级子结点
    for (i = 0; i < 5 && i < relationData.suspectValues.length; i++) {
        links.push({
            source: '嫌疑人',
            target: relationData.suspectValues[i],
            value: (function() {
                var distance = relationData.suspectDistances[i];
                if (distance >= 0 && distance <= 10) {
                    return distance + 1;
                } else {
                    return distance / 10 + distance % 10 + 10;
                }
            }())
        })
    }
    return links;
}


/**
 * 创建关系图配置对象
 * @param  {JSON对象} relationData [请求返回的relationData(过滤掉前几级key)]
 * @return {option对象}            [关系图配置对象]
 */
function createRelationGraphOption(relationData) {
    var option = {
        color: ['#b08362', '#1886d4', '#25b6b9'],
       /* legend: [{
            textStyle: {
                color: '#ccc'
            },
            tooltip: {
                show: true
            },
            bottom: 0,
            data: ['事主', '附近', '嫌疑人']
        }],*/
        toolbox: {
            show: true,
            feature: {
                dataView: { show: false, readOnly: true },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: [{
            id: 'relationshipGraph',
            type: 'graph',
            name: 'relationship',
            layout: 'force',
            force: {
                repulsion: 450,
                edgeLength: [0, 30]
            },
            roam: true,
            draggable: true,
            focusNodeAdjacency: true,
            lineStyle: {
                normal: {
                    color: 'source',
                    curveness: 0,
                    type: "solid"
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                }
            },

            // 关系图数据
            categories: [{
                'name': '事主'
            }, {
                'name': '附近'
            }, {
                'name': '嫌疑人'
            }],
            nodes: createRelationGraphNodes(relationData),
            links: createRelationGraphLinks(relationData),

            tooltip: {}
        }],
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut'
    };
    return option;
}
