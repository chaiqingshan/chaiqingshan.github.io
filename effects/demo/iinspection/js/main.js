//全局变量定义
var graph;//从后台获取的关联图数据
var current_node;//存放当前节点 
var current_back;//存放当前背景焦点  
var public_nodes;//存放导入的节点列表
var public_edges;//存放导入的边列表
var node_max_id;//存放当前Graph文件中node id最大的值
var edge_max_id;//存放当前Graph文件中edge id最大的值
var activeTab = "tab1";//当前tab页，默认第一个tab页
var previousTab;//存放上一个tab页，默认为空。
var tabId=0;
var canvas;
var X;
var Y;
var clickNumber =0;//标记点击，区分张开关闭
var flag;
var LAYOUT_DURATION = 400,
    LOCATE_OPTIONS = {duration: 400, padding: {top: 200, bottom: 80, left: 30, right: 30}};

 /*动态创建tab标签页*/
    $.ajax({
        type: "post",
        url: BASE_URL + '/rel/loadCaseCanvas',
        data: JSON.stringify({
            "params": {               
             "case_id":""+window.parent.searchCase_id,               
             "token":""+window.parent.token
            }
        }),
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            var g = res.detail;
            if (!g.nodes && !g.edges) {
              for(var i = 0;i<g.nodes.length;i++) {
                g.nodes[i].attributes = {"x":0,"y":90};
              }
              graph = g;
              node_max_id = graph.nodes[graph.nodes.length-1].id*10;//新生成节点的id
              edge_max_id = graph.edges[graph.edges.length-1].id*10;//新生成边的id
            }
            else {
              alert("抱歉，没有当前画布的数据...");
            }
            
        },
        error: function() {
            alert("获取数据失败");
        }
    });
var DB = {
    // Search a node by its `case_id` property
    search: function (name) {
      return graph.nodes.filter(function (node) {
        var case_id = node.caseId;

        return case_id && case_id.toLowerCase().indexOf(name.toLowerCase()) === 0;
      })[0] || null;
    },

    // Retrieve the list of neighbors of a node
    getNeighbors: function (id) {
      var neighborsIds;
      var index;//当前节点的id
      for(var i = 0;i<graph.nodes.length;i++) {
        if(graph.nodes[i].id === id) {
            neighborsIds = graph.nodes[i].neighbors;
            index = i;
        }
      }
      return {
        nodeIds: neighborsIds.nodes,
        edgeIds: neighborsIds.edges,
        nodes: neighborsIds.nodes.map(function (nid) { 
          for(var i = 0;i<graph.nodes.length;i++) {
             if(graph.nodes[i].id === nid) {
                 return graph.nodes[i];
             }
          } 
        }),
      }
    },
  //根据id取得边
  getEdgeById: function(id) {
    for(var edge in graph.edges) {
      if(graph.edges[edge].id == id){
        return graph.edges[edge];
      }
    }
  },
  
  //根据id取得边
  getNodeById: function(id) {
    for(var node in graph.nodes) {
      if(graph.nodes[node].id == id){
        return graph.nodes[node];
      }
    }
  },
    // Retrieve the list of adjacent edges of a list of nodes
    getAdjacentEdges: function (ids) {
      let edges = [];

      graph.edges.forEach(function (edge) {
        if (ids.indexOf(edge.source) !== -1 || ids.indexOf(edge.target) !== -1) {
          edges.push(edge);
        }
      });

      return edges;
    },

    // Returns the whole graph
    getFullGraph: function () {
      return graph;
    }
  };
  /*按照节点id查找节点*/
function searchNode(graph,name) {
    return graph.nodes.filter(function (node) {
        var case_id = node.caseId;

        return case_id && case_id.toLowerCase().indexOf(name.toLowerCase()) === 0;
      })[0] || null;
}

var ogma = new Ogma({
  //graph: graph,
  //graph: g,
  renderer: 'canvas'
  /*container: 'graph-container',
  options: { backgroundColor: null }*/
});
//ogma.setContainer('graph-container');
//ogma.setOptions({backgroundColor: null});

//var ogmaSelect = new Ogma({renderer: 'canvas'});
// Retrieve the fake database defined in `scripts/dummyDatabase.js`

// Retrieve the important elements of the UI
var search_value = window.parent.searchCase_id/*'00000c75-3278-4d31-84b6-f837dbb34ae3'*/,//parent.document.getElementById('search-value').value;//'John Piggyback';
    //document.getElementById('search-bar'),//搜索框
    //boxHideEvaluators = document.getElementById('box-hide-evaluators'),//在左侧filters里面
    //boxHideSmallClaims = document.getElementById('box-hide-small-claims'),
    //boxHideLeaves = document.getElementById('box-hide-leaves'),
    //boxTexts = document.getElementById('box-assign-texts'),
    //boxIcons = document.getElementById('box-assign-icons'),
    //boxColors = document.getElementById('box-assign-colors'),
    //boxClaims = document.getElementById('box-assign-claim-sizes'),
    //boxShowLegend = document.getElementById('box-show-legend'),
    //buttonForceLink = document.getElementById('btn-forceLink'),
    //buttonHierarchical = document.getElementById('btn-hierarchical'),
    //buttonSearch = document.getElementById('btn-search'),
    //buttonExport = document.getElementById('btn-export'),
    //buttonCenter = document.getElementById('btn-center'),
    buttonZoomOut = document.getElementById('btn-zoom-out'),
    buttonZoomIn = document.getElementById('btn-zoom-in'),
    //buttonReset = document.getElementById('btn-reset'),
    //buttonDisplayAll = document.getElementById('btn-display-all');
    circleButton = document.getElementById('circle-button');//生成节点按钮
    linkButton = document.getElementById('link-button')

// Initialize the style rules/filters
var textRule = null,
    iconRule = null,
    colorRule = null,
    sizeRule = null,
    evaluatorFilter = null,
    smallClaimFilter = null,
    leafFilter = null;

