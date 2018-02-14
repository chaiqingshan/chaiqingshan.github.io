/**
 * 本文件包含ECharts配置相关代码
 */


var dom = $("#container")[0];
var myChart = echarts.init(dom);
var option = null;


/**
 * 初始化ECharts的series
 * @return {对象数组} [返回series对象数组]
 */
function initSeries() {
    var mySeries = [
        // 警车位置散点图数据
        {
            id: 'carPosition',
            type: 'scatter',
            coordinateSystem: 'leaflet',
            symbol: 'path://M626.688 106.496l-16.384-8.192-24.576 40.96 16.384 8.192L626.688 106.496zM606.208 217.088l45.056-8.192-4.096-16.384-45.056 8.192L606.208 217.088zM524.288 61.44l-16.384 0 0 45.056 16.384 0L524.288 61.44zM933.888 569.344l-36.864 0-45.056-245.76c0-45.056-36.864-81.92-86.016-81.92-4.096 0-4.096 0-4.096 0l0 0 0 0-180.224 0L581.632 192.512l0 0c0 0 0 0 0 0 0-36.864-28.672-65.536-61.44-65.536-36.864 0-61.44 28.672-61.44 65.536 0 0 0 0 0 0l0 0L458.752 245.76 270.336 245.76l0 0 0 0c0 0 0 0-4.096 0C221.184 245.76 180.224 282.624 180.224 327.68l-45.056 245.76L90.112 573.44C40.96 569.344 0 614.4 0 667.648l0 204.8 73.728 0 0 28.672c0 36.864 28.672 61.44 61.44 61.44s61.44-28.672 61.44-61.44l0-28.672 626.688 0 0 28.672c0 36.864 28.672 61.44 61.44 61.44 36.864 0 61.44-28.672 61.44-61.44l0-28.672L1024 872.448l0-204.8C1024 614.4 983.04 569.344 933.888 569.344zM135.168 778.24c-36.864 0-61.44-28.672-61.44-61.44 0-36.864 28.672-61.44 61.44-61.44s61.44 28.672 61.44 61.44C200.704 749.568 172.032 778.24 135.168 778.24zM253.952 569.344l45.056-200.704 425.984 0 45.056 200.704L253.952 569.344zM888.832 778.24c-36.864 0-61.44-28.672-61.44-61.44 0-36.864 28.672-61.44 61.44-61.44 36.864 0 61.44 28.672 61.44 61.44C950.272 749.568 921.6 778.24 888.832 778.24zM430.08 200.704 385.024 192.512 380.928 208.896l45.056 8.192L430.08 200.704zM442.368 139.264l-24.576-36.864L405.504 110.592l24.576 36.864L442.368 139.264z',
            symbolSize: 15,
            data: []
        },

        // 警车路线数据图：路线
        {
            id: 'policeCarLine',
            type: 'lines',
            coordinateSystem: 'leaflet',
            polyline: true,
            data: [],
            silent: true,
            lineStyle: {
                normal: {
                    color: '#c23531',
                    color: 'rgb(200, 35, 45)',
                    opacity: 0.2,
                    width: 1
                }
            },
            progressiveThreshold: 500,
            progressive: 200
        },

        // 警车路线数据图：动态
        {
            id: 'policeCarEffect',
            type: 'lines',
            coordinateSystem: 'leaflet',
            polyline: true,
            data: [],
            lineStyle: {
                normal: {
                    width: 0
                }
            },
            effect: {
                constantSpeed: 20,
                show: true,
                trailLength: 0.1,
                symbolSize: 1.5
            },
            zlevel: 1
        },

        // 案情热力图数据
        {
            id: 'freqHeatmap',
            type: 'heatmap',
            coordinateSystem: 'leaflet',
            data: []
        },

        // 外来人口热力图
        {
            id: 'outsiderHeatmap',
            type: 'heatmap',
            coordinateSystem: 'leaflet',
            data: []
        }
    ];

    // 添加案情散点图数据
    convertEventData2Series(eventData, mySeries);

    return mySeries;
}


/**
 * myChart初始化函数
 */
