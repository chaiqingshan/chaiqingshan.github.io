$(document).ready(function(){
  		$("#roleName").keydown(function(e){
			 var e = e || event,
			 keycode = e.which || e.keyCode;
			 if (keycode==13) {
			 	search_name();
			 	return false;
			 }
		});
		$("#select-file").on('change',search_file);
   });
 	function search_file(){
 		var fileObj=$("#select-file")[0].files[0];
 		var reader=new FileReader();
 		reader.onloadend=function(){
 			$("#preview").attr('src',reader.result);
 			$("#preview").css('display','inline');
// 			preview.display='inline';
 		}
 		if(fileObj){
 			reader.readAsDataURL(fileObj);
 		}
 		else{
 			preview.src="";
 		}
 		if(fileObj){
 			var formData=new FormData();
 			formData.append('imgfile',fileObj);
	 		$.ajax({
				type:"POST",
				url:"http://124.127.117.2:5902/search-post",
				contentType:false,
				processData:false,
				data:formData,
				success: function (result) {
					var i=0;
					var str="";
					var time;
					$("#p_tbody").html("");
					for(i=0;i<result.length;i++){
						str+="<tr>"+"<td><img src='"+result[i].image_url+"'></td><td>第"+result[i].file_name.slice(result[i].file_name.length-2)+"集"+result[i].time_in_file+"</tr></td>";
						$("#p_tbody").append(str);
						str="";
					}
					$("#p_tbody tr").click(function(){
						var epi_time=$(this).children(".time").text();
						var episode=epi_time.slice(1,3);
						var time=epi_time.slice(4);
						var times=time.split(":");
						var second=parseInt(times[0])*3600+parseInt(times[1])*60+parseInt(times[2]);
						var source=$("#video")[0].src;
						if(episode!=source.substr(source.length-6,2)){
							var location='http://124.127.117.32:8889/minyi/RMDMY_'+episode+".mp4";	
							$("#video").attr("src",location);
						}	
						myVideo=document.getElementById("video");
						if(second<10){							
							myVideo.currentTime=0;
						}else{							
							myVideo.currentTime=second-10;
						}
					});
	            },
	            error : function() {
	                alert("异常！");
	            }
			});
 		}
 			
 	}
 	function search_name(){
 		$.ajax({
  			type:"POST",
  			dataType:"json",
  			url:"http://124.127.117.2:5902/search-post",
  			data:$("#roleName").serialize(),
  			success: function (result) {
  				var i=0;
  				var str="";
  				var time;
  				$("#p_tbody").html("");
  				for(i=0;i<result.length;i++){
  					str+="<tr>"+"<td><img src='"+result[i].image_url+"'></td><td class='time'>第"+result[i].file_name.slice(result[i].file_name.length-2)+"集"+result[i].time_in_file+"</tr></td>";
  					$("#p_tbody").append(str);
  					str="";
  				}
  				$("#p_tbody tr").click(function(){
					var epi_time=$(this).children(".time").text();
					var episode=epi_time.slice(1,3);
					var time=epi_time.slice(4);
					var times=time.split(":");
					var second=parseInt(times[0])*3600+parseInt(times[1])*60+parseInt(times[2]);
					var source=$("#video")[0].src;
					if(episode!=source.substr(source.length-6,2)){
						var location='http://124.127.117.32:8889/minyi/RMDMY_'+episode+".mp4";	
						$("#video").attr("src",location);
					}		
					myVideo=document.getElementById("video");
					if(second<10){						
						myVideo.currentTime=0;
					}else{
						myVideo.currentTime=second-10;
					}
					
				});
  				search_relation();
            },
            error : function() {
                alert("异常！");
            }
  		});	
 	}
 	//将canvas截图转换至可上传到服务器的图片格式
 	function dataURItoBlob (base64Data) {  
		var byteString;  
		if (base64Data.split(',')[0].indexOf('base64') >= 0)  
		    byteString = atob(base64Data.split(',')[1]);  
		else  
		    byteString = unescape(base64Data.split(',')[1]);  
		var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];  
		var ia = new Uint8Array(byteString.length);  
		for (var i = 0; i < byteString.length; i++) {  
		    ia[i] = byteString.charCodeAt(i);  
		}  
		return new Blob([ia], {type: mimeString});  
 	}
 	function playPause() {
 		var myVideo=document.getElementById("video");
        if (myVideo.paused){
            myVideo.play();
//          alert("x"+(window.event.clientX-myVideo.offsetLeft)+",Y:"+(window.event.clientY-myVideo.offsetTop));
		 } 
        else{
            myVideo.pause();
            var x=window.event.clientX-myVideo.getBoundingClientRect().left;
            var y=window.event.clientY-myVideo.getBoundingClientRect().top-10.8125;
			var video=document.getElementById("video");
			var canvas=document.getElementById("output");
			canvas.width=video.videoWidth;
			canvas.height=video.videoHeight;
			canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
			var data=canvas.toDataURL('image/jpeg');
			var blob=dataURItoBlob(data);
			var formData=new FormData();
 			formData.append('imgfile',blob);
 			formData.append('fileName',"123.jpg");
 			formData.append('location',x+','+y);
	 		$.ajax({
				type:"POST",
				url:"http://124.127.117.2:5902/search-post",
				contentType:false,
				processData:false,
				data:formData,
				success: function (result) {
					var i=0;
					var str="";
					var time;
					$("#p_tbody").html("");
					for(i=0;i<result.length;i++){
						str+="<tr>"+"<td><img src='"+result[i].image_url+"'></td><td>第"+result[i].file_name.slice(result[i].file_name.length-2)+"集"+result[i].time_in_file+"</tr></td>";
						$("#p_tbody").append(str);
						str="";
					}
					$("#p_tbody tr").click(function(){
						var epi_time=$(this).children(".time").text();
						var episode=epi_time.slice(1,3);
						var time=epi_time.slice(4);
						var times=time.split(":");
						var second=parseInt(times[0])*3600+parseInt(times[1])*60+parseInt(times[2]);
						var source=$("#video")[0].src;
						if(episode!=source.substr(source.length-6,2)){
							var location='http://124.127.117.32:8889/minyi/RMDMY_'+episode+".mp4";	
							$("#video").attr("src",location);
						}	
						myVideo=document.getElementById("video");
						if(second<10){							
							myVideo.currentTime=0;
						}else{							
							myVideo.currentTime=second-10;
						}
					});
	            },
	            error : function() {
	                alert("异常！");
	            }
			});
       }
    }
 	function isHasElementOne(arr,value){
		for(var i = 0; i < arr.length; i++){
			if(arr[i] == value){
				return i;
			}
		}
		return -1;
	} 
 	function search_relation(){
 		var name_code={"001":"蔡成功","002":"郑西坡","003":"陈岩石","004":"王文革","005":"陈海","006":"钟小艾","007":"赵瑞龙",
 		"008":"侯亮平","009":"刘建新","010":"吴慧芬","011":"沙瑞金","012":"祁同伟","013":"陆亦可","014":"高小琴","015":"高育良",
 		"016":"赵东来","017":"李达康","018":"梁璐","019":"季昌明","020":"丁义珍","021":"赵德汉","022":"欧阳菁","023":"林华华",
 		"024":"周正","025":"王馥真","026":"郑胜利","027":"易学习","028":"孙连成","029":"侯天来","030":"田国福","031":"程度"};
 		var code
 		var name=$("#role").val();
 		for(var k in name_code){
 			if(name_code[k]==name){
 				code=k;
 			}
 		}
 		var namesArr=new Array();
 		var relationsArr=new Array();
 		for(var episode=1;episode<53;episode++){
 			var datatosend={"faceid":code,"episode":episode};
	 		$.ajax({
	  			type:"POST",
	  			dataType:"json",
	  			url:"http://124.127.117.2:5902/search-post",
	  			data:datatosend,
	  			async:false,
	  			success: function (result) {
	  				var names=new Array();
	  				var relations=new Array();
	  				for(var i=0;i<result.length;i++){
	  					if(i==0){
	  						names.push(name_code[result[i].role_id]);
	  						for(var j=0;j<result[i].relation_vector.split(",").length;j++){
	  							names.push(name_code[result[i].relation_vector.split(",")[j]]);
	  						}
	  					}else{
	  						for(var j=0;j<result[i].relation_vector.split(",").length;j++){
	  							if(isHasElementOne(names,name_code[result[i].relation_vector.split(",")[j]])==-1){
	  								names.push(name_code[result[i].relation_vector.split(",")[j]]);
	  							}  							
	  						}
	  					}
	  					for(var m=0;m<result[i].relation_vector.split(",").length;m++){
	  						var relation=new Array();
	  						relation.push(i);
	  						relation.push(isHasElementOne(names,name_code[result[i].relation_vector.split(",")[m]]));
	  						relations.push(relation);
	  					}  					
	  				}
	  				var datas=new Array();
	  				for(var n=0;n<names.length;n++){
	  					if(n==0){
	  						var element={'name':names[n],'draggable':true};
	  						datas.push(element);
	  					}else{
	  						var element={'name':names[n],'category':1,'draggable':true,}
	  						datas.push(element);
	  					}  					
	  				}
	  				var links=new Array();
	  				for(var n=0;n<relations.length;n++){
	  					var link={'source':relations[n][0],'target':relations[n][1],'value':''};
	  					links.push(link);
	  				}
	  				namesArr.push(datas);
	  				relationsArr.push(links);
	  			},
	  			error : function() {
	                alert("异常！");
	            }
	  		});
 		}
 		
//				var datas=[{name: '侯亮平',draggable: true,}, {name: '冯可梁',category: 1,draggable: true,}, {name: '邓志荣',category: 1,draggable: true,
//		           }, {name: '李荣庆',category: 1,draggable: true,}, {name: '郑志勇',category: 1,draggable: true,
//		           }, {name: '赵英杰',category: 1,draggable: true,}];
//		            var links=[{source: 0,target: 1,category: 0,value: '朋友'}, {source: 0,arget: 2,value: '战友'
//		           }, {source: 2,target: 3,value: '房东'}, {source: 2,target: 4,value: '朋友'}, {source: 1,target: 5,value: '表亲'
//		           }, {source: 2,target: 5,value: '朋友'}];
  				var myChart = echarts.init(document.getElementById('echarts'));
				myChart.setOption(
					{
						baseOption:{
							timeline: {
			                    //loop: false,      
			                    axisType: 'category',
			                    show: true,
			                    autoPlay: false,
			                    playInterval: 1500,
			                    left:0,
			                    right:0,
			                    data: ['第1集', '第2集','第3集','第4集','第5集','第6集','第7集','第8集','第9集','第10集','第11集','第12集','第13集','第14集','第15集','第16集','第17集','第18集','第19集',
			                    		'第20集','第21集','第22集','第23集','第24集','第25集','第26集','第27集','第28集','第29集','第30集','第31集','第32集','第33集','第34集',
			                          '第35集','第36集','第37集','第38集','第39集','第40集','第41集','第42集','第43集','第44集','第45集','第46集','第47集','第48集','第49集',
			                          '第50集','第51集','第52集']
			                },title: {
					        text: ''
					    },
					    tooltip: {},
						animation:false,
					    animationDurationUpdate: 1500,
					    animationEasingUpdate: 'quinticInOut',
					    label: {
					        normal: {
					            show: true,
					            textStyle: {
					                fontSize: 12
					            },
					        }
					    },
//					    legend: {
//					        x: "center",
//					        show: false,
//					        data: ["朋友", "战友", '亲戚']
//					    },
					    series: [					
					        {
					            type: 'graph',
					            layout: 'force',
					            symbolSize: 45,
					            focusNodeAdjacency: true,
					            roam: true,
					            categories: [{
					                name: '朋友',
					                itemStyle: {
					                    normal: {
					                        color: "#009800",
					                    }
					                }
					            }, {
					                name: '战友',
					                itemStyle: {
					                    normal: {
					                        color: "#4592FF",
					                    }
					                }
					            }, {
					                name: '亲戚',
					                itemStyle: {
					                    normal: {
					                        color: "#3592F",
					                    }
					                }
					            }],
					            label: {
					                normal: {
					                    show: true,
					                    textStyle: {
					                        fontSize: 12
					                    },
					                }
					            },
					            force: {
									layoutAnimation:true,
					                repulsion: 1000
					            },
					            edgeSymbolSize: [4, 50],
					            edgeLabel: {
					                normal: {
					                    show: true,
					                    textStyle: {
					                        fontSize: 10
					                    },
					                    formatter: "{c}"
					                }
					            }
								}
							]						
					},
					options:[
						{title:{text:'第1集'+name+'人物关系'},series:[{data: namesArr[0],links: relationsArr[0],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第2集'+name+'人物关系'},series:[{data: namesArr[1],links: relationsArr[1],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第3集'+name+'人物关系'},series:[{data: namesArr[2],links: relationsArr[2],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第4集'+name+'人物关系'},series:[{data: namesArr[3],links: relationsArr[3],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第5集'+name+'人物关系'},series:[{data: namesArr[4],links: relationsArr[4],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第6集'+name+'人物关系'},series:[{data: namesArr[5],links: relationsArr[5],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第7集'+name+'人物关系'},series:[{data: namesArr[6],links: relationsArr[6],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第8集'+name+'人物关系'},series:[{data: namesArr[7],links: relationsArr[7],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第9集'+name+'人物关系'},series:[{data: namesArr[8],links: relationsArr[8],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第10集'+name+'人物关系'},series:[{data: namesArr[9],links: relationsArr[9],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第11集'+name+'人物关系'},series:[{data: namesArr[10],links: relationsArr[10],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第12集'+name+'人物关系'},series:[{data: namesArr[11],links: relationsArr[11],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第13集'+name+'人物关系'},series:[{data: namesArr[12],links: relationsArr[12],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第14集'+name+'人物关系'},series:[{data: namesArr[13],links: relationsArr[13],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第15集'+name+'人物关系'},series:[{data: namesArr[14],links: relationsArr[14],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第16集'+name+'人物关系'},series:[{data: namesArr[15],links: relationsArr[15],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第17集'+name+'人物关系'},series:[{data: namesArr[16],links: relationsArr[16],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第18集'+name+'人物关系'},series:[{data: namesArr[17],links: relationsArr[17],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第19集'+name+'人物关系'},series:[{data: namesArr[18],links: relationsArr[18],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第20集'+name+'人物关系'},series:[{data: namesArr[19],links: relationsArr[19],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第21集'+name+'人物关系'},series:[{data: namesArr[20],links: relationsArr[20],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第22集'+name+'人物关系'},series:[{data: namesArr[21],links: relationsArr[21],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第23集'+name+'人物关系'},series:[{data: namesArr[22],links: relationsArr[22],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第24集'+name+'人物关系'},series:[{data: namesArr[23],links: relationsArr[23],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第25集'+name+'人物关系'},series:[{data: namesArr[24],links: relationsArr[24],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第26集'+name+'人物关系'},series:[{data: namesArr[25],links: relationsArr[25],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第27集'+name+'人物关系'},series:[{data: namesArr[26],links: relationsArr[26],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第28集'+name+'人物关系'},series:[{data: namesArr[27],links: relationsArr[27],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第29集'+name+'人物关系'},series:[{data: namesArr[28],links: relationsArr[28],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第30集'+name+'人物关系'},series:[{data: namesArr[29],links: relationsArr[29],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第31集'+name+'人物关系'},series:[{data: namesArr[30],links: relationsArr[30],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第32集'+name+'人物关系'},series:[{data: namesArr[31],links: relationsArr[31],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第33集'+name+'人物关系'},series:[{data: namesArr[32],links: relationsArr[32],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第34集'+name+'人物关系'},series:[{data: namesArr[33],links: relationsArr[33],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第35集'+name+'人物关系'},series:[{data: namesArr[34],links: relationsArr[34],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第36集'+name+'人物关系'},series:[{data: namesArr[35],links: relationsArr[35],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第37集'+name+'人物关系'},series:[{data: namesArr[36],links: relationsArr[36],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第38集'+name+'人物关系'},series:[{data: namesArr[37],links: relationsArr[37],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第39集'+name+'人物关系'},series:[{data: namesArr[38],links: relationsArr[38],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第40集'+name+'人物关系'},series:[{data: namesArr[39],links: relationsArr[39],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第41集'+name+'人物关系'},series:[{data: namesArr[40],links: relationsArr[40],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第42集'+name+'人物关系'},series:[{data: namesArr[41],links: relationsArr[41],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第43集'+name+'人物关系'},series:[{data: namesArr[42],links: relationsArr[42],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第44集'+name+'人物关系'},series:[{data: namesArr[43],links: relationsArr[43],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第45集'+name+'人物关系'},series:[{data: namesArr[44],links: relationsArr[44],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第46集'+name+'人物关系'},series:[{data: namesArr[45],links: relationsArr[45],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第47集'+name+'人物关系'},series:[{data: namesArr[46],links: relationsArr[46],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第48集'+name+'人物关系'},series:[{data: namesArr[47],links: relationsArr[47],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第49集'+name+'人物关系'},series:[{data: namesArr[48],links: relationsArr[48],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第50集'+name+'人物关系'},series:[{data: namesArr[49],links: relationsArr[49],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第51集'+name+'人物关系'},series:[{data: namesArr[50],links: relationsArr[50],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},
						{title:{text:'第52集'+name+'人物关系'},series:[{data: namesArr[51],links: relationsArr[51],lineStyle: {normal: {opacity: 0.9,width: 1, curveness: 0}}}]},					
					]		
					}
				);		 				 
 	}