// Main function, initializes the visualization
function init() {
  /*创建地图瓦片*/
  var url = 'http://124.127.117.32:8081/googlemaps/cobalt/{z}/{x}/{y}.png';//服务器地址
      /*Ogma.utils.getPixelRatio() > 1 ? // 用于retina屏，一般是给苹果电脑展示
  'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png' :*/
  //'http://wprd03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}';//现在的地图
  //'http://online2.map.bdimg.com/tile/?qt=tile&x={y}&y={x}&z={z}&styles=pl&scaler=1&udt=20171110';
    //'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png';//osm
  //'http://www.google.cn/maps/@39.9641713,116.3417492,12.5z';//谷歌地图
  //'http://wprd03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}';   //高德地图
  //'http://rt1.map.gtimg.com/tile?z={z}&x={x}&y={y}&styleid=1&version=117';  //腾讯地图
  //'http://online1.map.bdimg.com/onlinelabel/qt=tile&x={x}&y={y}&z={z}';   //百度地图
  //'http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}';   //天地图
  //'http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil'; //谷歌地图
  //'http://124.127.117.32:8081/googlemaps/cobalt/{z}/{x}/{y}.png';//服务器谷歌地图地址，会有跨域限制
  //'http://124.127.117.32:8081/arcgis/StreetCold/{z}/{x}/{y}.png';
  //'http://wprd03.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}'*/;
  // Assign the HTML container to Ogma, and set the background color to transparent
  /*设置container*/
  ogma.setContainer('graph-container');
  ogma.setOptions({backgroundColor: null});

  // Bind the buttons/checkboxes to the associated actions
  //boxHideEvaluators.addEventListener('click', applyEvaluatorFilter);
  //boxHideSmallClaims.addEventListener('click', applySmallClaimFilter);
  //boxHideLeaves.addEventListener('click', applyLeafFilter);
  //boxTexts.addEventListener('click', applyTextRule);
  //boxColors.addEventListener('click', applyColorRule);
  //boxIcons.addEventListener('click', applyIconRule);
  //boxClaims.addEventListener('click', applyClaimSizeRule);
  //boxShowLegend.addEventListener('click', toggleLegend);
  //buttonForceLink.addEventListener('click', runForceLink);
  //buttonHierarchical.addEventListener('click', runHierarchical);
  buttonZoomIn.addEventListener('click', zoomIn);
  buttonZoomOut.addEventListener('click', zoomOut);
  //buttonCenter.addEventListener('click', centerView);
  //buttonSearch.addEventListener('click', searchNode);
 // buttonExport.addEventListener('click', exportToPng);
  //buttonReset.addEventListener('click', reset);
  //buttonDisplayAll.addEventListener('click', displayAll);
  circleButton.addEventListener('click', createNode);//生成节点事件
  linkButton.addEventListener('click',createLink);//建立边连接
  // Trigger the search on "Enter" when search bar has focus
  /*document.addEventListener('keydown', function (evt) {
    let code = evt.keyCode || evt.which;
    if (code === 13 && document.activeElement === searchBar) {*/
      searchNode();
    //}
  //});

  // Expand a node when double-clicked
  ogma.events.onDoubleClick(function (evt) {
    if (evt.target && evt.target.isNode && evt.button === 'left') {
      expandNeighbors(evt.target);

      // Clicking on a node adds it to the selection, but we don't want a node to
      // be selected when double-clicked
      evt.target.setSelected(!evt.target.isSelected());
    }
  });
  /*切换地图*/
  function toggleGeo() {
    return ogma.geo.enable({
      'latitudePath':     'latitude',
      'longitudePath':    'longitude',
      'tileUrlTemplate':   url,
      transitionDuration:  300,//转换时长
      //sizeZoomReferential: 15.5
    }); 
  }
  /*切换画布*/
  function toggleGraph() {
    return ogma.geo.disable({ 
      'tileUrlTemplate': url,
      transitionDuration:  300,//转换时长
    })
  .then(function() { console.log('geo mode is off'); });
  }
  /*为切换地图按钮添加click按钮*/
  document.querySelector('#geo-tool').addEventListener('click',function(evt) {
      toggleGeo();
  });
  /*为切换画布按钮添加click按钮*/
  document.querySelector('#graph-tool').addEventListener('click',function(evt) {
      toggleGraph();
  });
  /*为切换树状图按钮添加click按钮*/
  document.querySelector('#tree-tool').addEventListener('click',function(evt) {
      runHierarchical();
  });
  /*为导出画布按钮添加click按钮*/
  document.querySelector('#export-tool').addEventListener('click',function(evt) {
    /*导出json数据*/
      ogma.export.json({
          pretty: true,
          filename: 'my-graph.json'
      }).then(function(jsonString) {
        console.log(jsonString);
      });
      /*导出图片*/
    /*  ogma.exports.jpg({
        download: true,
        filename: 'my-jpg'
        //clip: true // would export the viewport as is
      }).then(function(base64) {
        console.log("success");

      });*/
  });
 /*点击事件*/ 
/*  ogma.events.onClick(function (evt) {
    if (evt.target && evt.target.isNode && evt.button === 'left') {
		var position = evt.target.getPosition();
		var node = evt.target;
		var htmlStr =   
		 
		  '<div class="ogma-tooltip-header"><span class="icon">' + node.getAttribute('icon.content') + '</span> ' + node.getData('type') + '</div>' + '<div class="ogma-tooltip-body">'+'<table>';
		
		var properties = node.getData('properties');
		Object.keys(properties).forEach(function (key) {
		  var value = properties[key];
		  htmlStr+='<tr><th>' + key + '</th><td>' + value + '</td></tr>'
		});
		htmlStr+='</table></div><div class="ogma-tooltip-footer">Number of connections: ' + node.getData('nbNeighbors') + '</div>';
		var UI = document.getElementById("ui");
		UI.innerHTML=htmlStr;
		// var neighbors = DB.getNeighbors(node.getId());
		  // var htmlStr="<form>";
		  // for(var nei in neighbors.nodes){
			  // htmlStr += '<label>'+neighbors.nodes[nei].data.properties.name+'</label> <br/>'
			//console.log(neighbors.nodes[nei].id+":"+neighbors.nodes[nei].data.properties.name);
		  // }
		  // htmlStr+='</form>'
		// var html = [
			// htmlStr
		// ];
		// UI.innerHTML=htmlStr;

		
		//其余的点删除
		// for(var node in flaoatNeighborsIds) {
			// if(evt.target.getId() === flaoatNeighborsIds[node]){
				
				// continue;
			// }else{
				// ogma.removeNode(flaoatNeighborsIds[node]);
			// }
		// }
		
		//找到点击得点
		// for(var node in flaoatNeighborsIds) {
			// if(evt.target.getId() === flaoatNeighborsIds[node]){
				// var node = ogma.getNode(evt.target.getId());
				// var nodeData = node.getData();
				// nodeData.isFloat=true;
				// node.setData(nodeData);
				// return runLayout('forceLink');
			// }
		// }
		
      //expandNe2(evt.target);
      evt.target.setSelected(!evt.target.isSelected());
    }
  });*/
  /*点击事件*/
  ogma.events.onClick(function (evt) {
    var target = evt.target,
        button = evt.button,
        x = evt.x,
        y = evt.y;
        /*右键点击背景区域*/
        if (!target && button === 'right') {//右键在背景区域

            /*var node_list = ogma.getNodes();
            console.log("长度"+node_list.size)
            console.log("右键点击了背景区域")*/
            var node_list = ogma.getNodes(),
            edge_list = ogma.getEdges();
        }else if (target && target.isNode && button === 'right') {//右键点击在节点上
            current_node = target;
        }else if (target && target.isNode && button === 'left') {//左键点击在节点上
            var position = target.getPosition();
            var node = target;
            console.log(node.getDegree());
            current_node = target;
            var htmlStr ='<div class="ogma-tooltip-header"><span class="icon">' + node.getAttribute('icon.content') + '</span> ' + node.getData('properties').title + '</div>' + '<div class="ogma-tooltip-body">';   
            //console.log(node.getAttribute('icon.content'));
            var properties = node.getData('properties');
            Object.keys(properties).forEach(function (key) {
                var value = properties[key];
                  if (key === "brief") {
                    htmlStr+='<label title="'+ value +'">案件摘要：' + value + '</label><br>';
                  }
                  else if (key === "caseId") {
                    htmlStr+='<label title="'+ value +'">案件编号：' + value + '</label><br>';
                  }
                  else if (key === "date") {
                    htmlStr+='<label title="'+ value +'">作案时间：' + value + '</label><br>';
                  }
                  else if (key === "identity") {
                    htmlStr+='<label title="'+ value +'">事主身份：' + value + '</label><br>';
                  }
                  else if (key === "police") {
                    htmlStr+='<label title="'+ value +'">出警单位派出所：' + value + '</label>';
                  }
                  else {
                  }
            });
            htmlStr+='</div><div class="ogma-tooltip-footer">相关联案情： ' + node.getData('nbNeighbors') + '</div>';
            var UI = document.getElementById("ui");
            UI.innerHTML=htmlStr;
            evt.target.setSelected(!evt.target.isSelected());
       } 
       else if (target && button === 'left') {
           //console.log(evt);
       }
  });

  var flaoatNeighborsIds=[];
  function expandNe2(node) {
  // Retrieve the neighbors from the DB
   var neighbors = DB.getNeighbors(node.getId()),
      ids = neighbors.nodeIds,
      nodes = neighbors.nodes;
	  flaoatNeighborsIds = ids;
  node.nbNeighbors = 0;
  // If this condition is false, it means that all the retrieved nodes are already in Ogma.
  if (ogma.getNodes(ids).size < ids.length) {
    // Set the position of the neighbors around the nodes, in preparation to the force-directed layout
    var position = node.getPosition(),
        angleStep = 2 * Math.PI / (neighbors.nodes.length*4),
        angle = 0;//Math.random() * angleStep;
	
    for (var i = 0; i < nodes.length; ++i) {
      var neighbor = nodes[i];
      nodes[i].attributes = {
        x: position.x + Math.cos(angle) * 0.001,
        y: position.y + Math.sin(angle) * 0.001
      };

      angle += angleStep;
    }

    // Add the neighbors to the visualization, add their adjacent edges and run a layout
    ogma.addNodes(nodes).then(function () {
      return ogma.addEdges(selectAdjacentEdgesToAdd(ids));
    }).then(function () {
      return runLayout('forceLink');
    });
  }
}
  // Styling rules that will be applied globally
  /*为节点添加样式*/
  ogma.styles.addNodeRule({
	halo: {
        color: ogma.rules.map({
          field: 'isFloat',
          values: {
            false: '#ff3a3a',
            true: '#ffffff',
          }
        }),
		size: 15
      },
    text: {
      size: 14
    },
    icon: {
      font: 'FontAwesome'
    },
    radius: 2,
    badges: {
      bottomRight: {
        color: '#36cfc9',//inherit右下角数字圆圈样式
        stroke: {
           color:'#ffffff'
         },
        text: {
          scale: 1.6,
          color:'#ffffff',
          content: function (node) {
            // The bottom right badge displays the number of hidden neighbors
            // The `nbNeighbors` data property contains the total number of neighbors for the node in the DB
            // The `getDegree` method retrieves the number of neighbors displayed in the viz
            return (node.getData('nbNeighbors')) || null;// - node.getDegree()
          }
        }
      }
    }
  });
  //console.log(ogma.getContainer());
  ogma.styles.addEdgeRule({
    shape: 'arrow',
    width: 0.5,
	color: ogma.rules.map({
        field: 'floatEdge',
        values: {
          0: 'black',
          1: 'blue',
        },
        fallback: ['#00348c']
      })
  });

  // Show the type of the edges on hover
  ogma.styles.setHoveredEdgeAttributes({
    text: function (node) {
      return node.getData('type');
    }
  });

  // Display the data of nodes as a tooltip on hover
  ogma.tools.tooltip.onNodeClick(function (node) {
	  var neighbors = DB.getNeighbors(node.getId());
	  var htmlStr="<form style='padding:0px 10px;'><label style='font-size: 12px;margin-left: 10px;margin-top: 10px;color: #393939;'>相邻节点:</label> <br/>";
    if (neighbors === null) {
        //htmlStr += '<label>当前节点最终子节点</label>';
        console.log("子节点为空")
    }
    /*获取当前节点中已展开的节点*/
    var adjacentNodes  = node.getAdjacentNodes().getId();
    var hasNode = 0;
    console.log(neighbors.nodes);
    for(var nei in neighbors.nodes) {
        for(var i in adjacentNodes) {
            if (adjacentNodes[i] === neighbors.nodes[nei].id) {
                hasNode = 1;
            }
        }
        if(hasNode === 1) {
            htmlStr += '<div class="checkbox" style="margin-top:0px;margin-bottom:0px;"><label/* style="margin-left: 10px;margin-top:5px;color: #393939;"*/><a title="该节点已展开" style="text-decoration: none;"><input name="Node" disabled="disabled" type="checkbox" checked="checked" /*style="width: 15px;height: 15px;border-radius: 1px;border: solid 1px #e6e5e5;font-size:15px;"*/ value='+neighbors.nodes[nei].id+' />'+neighbors.nodes[nei].name+'</label></a></div>'
            //console.log(neighbors.nodes[nei].id+":"+neighbors.nodes[nei].data.properties.name);
            hasNode = 0;
        }
        else {
            htmlStr += '<div class="checkbox" style="margin-top:0px;margin-bottom:0px;"><label/* style="margin-left: 10px;margin-top:5px;color: #393939;"*/><input name="Node" type="checkbox" /*style="width: 15px;height: 15px;border-radius: 1px;border: solid 1px #e6e5e5;font-size:15px;"*/ value='+neighbors.nodes[nei].id+' />'+neighbors.nodes[nei].name+'</label></div>'
            //console.log(neighbors.nodes[nei].id+":"+neighbors.nodes[nei].data.properties.name);
        }
    }
    htmlStr+='<input type="button" class="btn check" style="width:26%;" value="全选" onclick = "checkAll();" />'
    htmlStr+='<input type="button" class="btn check" style="width:26%;" value="重置" onclick = "checkNone();" />'
    htmlStr+='<input type="button" class="btn check" style="width:26%;" value="展开" onclick = "expandChooseNode();" />'
	  htmlStr += '</form>';
    var html = [
		htmlStr
    ];
    return html.join('');
  },{className: 'ogma-tooltip'});

  // Display the option to node on rightClick
  ogma.tools.tooltip.onNodeRightClick(function (node) {
    /*var neighbors = DB.getNeighbors(node.getId());*/
    // console.log(JSON.stringify(neighbors));
    // console.log(neighbors.nodes[0].id+":"+neighbors.nodes[0].data.properties.name);
    //var htmlStr="<form><label>setting</label> <br/>";
    var htmlStr="<div class='ogma-tooltip bottom'>";
    htmlStr+="<div class='ogma-tooltip-header'><span class='icon'>" + node.getAttribute('icon.content') +"</span>"+node.getData('properties').title+"</div>";
    htmlStr+="<div class='ogma-tooltip-body'>";

    var properties = node.getData('properties');
    if(properties.length !== 0) {
        Object.keys(properties).forEach(function (key) {
        var value = properties[key];
        if (key === "brief") {
          htmlStr+='<label title="'+ value +'">案件摘要：' + value + '</label><br>';
        }
        else if (key === "caseId") {
          htmlStr+='<label title="'+ value +'">案件编号：' + value + '</label><br>';
        }
        else if (key === "date") {
          htmlStr+='<label title="'+ value +'">作案时间：' + value + '</label><br>';
        }
        else if (key === "identity") {
          htmlStr+='<label title="'+ value +'">事主身份：' + value + '</label><br>';
        }
        else if (key === "police") {
          htmlStr+='<label title="'+ value +'">出警单位派出所：' + value + '</label>';
        }
        else {
        }
      });
    }
    htmlStr+="</div>";
    htmlStr+="<div class='ogma-tooltip-footer' style='padding:0px;width:100%;height:38px;;'>";
    htmlStr+="<ul style='width:100%;height:100%;list-style:none;padding:0px;margin:0px;'>";
    htmlStr+="<li style='padding:0px;width:33.3%;height:100%;float:left;'><input type='button' class='btn btn-lk' style='height:100%;width:100%;font-size:15px;' value='hide' onclick = 'hide(current_node);'/></li>"
    htmlStr+="<li style='padding:0px;width:33.3%;height:100%;float:left;'><input type='button' class='btn btn-lk' style='height:100%;width:100%;font-size:15px;' value='collapse' onclick = 'collapse(current_node);' /></li>"
    htmlStr+="<li style='padding:0px;width:33.3%;height:100%;float:left;position:relative;'><a class='dropdown-toggle btn btn-lk' style='height:100%;width:100%;text-decoration:none;font-size:15px;' data-toggle='dropdown' href='#'>...<span class='caret'></span></a><ul class='dropdown-menu'><li><a href='#' style='text-decoration:none;'>Pin</a></li><li><a href='#' style='text-decoration:none;' data-toggle='modal' data-target='#myModal' onclick='editFunc(current_node)'>Edit</a></li><li><a href='#' style='text-decoration:none;'>Delete</a></li></ul></li></ul></div>"
    htmlStr+=""
    var html = [
    htmlStr
    ];
    return html.join('');
  }, {position:'right'});
/*点击边事件*/
ogma.tools.tooltip.onEdgeClick(function(edge){
    var source = edge.getSource();
    var target = edge.getTarget();
    var sourceMsg = document.getElementById("nodeMsg");
    var targetMsg = document.getElementById("targetMsg");
    var edgeMsg = document.getElementById("edgeMsg");
    displayNodeMsg(source,sourceMsg,"source");
    displayEdgeMsg(edge,edgeMsg);
    displayNodeMsg(target,targetMsg,"target");
    var htmlStr="";
    var html = [
    htmlStr
    ];
    return html.join('');
},{className:'ogma-tooltip'});

/*显示节点信息*/
function displayNodeMsg(evt,form,flag){
    var properties = evt.getData('properties');
            var htmlMsg = '';
            htmlMsg+='<table class="table"><thead><tr class="active"><th>'+flag+'</th><th></th></tr></thead><tbody id="nodeContent">';
            htmlMsg+='<tr class="info"><td><input type="text" value="id" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+evt.getId()+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            htmlMsg+='<tr class="success"><td><input type="text" value="type" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+evt.getData("type")+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            Object.keys(properties).forEach(function (key) {
                var value = properties[key];
                htmlMsg+='<tr class="warning"><td><input type="text" value="'+key+'" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+value+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            });
            htmlMsg+='<tr class="danger"><td><input type="text" value="nbNeighbors" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+evt.getData("nbNeighbors")+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            htmlMsg+='</tbody></table><div style="width: 100%;height: 35px; position: relative;"><input type="button" value="save" class="btn btn-primary saveBtn" style="position: absolute; right: 0px" onclick="save_Msg()"></div>';
    form.innerHTML=htmlMsg; 
}
/*显示边信息*/
function displayEdgeMsg(evt,form){
    var properties = evt.getData('properties');
            var htmlMsg = '';
            htmlMsg+='<table class="table" style="margin:0px;"><thead><tr class="active"><th style="border-right: 3px solid #666;">edge</th><th></th></tr></thead><tbody id="nodeContent">';
            htmlMsg+='<tr class="info"><td style="border-right: 3px solid #666;"><input type="text" value="id" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+evt.getId()+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            htmlMsg+='<tr class="success"><td style="border-right: 3px solid #666;"><input type="text" value="type" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+evt.getData("type")+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            Object.keys(properties).forEach(function (key) {
                var value = properties[key];
                htmlMsg+='<tr class="warning"><td style="border-right: 3px solid #666;"><input type="text" value="'+key+'" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+value+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            });
            //htmlMsg+='<tr class="danger"><td style="border-right: 3px solid #666;"><input type="text" value="nbNeighbors" disabled="disabled" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td><td><input type="text" value="'+evt.getData("nbNeighbors")+'" style="width: 100%;height: 100%;border: none;background-color: inherit;"></td></tr>';
            htmlMsg+='</tbody></table><div style="width: 100%;height: 35px; position: relative;"><label class="glyphicon glyphicon-triangle-bottom" style="position:absolute;top:-5px;left:108px;"></label><input type="button" value="save" class="btn btn-primary saveBtn" style="position: absolute; right: 0px" onclick="save_Msg()"></div>';
    form.innerHTML=htmlMsg; 
}
/*节点的鼠标悬停效果*/
  ogma.tools.tooltip.onNodeHover(function (node) {
    var html = [
      //'<div style="width:0;height:0;border-radius:100px,0,0,0;border-width:100px ;border-style:solid ;border-color:yellow;"></div>'
      '<div class="ogma-tooltip-header"><span class="icon" style="padding:0px;margin:0px;">' + node.getAttribute('icon.content') + '</span> ' + node.getData('properties').title + '</div>',
      '<div class="ogma-tooltip-body">',
    ];

    var properties = node.getData('properties');

    Object.keys(properties).forEach(function (key) {
      var value = properties[key];
      if (key === "brief") {
        html.push('<label>案件摘要：' + value + '</label><br>')
      }
      else if (key === "caseId") {
        html.push('<label>案件编号：' + value + '</label><br>')
      }
      else if (key === "date") {
        html.push('<label>作案时间：' + value + '</label><br>')
      }
      else if (key === "identity") {
        html.push('<label>事主身份：' + value + '</label><br>')
      }
      else if (key === "police") {
        html.push('<label>出警单位派出所：' + value + '</label>')
      }
      else {
      }
    });

    html.push('</div><div class="ogma-tooltip-footer">相关联案情: ' + node.getData('nbNeighbors') + '条</div>');

    return html.join('');
  }, {className: 'ogma-tooltip'});
  
  // ogma.tools.tooltip.onNodeClick(function (node) {
    // var html = [
      // '<div style="width:10px height:10px border-radius:150px border-width:150px border-style:solid border-color:yellow transparent transparent transparent line-height:99em overflow:hidden cursor:pointer margin: 30px auto"> </div>'
     
    // ];

    // console.log(233);
    // return html.join('');
  // }, {className: 'ogma-tooltip'});


  /*// Set the focus on the search bar
  searchBar.focus();*/

  // Set the default value for the search bar
  /*searchBar.value = 'John Piggyback';

  // Set the cursor at the end of the search bar
  searchBar.setSelectionRange(searchBar.value.length, searchBar.value.length);*/

  /*boxTexts.checked = true;
  boxColors.checked = true;
  boxIcons.checked = true;*/

  // Apply the text, color and icon rules
  applyTextRule();
  applyColorRule();
  applyIconRule();
}
var duration = 500;
//判断是不是叶子节点
function isLeaf(n) { return n.getDegree() === 1; }
//判断是不是根节点
function isRoot(n) { return n.getDegree() > 3;   }
//collapses node leafs收起叶子节点
function collapseNode(node, duration) {
	var leafs = node.getAdjacentNodes().filter(isLeaf);
	var nodesToGroup = leafs.concat(node);
	var pos = node.getPosition();
	leafs.forEach(function(node,index){
		//console.log(node.getId()+" "+index);
	    ogma.removeNodes(node.getId());
		  
	});
	  //console.log(leafs);
	  //console.log(nodesToGroup);
	
	duration = duration || 0;
}
//隐藏节点
function hide(obj){
  ogma.removeNode(obj);
}
//收起节点
function collapse(obj){
	collapseNode(obj,duration);
}
//保存关联图
function saveGraph(){
  var node_list = ogma.getNodes("all"),
      edge_list = ogma.getEdges("all");
      console.log("###");
      edge_list.forEach(function(edge){
        console.log(edge.getId());
        console.log(edge.getSource());
        console.log(edge.getTarget());
      })
  var nodelistJSON = nodeListToJSON(node_list),
      edgeListJSON = edgeListToJSON(edge_list);
  var strNodes = JSON.stringify(nodelistJSON),
      strEdges = JSON.stringify(edgeListJSON);
  localStorage.setItem("nodes",strNodes);  
  localStorage.setItem("edges",strEdges);
}
/*nodeList转化成json格式*/
function nodeListToJSON(list) {
    var arr = list.toArray();
    var listStr = '';
    var length = arr.length;
    if (!length) {
        return null;
    }
    else if (length === 1) {
       listStr = '[' + JSON.stringify(nodeToJSON(arr[0])) + ']'; 
    }
    else {
       listStr = '[' + JSON.stringify(nodeToJSON(arr[0]));
       for(var item = 1;item < length;item++) {
           listStr += ',';
           listStr = listStr + JSON.stringify(nodeToJSON(arr[item]));
       }
       listStr = listStr + ']';
    }
    return JSON.parse(listStr);
}
/*node转换成json格式*/
function nodeToJSON(node) {
    var nodeStr = '';
    var id = node.getId();
    var neighbors = DB.getNeighbors(id),//储存数据库中给节点定义的邻居节点
        nodeids = neighbors.nodeIds,
        edgeids = neighbors.edgeIds,
        nodes = neighbors.nodes; 
    var cur_neighborNodes = node.getAdjacentNodes(),//获取所在节点当前的邻居节点
        cur_neighborNodesIds = cur_neighborNodes.getId();
    var cur_neighborEdges = node.getAdjacentEdges(),//获取所在节点当前的邻居边
        cur_neighborEdgesIds = cur_neighborEdges.getId();
    nodeStr = '{' + '"id":' + node.getId() + ',' + '"data":' + JSON.stringify(node.getData()) + ',' + '"neighbors":{' + '"edges":[' + edgeids + '],' + '"nodes":[' + nodeids + ']}' +',' + '"curNeighbors":{' + '"curEdges":[' + cur_neighborEdgesIds + '],' + '"curNodes":[' + cur_neighborNodesIds + ']}' + ',' + '"attributes":' + JSON.stringify(node.getAttributes()) + '}';
    return JSON.parse(nodeStr);
}
/*edge转换成json格式*/
function edgeToJSON(edge) {
    var edgeStr = '';
    var id = edge.getId();
    console.log("%%%%%");
    console.log(edge.getId());
    console.log(edge.getSource());
    console.log(edge.getTarget());
    edgeStr = '{' + '"id":' + edge.getId() + ',' + '"source":' + JSON.stringify(edge.getSource()._index-1) + ',' + '"target":' + JSON.stringify(edge.getTarget()._index-1) + ',' + '"data":' + JSON.stringify(edge.getData()) + ',' + '"attributes":' + JSON.stringify(edge.getAttributes()) + '}';
    return JSON.parse(edgeStr);
}
/*edgeList转换成json格式*/
function edgeListToJSON(list) {
    var arr = list.toArray();
    var listStr = '';
    var length = arr.length;
    if (!length) {
        return null;
    }
    else if (length === 1) {
       listStr = '[' + JSON.stringify(edgeToJSON(arr[0])) + ']'; 
    }
    else {
       listStr = '[' + JSON.stringify(edgeToJSON(arr[0]));
       for(var item = 1;item < length;item++) {
           listStr += ',';
           listStr = listStr + JSON.stringify(edgeToJSON(arr[item]));
       }
       listStr = listStr + ']';
    }
    return JSON.parse(listStr);
}
/*向ogma中添加一个节点*/
function addNodeToGraph(node,nodes,edges) {
    if (node) {
    var addedNode = ogma.addNode(node);
    var curNeighbors = getCurNeighborNodes(node,nodes),
        curNodes = curNeighbors.curNodes,
        curEdges = curNeighbors.curEdges,
        curNeighborsNodes = curNeighbors.curNeighborsNodes;
        var curNode = ogma.getNode(node.id);
      if (ogma.getNodes().size === 1) {
      
    } else {
      // If there are more than one node, apply the forceLink layout (force-directed)
      ogma.addEdges(selectAdjacentEdgesToAdd([node.id]));/*.then(function () {
        runLayout('forceLink');
      });*/
    }
    return addedNode;
  } else {
    return null;
  }
}
/*向选定节点添加相邻边*/
function addSelectAdjacentEdges(nodeIds) {
    return DB.getAdjacentEdges(nodeIds).filter(function (edge) {
    return ogma.getNode(edge.source) && ogma.getNode(edge.target);
  });
}
/*获取当前节点的相邻边，并过滤掉已存在的边*/
function addGetAdjacentEdges(ids) {
    let edges = [];
      for(var item in public_edges) {
        var edge = public_edges[item];
        if (ids.indexOf(edge.source) !== -1 || ids.indexOf(edge.target) !== -1) {
          console.log("success")
          edges.push(edge);
        }
      }
      console.log("edge")
      console.log(edges);
      return edges;
}
/*获取当前节点的当前邻居节点*/
function getCurNeighborNodes(node,nodes) {
    var curNeighbors = node.curNeighbors;     
    return {
      curNodes: curNeighbors.curNodes,
      curEdges: curNeighbors.curEdges,
      curNeighborsNodes: curNeighbors.curNodes.map(function(nid) {return nodes[nid]}),
    }
}
//多选框全选
function checkAll(){
	$('input[name="Node"]').each(function(i) {   
		this.checked=true;
    });
}
//多选框全不选
function checkNone(){
	$('input[name="Node"]').each(function(i) {
    if(this.disabled) {
        this.checked=true;
    }
    else{
        this.checked=false;
    }
	});
}
//创建节点
function creatProperties(msg,key,value) {
  var groupDiv = document.createElement("div");
      groupDiv.className="form-group";
      var rowDiv = document.createElement("div");
      rowDiv.className="row";
      rowDiv.style.height="auto";
      var col3 = document.createElement("div");
      col3.className="col-xs-3";
      var inputProp = document.createElement("input");
      inputProp.className="form-control";
      inputProp.setAttribute("disabled","disabled");
      inputProp.setAttribute("value",""+key);
      col3.appendChild(inputProp);
      rowDiv.appendChild(col3);
      var col7 = document.createElement("div");
      col7.className="col-xs-7";
      var inputValue = document.createElement("input");
      inputValue.className="form-control";
      inputValue.setAttribute("value",""+value);
      col7.appendChild(inputValue);
      rowDiv.appendChild(col7);
      var col2 = document.createElement("div");
      col2.className="col-xs-2";
      var btn = document.createElement("button");
      btn.onclick = function(){
        var delNode = this.parentNode.parentNode.parentNode;
        var msgNode = delNode.parentNode;
        msgNode.removeChild(delNode);
      }
      btn.className="btn btn-danger btn-block";
      btn.setAttribute("type","button");
      btn.innerHTML="<i class='glyphicon glyphicon-trash'></i>Delete";
      col2.appendChild(btn);
      rowDiv.appendChild(col2);
      groupDiv.appendChild(rowDiv);
      msg.appendChild(groupDiv);
}
//编辑节点
function editFunc(node){
  var msg = document.getElementById("propertiesId");
   var properties = node.getData('properties');
      var childs = msg.childNodes;
      while(msg.hasChildNodes()) //当div下还存在子节点时 循环继续
      {
        msg.removeChild(msg.firstChild);
      }
      Object.keys(properties).forEach(function (key) {
        var value = properties[key];
        creatProperties(msg,key,value);
    });
}
//添加属性信息
function addProp(){
  var v1 = document.getElementById("first-input").value;
  var f_input = document.getElementById("first-input");
  var v2 = document.getElementById("second-input").value;
  var s_input = document.getElementById("second-input");
  var msg = document.getElementById("propertiesId");
  var addBtn = document.getElementById("add");
  creatProperties(msg,v1,v2);
  if(!addBtn.disabled){
    addBtn.disabled=true;
    f_input.value="";
    s_input.value="";
    f_input.setAttribute("placeholder","New property name");
    s_input.setAttribute("placeholder","New property value");
  }
}
//检查输入框是否有信息
function checkMsg(){
  var v1 = document.getElementById("first-input").value;
  var v2 = document.getElementById("second-input").value;
  var btn = document.getElementById("add");
  if(v1!=""&&v2!=""){
      btn.removeAttribute("disabled");
  }
  else{
      btn.setAttribute("disabled","disabled");
  }
}
//save成功
function finish_save(){
  var childs = document.getElementById('propertiesId').childNodes;
  Object.keys(childs).forEach(function (index) {
      var prop_key = childs[index].childNodes[0].childNodes[0].childNodes[0].value;
      var prop_value = childs[index].childNodes[0].childNodes[1].childNodes[0].value;
      current_node.setData(['properties', prop_key], prop_value);
  });
  setTimeout(function() {
        $.bootstrapGrowl("Already updated.", {
          ele:document.getElementById('graph-container'), 
          type: 'success',
          offset:'top',
          align:'center',
          width:'auto'
           });
  }, 500);
}
/*左侧选中信息保存*/
function save_Msg() {
  var childs = document.getElementById('nodeContent').childNodes;
  Object.keys(childs).forEach(function (index) {
      var key = childs[index].childNodes[0].childNodes[0].value;
      var value = childs[index].childNodes[1].childNodes[0].value;
      console.log(key+","+value);
      if (key === "id") {
        var nodeId = value;
      }
      else if(key === "type") {
        current_node.setData('type', value);
      }
      else {
        current_node.setData(['properties', key], value);
      }
  });
  setTimeout(function() {
        $.bootstrapGrowl("Already updated.", {
          ele:document.getElementById('graph-container'), 
          type: 'success',
          offset:'top',
          align:'center',
          width:'auto'
           });
  }, 500);
}
// Add the given node to the visualization and returns the added node if it exist
function addNodeToViz(name) {
  // Look for the node in the DB
  let node = DB.search(name);
  if (node) {
    var addedNode = ogma.addNode(node);

    if (ogma.getNodes().size === 1) {
      // If this is the first node in the visualization, we simply center the camera on it
      ogma.view.locateGraph();
      //console.log(node.toJSON());
    } else {
      // If there are more than one node, apply the forceLink layout (force-directed)
      ogma.addEdges(selectAdjacentEdgesToAdd([node.id])).then(function () {
        runLayout('forceLink');
      });
    }

    return addedNode;
  } else {
    return null;
  }
}

// Retrieve the list of adjacent edges to the specified nodes, for which both the
// source and target are already loaded in Ogma (in the viz)
function selectAdjacentEdgesToAdd(nodeIds) {
  return DB.getAdjacentEdges(nodeIds).filter(function (edge) {
    return ogma.getNode(edge.source) && ogma.getNode(edge.target);
  });
}
//展开选择的节点
function expandChooseNode(){
	var chooseNodes=[];
	var chooseNodeIds=[];
	$('input[name="Node"]:checked').each(function(i){   
		var node = DB.getNodeById($(this).val());
        chooseNodeIds.push(parseInt($(this).val()));
		chooseNodes.push(node);
      });
	//console.log(chooseNodeIds);
	ogma.addNodes(chooseNodes).then(function () {
      return ogma.addEdges(selectAdjacentEdgesToAdd(chooseNodeIds));
    }).then(function () {
      return runLayout('forceLink');
    });
}
/*根据id获取node节点数据*/
function getNodeById(id) {
  for(var i = 0;i<graph.nodes.length;i++) {
        if(graph.nodes[i].id === id) {
            return graph.nodes[i];
        }
  } 
}
// Expand the specified node by retrieving its neighbors from the database
// and adding them to the visualization
function expandNeighbors(node) {
  // Retrieve the neighbors from the DB
  var n = getNodeById(node.getId());
  var neighbors = n.neighbors;
  var nodeIds = neighbors.nodes,
      edgeIds = neighbors.edges,
      nodes = neighbors.nodes.map(function (nid) { 
          for(var i = 0;i<graph.nodes.length;i++) {
            if(graph.nodes[i].id === nid) {
                return graph.nodes[i];
            }
          } 
      });
/*    ids = neighbors.nodeIds,//邻居节点id
      nodes = neighbors.nodes;//邻居节点
      edges = neighbors.edges;//邻居边*/
  // If this condition is false, it means that all the retrieved nodes are already in Ogma.
  // In this case we do nothing
  if (ogma.getNodes(nodeIds).size < nodeIds.length) {
    // Set the position of the neighbors around the nodes, in preparation to the force-directed layout
    var position = node.getPosition(),
        angleStep = 2 * Math.PI / neighbors.nodes.length,
        angle = Math.random() * angleStep;

    for (var i = 0; i < nodes.length; ++i) {
      var neighbor = nodes[i];
      neighbor.attributes = {
        x: position.x + Math.cos(angle) * 0.001,
        y: position.y + Math.sin(angle) * 0.001
      };

      angle += angleStep;
    }

    // Add the neighbors to the visualization, add their adjacent edges and run a layout
    ogma.addNodes(nodes).then(function () {
      return ogma.addEdges(selectAdjacentEdgesToAdd(nodeIds));
    }).then(function () {
      return runLayout('forceLink');
    });
  }
}

/* ============================== */
/* Function triggered by the menu */
/* ============================== */

function applyEvaluatorFilter() {
  if (boxHideEvaluators.checked && !evaluatorFilter) {
    evaluatorFilter = ogma.addNodeFilter(function (node) {
      return node.getData('type') !== 'Evaluator';
    });
  } else if (!boxHideEvaluators.checked && evaluatorFilter) {
    evaluatorFilter.delete();
    evaluatorFilter = null;
  }
}

function applySmallClaimFilter() {
  if (boxHideSmallClaims.checked && !smallClaimFilter) {
    smallClaimFilter = ogma.addNodeFilter(function (node) {
      return node.getData('type') !== 'Claim' || node.getData('properties.amount') >= 50000;
    });
  } else if (!boxHideSmallClaims.checked && smallClaimFilter) {
    smallClaimFilter.delete();
    smallClaimFilter = null;
  }
}

function applyLeafFilter() {
  if (boxHideLeaves.checked && !leafFilter) {
    leafFilter = ogma.addNodeFilter(function (node) {
      return node.getAdjacentNodes().size > 1;
    });
  } else if (!boxHideLeaves.checked && leafFilter) {
    leafFilter.delete();
    leafFilter = null;
  }
}
/*boxTexts.checked &&  if和else if里面有改动*/
function applyTextRule() {
  if (!textRule) {
    textRule = ogma.styles.addNodeRule({
      text: {
        content: function (node) {
          let type = node.getData('type');
          /*type类型*/
          if (type === 1 || type === 2 || type === 3 || type === 0 || type === 4) {
            //return node.getData('properties.name');
            for(var i = 0;i<graph.nodes.length;i++){
              if (node.getId() === graph.nodes[i].id) {
                return graph.nodes[i].name;
              }
            }
          } else if (type === 'Phone' || type === 'MailAddress' || type === 'SSN') {
            return node.getData('properties.name');
          } else if (type === 'Address') {
            return node.getData('properties.city') + ', ' + node.getData('properties.state');
          } else if (type === 'Claim') {
            return node.getData('properties.name') + ' (' + node.getData('properties.amount') + '$)';
          }
        },
        backgroundColor:'#ffffff'
      }
    })
  } else if (textRule) {
    textRule.delete();
    textRule = null;
  }
}
/*boxColors.checked && 有改动*/
function applyColorRule() {
  if (!colorRule) {
    colorRule = ogma.styles.addNodeRule({
      color: ogma.rules.map({
        field: 'type',
        values: {
          0:'#00348c',
          1:'#00348c',//type的值 第一类型的颜色样式
          2:'#0b6bd5',
          3:'#52c24c',
          4:'#2da1ba',
          Claim: '#E8AB15',
          Address: '#D0FF24',
          SSN: '#0FE85C',
          Phone: '#0EB1FF',
          MailAddress: '#FF1271',
          Lawyer: '#AE15FF',
          Evaluator: '#1067FF',
        },
        fallback: ['#00348c']
      })
    });
  } else if (colorRule) {
    colorRule.delete();
    colorRule = null;
  }
}
/*设置节点的图标样式 有改动boxIcons.checked && */
function applyIconRule() {
  if (!iconRule) {
    iconRule = ogma.styles.addNodeRule({
      icon: {
        content: ogma.rules.map({
          field: 'type',//表示json数据里面的某组键值对的key名
          values: {
            0:'\uf007',
            1:'\uf007',
            Claim: '\uf155',
            Address: '\uf015',
            SSN: '\uf2c3',
            Phone: '\uf095',
            MailAddress: '\uf1fa',
            Lawyer: '\uf0e3',
            Evaluator: '\uf2c0' ,
            2:'\uf0d6',
            3:'\uf239',
            4:'\uf21d'
          },
          fallback: ['\uf007']//未匹配到的节点样式
        }),
        color:'#ffffff'
      }
    });
  } else if (iconRule) {
    iconRule.delete();
    iconRule = null;
  }
}

function applyClaimSizeRule() {
  if (boxClaims.checked && !sizeRule) {
    sizeRule = ogma.styles.addNodeRule(function (node) {
      return node.getData('type') === 'Claim';
    }, {
      radius: ogma.rules.slices({
        field: 'properties.amount',
        values: {min: 3, max: 7},
        stops: {min: 48000, max: 52000}
      })
    });
  } else if (!boxClaims.checked && sizeRule) {
    sizeRule.delete();
    sizeRule = null;
  }
}

function toggleLegend() {
  if (boxShowLegend.checked) {
    ogma.tools.legend.enable({
      titleFunction: function (propertyPath) {
        let propName = propertyPath[propertyPath.length - 1];

        if (propName === 'amount') {
          return 'Claim amount';
        } else {
          return propName.charAt(0).toUpperCase() + propName.substring(1);
        }
      }
    });
  } else {
    ogma.tools.legend.disable();
  }
}

// Utility function to run a layout
function runLayout(name) {
  return ogma.layouts[name]({
    locate: LOCATE_OPTIONS,
    duration: LAYOUT_DURATION
  });
}

function runForceLink() {
  runLayout('forceLink');
}

function runHierarchical() {
  runLayout('hierarchical');
}

function displayAll() {
  // Retrieve the whole graph from the database
  //var graph = DB.getFullGraph();
  var graph = graph;
  // If there is the same amount of nodes in Ogma as in the DB, nothing to do
  if (ogma.getNodes('all').size !== graph.nodes.length) {

    // Assign a random position to all nodes, in preparation for the layout
    for (let i = 0; i < graph.nodes.length; ++i) {
      graph.nodes[i].attributes = {
        x: Math.random(),
        y: Math.random()
      }
    }
    ogma.setGraph(graph).then(function () {
      return ogma.view.locateGraph();
    }).then(function () {
      runForceLink();
    });
  }
}

function reset() {
  ogma.clearGraph();
  boxHideEvaluators.checked = false;
  boxHideSmallClaims.checked = false;
  boxHideLeaves.checked = false;
  boxTexts.checked = true;
  boxColors.checked = true;
  boxIcons.checked = true;
  boxClaims.checked = false;
  boxShowLegend.checked = false;

  applyTextRule();
  applyLeafFilter();
  applySmallClaimFilter();
  applyEvaluatorFilter();
  applyClaimSizeRule();
  applyColorRule();
  applyIconRule();
  toggleLegend();
}

/* ================================================== */
/* Function triggered by buttons in the visualization */
/* ================================================== */

function zoomIn() {
  ogma.view.zoomIn({
    duration: 150,
    easing: 'quadraticOut'
  });
}

function zoomOut(){
  ogma.view.zoomOut({
    duration: 150,
    easing: 'quadraticOut'
  });
}

function searchNode() {
  if (search_value) {
    if (addNodeToViz(search_value)) {
      //searchBar.value = '';
    } else {
      alert('No node has the property "case_id" equal to "' + search_value + '".');
    }
  }
}

function centerView() {
  return ogma.view.locateGraph(LOCATE_OPTIONS);
}

function exportToPng() {
  ogma.export.png({background: '#F0F0F0', filename: 'Linkurious_Ogma_Library_Example'});
}
/*生成节点事件*/
function createNode() {
  node_max_id++;
  var next_id = node_max_id;
  var node = {"attributes":{"x":20,"y":90},"caseId":"","category":1,"data":{"latitude": 40.0047, "longitude": 116.43,"nbNeighbors":0,"properties":{"brief":"","caseId":"","date":"","identity":"","police":"","title":""},"type":1},"id":next_id,"name":"新添加案情","neighbors":{"edges":[],"nodes":[]},"nodeId":next_id};
  ogma.addNode(node);
  console.log(next_id);
  graph.nodes.push(node);
}
/*创建连接*/
function createLink() {
  var nodes = ogma.getSelectedNodes();
  var edge;
  edge_max_id++;
  edge = {"id":edge_max_id,"source":nodes.get(0).getId(),"target":nodes.get(nodes.size-1).getId(),"data":{"type":"HAS_SSN","properties":{}}};
  ogma.addEdge(edge);
  graph.edges.push(edge);
  var sourceId = ogma.getEdge(edge_max_id).getSource().getId();
  var targetId = ogma.getEdge(edge_max_id).getTarget().getId();
  /*修改source节点的属性*/
  for(var i in graph.nodes) {
    if(graph.nodes[i].id === sourceId){
      graph.nodes[i].data.nbNeighbors++;
      graph.nodes[i].neighbors.edges.push(edge_max_id);
      graph.nodes[i].neighbors.nodes.push(targetId);
    }
  }
  /*修改target节点的属性*/
  for(var i in graph.nodes) {
    if(graph.nodes[i].id === targetId){
      graph.nodes[i].data.nbNeighbors++;
      graph.nodes[i].neighbors.edges.push(edge_max_id);
      graph.nodes[i].neighbors.nodes.push(sourceId);
    }
  }
  nodes.setSelected(false);
}
/*// Log a message in the console when a node is added
ogma.events.onNodesAdded(function (evt) {
  console.log('Nodes added with ids: [' + evt.nodes.getId().join(', ') + ']')
});*/
/*// Open/close the geographical mode when the user presses Ctrl + M on the keyboard.
ogma.events.onKeyPress('ctrl m', function (evt) {
  ogma.geo.toggle();
});*/
/*function toggleLasso() {
  if (ogma.tools.lasso.enabled()) {
    ogma.tools.lasso.disable();
  } else  {
    ogma.tools.lasso.enable();
  }
}
ogma.events.onKeyPress('l', toggleLasso); // toggles lasso tool on/off

// '+' and '-' keys are used to zoom in and out with a short animation
ogma.events.onKeyPress('+', function() {
    ogma.view.zoomIn({ duration: 200 });
  })
  .onKeyPress('-', function() {
    ogma.view.zoomOut({ duration: 200 });
  });*/
  // subscribe to selection change event, it will be triggered once
// rectangle selection is done
/*ogma.events.onNodesSelected(function() {
  console.log(ogma.getSelectedNodes().getId()); // ['id1', 'id2', ...]
});
// switch rectangle select on drag start with the 'ctrl' key pressed
ogma.events.onDragStart(function () {
  if (ogma.keyboard.isKeyPressed('ctrl')) {
    ogma.tools.rectangleSelect.enable();
  }
})*/
/*使用ctrl连接节点，方法。先选择一个节点，然后再按住Ctrl键连接其他节点*/
  ogma.events.onDragStart(function () {
    if (ogma.keyboard.isKeyPressed('ctrl')) {
      ogma.tools.connectNodes.enable({
        strokeColor: 'blue',

        onComplete: function (evt) {
          console.log('New connection: ', evt);
        },

        onNodeCreated: function (n) {
          console.log("onNodeCreated")
          console.log(n);
          console.log('node created ', n.getId());
          n.setAttributes({color:'orange'});
        },

        onEdgeCreated: function (n) {
          console.log("onEdgeCreated")
          console.log(n);
          console.log('edge created ', n.getId());
          n.setAttributes({color:'#00348c'});
        }});
    }
  });

init();