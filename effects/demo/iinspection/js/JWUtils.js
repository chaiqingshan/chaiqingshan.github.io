var JWUtils = {
	
	//数据模块
	datas : {
		successFlag : "success"
	},
	
	//AJAX
	ajax : function(url,async,data,successCallback,faildCallback){
		var formatData = {params : data};
		if (data == null) {
			var temp = { unused : "" };
			formatData = { params : temp };
		}
		$.ajax({
			type : "post",
			url : url,
			async: async,
			dataType:'json',
			contentType:'application/json',
			data : JSON.stringify(formatData),
			success : function(data){
				if (JWUtils.datas.successFlag == data.result) {
					if (successCallback != null) {
						successCallback(data);
					}
				} else {
					if (faildCallback != null) {
						faildCallback(data);
					} 
				}
			},
			error :function(data){
				//nope
			}
		});
	},
	
	graph : {
		createSimpleGraph : function(divId, categoryName, categories, links, nodes, clickFun) {
			var myChart = echarts.init(document.getElementById(divId));
			// 获取myChart的父元素
			var $parentContainer = $('#trace-graph ~ .col-md-12');
			myChart.resize({
				width: $parentContainer.css('width'),
				height: 600
			});
			option = {
				color : [ '#f57643', '#bda93a', '#61a0a8', '#dd4b39', '#f39c12',
						'#3c8dbc', '#ffff00', '#00FF7F', '#1E90FF', '#6A5ACD',
						'#7CFC00', '#8B0000', '#D2691E', '#DB7093', '#E9967A' ],
				legend : [ {
					textStyle : {
						color : '#ccc'
					},
					tooltip : {
						show : true
					},
					bottom : 0,
					data : categoryName
				} ],
				toolbox : {
					show : true,
					feature : {
						dataView : {
							show : false,
							readOnly : true
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				series : [ {
					id : 'relationshipGraph',
					type : 'graph',
					name : 'relationship',
					layout : 'force',
					force : {
						repulsion : 2000
					},
					roam : true,
					draggable : true,
					focusNodeAdjacency : true,
					lineStyle : {
						normal : {
							color : 'source',
							curveness : 0,
							type : "solid"
						}
					},
					label : {
						normal : {
							show : true,
							position : 'top'
						}
					},

					// 关系图数据
					categories : categories,
					links : links,
					data : nodes,

					tooltip : {}
				} ],
				animationDuration : 3000,
				animationEasingUpdate : 'quinticInOut'
			};
			myChart.setOption(option);
			myChart.on('click', function (params) {
				clickFun(params);
			});
		}
	}
};