function setMyChartOption() {
    // ECharts配置项
    option = {
        backgroundColor: '#ccc',

        animation: true,

        animationDuration: 200,

        animationEasing: 'cubicInOut',

        animationDurationUpdate: 200,

        animationEasingUpdate: 'cubicInOut',

        title: [{
            id: 'statistic',
            right: 120,
            top: 40,
            width: 100,
            textStyle: {
                color: '#fff',
                fontSize: 16
            }
        }],

        toolbox: {
            orient: 'horizontal',
            itemSize: 20,
            left: 0,
            top: -50,
            iconStyle: {
                normal: {
                    borderColor: '#fff'
                },
                emphasis: {
                    borderColor: '#b1e4ff'
                }
            },
            feature: {
                // dataZoom: {},
                saveAsImage: {
                    show: true
                }
            }
        },

        brush: {},

        leaflet: {
            center: [116.461985, 39.918461],
            zoom: 12,
            roam: true,
            tile: {
                //url: 'http://124.127.117.32:8081/googlemaps/cobalt/{z}/{x}/{y}.png'
                url: 'http://wprd03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}'
            }
        },

        tooltip: {
            trigger: 'item'
        },

        grid: {
            show: false,
            right: 12,
            top: 50,
            width: '20%'
        },

        xAxis: {
            type: 'value',
            scale: true,
            position: 'top',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                margin: 2,
                textStyle: {
                    color: '#aaa'
                }
            },
        },

        yAxis: {
            type: 'category',
            nameGap: 16,
            axisLine: {
                show: false,
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisTick: {
                show: false,
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    fontFamily: "SimSun",
                    color: '#f4e925',
                    fontSize: 12
                }
            },
            data: []
        },

        legend: {
            top: 0,
            right: 0,
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            backgroundColor: 'rgba(37, 40, 48, 0.8)',
            data: typeArr,
            show: false
        },

        visualMap: [
            // 热力图的颜色映射工具条(当前是关闭状态)
            {
                id: 'visualMapHeat',
                type: 'continuous',
                right: 10,
                bottom: 100,
                //控制颜色条是否显示
                show: false,
                seriesIndex: 3,
                min: 0,
                max: 50,
                calculable: true,
                text: ['高', '低'],
                textStyle: {
                    color: '#fff'
                },
                inRange: {
                    color: ['#2E7FDA', '#17C0F6']
                }
            },

            // 外来人口热力图的视觉映射组件
            {
                id: 'outsiderVisualMap',
                type: 'continuous',
                left: 10,
                bottom: 100,
                show: false,
                seriesIndex: 4,
                //设置热力图的热力最大值和最小值，控制颜色深浅
                min: 0,
                max: 7000,
                calculable: true,
                text: ['高', '低'],
                textStyle: {
                    color: '#fff'
                },
                inRange: {
                    color: ['#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    //color: ['red', 'black', 'green', 'yellow', 'white']
                }
            }
        ],

        series: initSeries()
    }; // end option


    // 初始化图表
    if (option && typeof option === "object") {
        myChart.showLoading();
        // 初始化，notMerge = true
        myChart.setOption(option, true);
        // 设置brush事件相关
        myChart.setOption({
            brush: {
                toolbox: ['rect', 'polygon', 'keep', 'clear'],
                outOfBrush: {
                    color: '#abc'
                },
                brushStyle: {
                    borderWidth: 2,
                    color: 'rgba(0, 53, 111, 0.5)',
                    borderColor: '#1b87ff',
                },
                throttleType: 'debounce',
                throttleDelay: 300,
                geoIndex: 0,
                // 根据series动态设置brush事件的seriesIndex，也就是选框数据可以选择到的series
                // 默认按照案情散点数据series均在series数组的末端，设置智能选择案情散点数据
                seriesIndex: (function() {
                    var brushSeriesIndex = [];
                    var eventDataLen = Object.keys(eventData).length;
                    var seriesLen = myChart.getOption().series.length;
                    console.log("seriesLen", seriesLen);
                    console.log("eventDataLen", eventDataLen);
                    for (var i = seriesLen - eventDataLen * 2 + 1; i < seriesLen; i+=2) {
                        brushSeriesIndex.push(i);
                    }
                    return brushSeriesIndex;
                })()
            }
        });
        myChart.hideLoading();
    }
}


// 设置ECharts的配置并加载数据
setMyChartOption();