'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var checkFunction = {
	setBackground () {
		let caseCbs = $('input.check-case')
		this.$nextTick(function () {
        	$.each(caseCbs, function(index, ele) {
				if(ele.checked) {
					$(ele).parents('.case').css({"border-color": "rgb(69, 185, 177)"})
					$(ele).parents('.case').css({"background-color": "rgb(69, 185, 177)"})
					$('p', $(ele).parents('.case')).css({"color": "#fff"})
				}else {
					$(ele).parents('.case').css({"border-color": "#ddd5d5"})
					$(ele).parents('.case').css({"background-color": "#fff"})
					$('p', $(ele).parents('.case')).css({"color": "#797979"})
				}
			})
      	})
	},
	setSelect (event){
		var _this = this;
		var target  = event.target;
		if(target.classList.contains('handle')) {
			return
		}
		// if (!target.classList.contains('main-content')) { return false; }
		let container = document.querySelector('.main-content')
		var fileNodes = document.querySelectorAll(".case .check-case");
		var startX = event.offsetX + Vac.getOffsetTo(event.target, container).offsetLeft;
		var startY = event.offsetY + Vac.getOffsetTo(event.target, container).offsetTop;
		var moveBeforeX = event.pageX;
		var moveBeforeY = event.pageY;
		var selDiv = document.createElement('div');
		selDiv.style.cssText = 
		`position:absolute;width:0px;height:0px;
		font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;
		background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);
		opacity:0.6;display:none;`;
		selDiv.id = 'selectDiv';
		document.querySelector('.main-content').appendChild(selDiv);
		selDiv.style.left = startX + "px";
		selDiv.style.top = startY + 'px';
		var _x = null;
		var _y = null;
		var moveAfterX = null;
		var moveAfterY = null;
		event.stopPropagation();
		event.preventDefault();
		var selectedRange = [];
		// 函数节流
		// var moveFunction = Vac.throttle(mouseMoveFunction, 30, _this)
		var moveFunction = mouseMoveFunction;
		container.addEventListener('mousemove', moveFunction, false);
		container.addEventListener('mouseup', (event) => {
			// this.isSelect = true;
			if (selDiv){
				document.querySelector('.main-content').removeChild(selDiv);
			}
			container.removeEventListener('mousemove', moveFunction, false);
			selDiv = null;
		}, false);


		function mouseMoveFunction(event){
			// console.log(new Date().getSeconds())
			if(selDiv.style.display == 'none'){
				selDiv.style.display = "block";
			}
			moveAfterX = event.pageX;
			moveAfterY = event.pageY;
			// 获取鼠标移动后的位置
			_x = startX - moveBeforeX + moveAfterX;
			_y = startY - moveBeforeY + moveAfterY;
			// console.log("_X:" + _x + "-- _Y:" + _y);
			selDiv.style.left = Math.min(_x, startX) + "px";
			selDiv.style.top = Math.min(_y, startY) + "px";
			// console.log("Left:" + selDiv.style.left + "-- Top:" + selDiv.style.top);
			selDiv.style.width = Math.abs(_x - startX) + "px";
			selDiv.style.height  = Math.abs(_y - startY) + "px";

			var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
			var _r = selDiv.offsetWidth + _l, _b = selDiv.offsetHeight + _t;
			
			for(var i=0; i < fileNodes.length; i++){
				var inputLeft = Vac.getOffsetTo(fileNodes[i], container).offsetLeft;
				var inputTop = Vac.getOffsetTo(fileNodes[i], container).offsetTop;
				var inputRight = inputLeft + fileNodes[i].offsetWidth;
				var inputBottom = inputTop + fileNodes[i].offsetHeight;
				if( inputBottom < _b && inputTop > _t && inputLeft > _l && inputRight < _r) {
					selectedRange.push(fileNodes[i]);
				}
			}

			for(var i=0; i<selectedRange.length; i++){
				var inputLeft = Vac.getOffsetTo(selectedRange[i], container).offsetLeft;
				var inputTop = Vac.getOffsetTo(selectedRange[i], container).offsetTop;
				var inputRight =  inputLeft + selectedRange[i].offsetWidth;
				var inputBottom = inputTop + selectedRange[i].offsetHeight;
				let value = selectedRange[i].value;
				if( inputBottom < _b && inputTop > _t && inputLeft > _l && inputRight < _r) {console.log(value);
					if ($(selectedRange[i]).hasClass('single-case')) {
						_this.pushNoRepeat(_this.selectedCases, +value)
					} else {
						_this.pushNoRepeat(_this.checkedFlowNodes, +value)
					}
				} else {
					if ($(selectedRange[i]).hasClass('single-case')) {
						let set = new Set(_this.selectedCases)
						set.delete(+value)
						_this.selectedCases = [...set]
					} else {
						let set = new Set(_this.checkedFlowNodes)
						set.delete(+value)
						_this.checkedFlowNodes = [...set]
					}
				}
				_this.setBackground();
			}
			event.stopPropagation();
			event.preventDefault();
		};
	},
	setSelectListener (){
		// document.querySelector('.main-content').addEventListener('mousedown',this.setSelect,false);
	},
	pushNoRepeat (array, value) {
		array.includes(value)
			? 1
			: array.push(value)
	},
	// 点击checkbox
	checkChanged (event) {
		var parent = event.target.parentNode.parentNode.parentNode
		var checkallId = +parent.parentNode.querySelector('.checkall').value
		var inputs = Array.from(parent.querySelectorAll('.check-case'))
		if(inputs.every((value) => {
			return value.checked === true 
		})) {
			this.selectedCases.push(checkallId)
		} else {
			let set = new Set(this.selectedCases)
			set.delete(checkallId)
			this.selectedCases = [...set]
		}
		this.setBackground()
	},
	checkallToggle (event){
		var flag = event.target.checked;
		// console.log(flag)
		var inputs = event.target.parentNode.parentNode.parentNode.getElementsByClassName('check-case');
		let inputValue = []
		if(flag) {
			for(var input of inputs) {
				(!this.checkedFlowNodes.includes(+input.value))
				? (this.checkedFlowNodes.push(+input.value))
				: 1 
			}
		} else {
			for (var input of inputs) {
				let set = new Set(this.checkedFlowNodes)
				let value = +input.value
				if(set.has(value)) {
					set.delete(value)
				}
				this.checkedFlowNodes = [...set]
			}
		}
		this.setBackground()
		console.log(this.checkedFlowNodes);
	},
	checkallBox (event){
		// console.log(this.checkall)
		if(this.checkall === true) {
			this.caseIds.forEach((value) => {
				this.selectedCases.includes(value) ? 1 : (this.selectedCases.push(value))
				this.flowNodeIds.has(+value)
					? (
						this.checkedFlowNodes = [...this.checkedFlowNodes,...this.flowNodeIds.get(+value)]
					)
					: 1
			})
		} else {
			this.selectedCases = []
			this.checkedFlowNodes = [];
		}
		this.setBackground()
	},
};
var vBody = new Vue({
	el: '#v-body',
	data: {
		isSelect: false,
		tooltipFlag: true,
		tooltipType: 4,
		triggerShow: false,
		saveTriggerType: 1,

		alertShow: false,
		tooltipMessage: '',

		sceneInfo: null,
		caseIds: [],
		flowNodeIds: new Map(),

		triggers: null,
		triggerInfo: {
			selectedTrigger: [],
			editTriggerType: '编辑'
		},
		// 保存触发器编辑的字段数据
		editTriggerData: {
			triggerId: null,
			name: "",
			desc: '',
			occasions: [],
			Conditionrelate: null,
			conditions: [],
			actions: [],
			modifyType: null
		},
		// 保存执行策略的数据
		exe_strategy: {
			// sceneId: '3',
			exe_strategy1_status: '',
			exe_strategy2_start: '',
			exe_strategy2_order: '',
			exe_strategy2_status: '',
			exe_strategy3_start: '',
			exe_strategy3_order: '',
			exe_strategy3_status: '',
			exe_strategy_err: ''
		},

		checkall: false,
		// save the selected cases
		selectedCases: [],
		// save the checked flow nodes
		checkedFlowNodes: [],
		// 执行时间设置的相关参数
		executeTime: null,
		executeDateFlag: null,

		// 数据池数据
		dataPoolTitle: '',
		editPoolType: 1,
		selectedPool: [],
		selectedPoolId: null,
		poolData: {
			poolname: null,
			datadesc: null,
			poolobjid: null,
			dataname: null,
			datavalue: null
		},
		poolDatas: null,

		//场景id和名称
		url: '',
		sceneid: '',
		scenename: '场景名称',
		exeImgs: {
			0: '/public/static/images/waiting_7757e65.png',
			1: '/public/static/images/running_507c4e4.gif',
			2: '/public/static/images/success_5e930bf.png',
			3: '/public/static/images/failed_2b54903.png'
		},
		// 调试轮次
		debugRound: null,
		exeScope: null,
		isDebugInfoShow: false
	},
	ready: function ready() {
		this.setVal();
		var _this = this;
		// 用于初始化 滑动鼠标选取元素
		this.setSelectListener();
		// 用于页面加载时获取所有的用例
		this.getCases();
		// 数据池模态框消失
		$('#editDataPool').on('hidden.bs.modal', function (e) {
			_this.poolData.poolname = '';
			_this.poolData.poolobjid = '';
			_this.poolData.dataname = '';
			_this.poolData.datavalue = '';
			_this.poolData.datadesc = '';
			// _this.selectedPool = [];
		});
		// Vac.startDrag(document.querySelector('#editTrigger-header'), document.querySelector('#editTrigger'))
		$('#sortable').sortable({
			handle: '.handle'
		});
		$("#sortable").disableSelection();

		$('.3').addClass('open');
		$('.3 .arrow').addClass('open');
		$('.3-ul').css({ display: 'block' });
		$('.3-4').css({ color: '#ff6c60' });
	},
	watch: {
		"selectedCases": function selectedCases(value, oldVal) {
			this.checkall = value.length === this.caseIds.length;
			this.setBackground();
		},
		"checkedFlowNodes": function checkedFlowNodes(value, oldVal) {
			var _this2 = this;

			// console.log(this.flowNodeIds)
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.flowNodeIds.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					if (this.flowNodeIds.get(key).every(function (value) {
						return _this2.checkedFlowNodes.includes(value);
					})) {
						this.pushNoRepeat(this.selectedCases, +key);
					} else {
						var set = new Set(this.selectedCases);
						set.delete(+key);
						this.selectedCases = [].concat(_toConsumableArray(set));
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.setBackground();
		}
	},
	methods: {
		setBackground: checkFunction.setBackground,
		//获取上级页面选中的场景id和名称
		setVal: function setVal() {
			var thisURL = document.URL;
			var getval = thisURL.split('?')[1];
			if (!getval) {
				var promise = Vac.confirm('#vac-confirm', '.okConfirm', '.cancelConfirm', "请从场景管理页面进入！");
				promise.then(function () {
					location.href = "scene.html";
				}, function () {
					location.href = "scene.html";
				});
			}
			var keyval = getval.split('&');
			this.url = document.URL;

			this.sceneid = keyval[0].split('=')[1], this.scenename = decodeURI(keyval[1].split('=')[1]);
		},
		toInsertSceneCase: function toInsertSceneCase() {
			location.href = "insertSceneCase.html?sceneid=" + this.sceneid + "&" + "scenename=" + this.scenename;
		},
		getCases: function getCases() {
			var _this = this;
			$.ajax({
				url: address + 'sceneController/selectByPrimaryKey',
				// url: '/api/getcaseinscene',
				data: 'id=' + _this.sceneid,
				type: 'post',
				dataType: 'json',
				success: function success(data, statusText) {
					if (data.success == true) {
						_this.sceneInfo = data.obj;
						var _data$obj = data.obj;
						_this.exe_strategy.exe_strategy1_status = _data$obj.exeStrategy1Status;
						_this.exe_strategy.exe_strategy2_start = _data$obj.exeStrategy2Start;
						_this.exe_strategy.exe_strategy2_order = _data$obj.exeStrategy2Order;
						_this.exe_strategy.exe_strategy2_status = _data$obj.exeStrategy2Status;
						_this.exe_strategy.exe_strategy3_start = _data$obj.exeStrategy3Start;
						_this.exe_strategy.exe_strategy3_order = _data$obj.exeStrategy3Order;
						_this.exe_strategy.exe_strategy3_status = _data$obj.exeStrategy3Status;
						_this.exe_strategy.exe_strategy_err = _data$obj.exeStrategyErr;


						if (!(data.obj.caseDtos && data.obj.caseDtos.length)) {
							Vac.alert('未查询到相关的用例信息');
						}
						for (var i = data.obj.caseDtos.length - 1; i >= 0; i--) {
							_this.caseIds.includes(data.obj.caseDtos[i].id) ? 1 : _this.caseIds.push(data.obj.caseDtos[i].id);
							if (data.obj.caseDtos[i].caseCompositeType == 2) {
								var arr = [];
								for (var j = data.obj.caseDtos[i].flowNodeDtos.length - 1; j >= 0; j--) {
									arr.push(data.obj.caseDtos[i].flowNodeDtos[j].id);
								}
								_this.flowNodeIds.set(+data.obj.caseDtos[i].id, arr);
							}
						}
						Vue.nextTick(function () {
							$('#sortable').width($('#sortable').width() + 20);
						});
					}
				}
			});
		},
		getTriggers: function getTriggers() {
			var _this = this;
			$.ajax({
				url: address + 'trigerController/trigerqueryinScene',
				data: 'sceneId=' + _this.sceneid,
				type: 'post',
				dataType: 'json',
				success: function success(data) {
					if (data.success == true) {
						_this.triggers = data.obj;
					}
				}
			});
		},
		setSelect: checkFunction.setSelect,
		pushNoRepeat: checkFunction.pushNoRepeat,
		setSelectListener: checkFunction.setSelectListener,
		changeCase: function changeCase(id, type) {
			var arr = type === 1 ? this.selectedCases : this.checkedFlowNodes;
			var index = arr.findIndex(function (value) {
				return value === id;
			});
			index !== -1 ? arr.splice(index, 1) : arr.push(id);
		},
		// 点击checkbox
		checkChanged: checkFunction.checkChanged,
		// 全选case-lib中的case
		checkallToggle: checkFunction.checkallToggle,
		checkallBox: checkFunction.checkallBox,
		toggleTooltip: function toggleTooltip(event) {
			this.tooltipFlag = !this.tooltipFlag;
		},
		//打开tooltipWindow，并根据传入的参数显示相应的操作内容
		operationType: function operationType(type) {
			this.tooltipType = type;
			this.tooltipFlag = false;
			// 触发器设置
			if (type === 2) {
				this.getTriggers();
			} else if (type === 4) {
				this.getDataPool();
			} else if (type === 3) {
				this.getExecuteStrategy();
			}
		},
		// 获取执行策略
		getExecuteStrategy: function getExecuteStrategy() {},
		// 打开关闭触发器设置的弹出框
		closeTrigger: function closeTrigger() {
			this.triggerShow = false;
			this.editTriggerData.name = '';
			this.editTriggerData.desc = '';
			this.editTriggerData.occasions = [];
			this.editTriggerData.Conditionrelate = null;
			$('#conditionsBody').empty();
			$('.action-item-wrapper').remove();
		},
		// 打开编辑触发器的弹框
		openTrigger: function openTrigger(type) {
			var _this = this;
			this.saveTriggerType = type;
			if (type === 1) {
				this.triggerInfo.editTriggerType = "新增";
				this.triggerShow = true;
			} else {
				if (this.triggerInfo.selectedTrigger.length == 0) {
					Vac.alert('请选择要编辑的触发器！');
					return;
				}
				this.triggerInfo.editTriggerType = "编辑";
				// 获取触发器内容
				$.ajax({
					url: address + 'trigerController/trigerquery',
					data: 'trigerId=' + _this.triggerInfo.selectedTrigger[0],
					type: 'post',
					dataType: 'json',
					success: function success(data, statusText) {
						if (data.success == true) {
							var _data$obj2 = data.obj;
							_this.editTriggerData.triggerId = _data$obj2.id;
							_this.editTriggerData.name = _data$obj2.trigerName;
							_this.editTriggerData.desc = _data$obj2.trigerDesc;
							_this.editTriggerData.occasions = _data$obj2.occasions;
							_this.editTriggerData.Conditionrelate = _data$obj2.exeConditionRelate;
							_this.editTriggerData.conditions = _data$obj2.conditions;
							_this.editTriggerData.actions = _data$obj2.actions;

							console.log(_this.editTriggerData);

							var tbody = $('#conditionsBody');
							var conditions = data.obj.conditions;
							var actionWrapper = $('.trigger-action-wrapper');
							var actions = data.obj.actions;

							// if(conditions && conditions.length){
							// 	var length = conditions.length;
							// 	for(var i=0;i<length;i++){
							// 		var tr = $(`<tr><td><select class="objectname"><option value="1" selected>用例编号</option>
							//                              <option value="2">测试系统名称</option>
							//                              <option value="3">功能点名称</option>
							//                              </select> </td><td><select class="matchtype"><option value="1">
							// 			等于</option><option value="2">大于</option></select></td><td><input type="text" name="" style="width:100%;height: 100%;border: none;" class="value">
							//                      			</td><td><button class="btn btn-default">删除</button>
							//                      			</td></tr>`);
							// 		tbody.append(tr);
							// 	}
							// }
							var trs = $('#conditionsBody tr');
							console.log(trs);
							for (var i = 0; i < trs.length; i++) {
								console.log(trs[i]);
								$('.objectName', trs[i]).val(conditions[i].objectName);
								$('.matchType', trs[i]).val(conditions[i].matchType);
								$('.value', trs[i]).val(conditions[i].value);
								$('.btn-default', trs[i]).click(_this.removeTriggerCondition);
							}

							// if(actions && actions.length){
							// 	var length = actions.length;
							// 	for(var i=0; i<length; i++){
							// 		var div = $(`<div class="action-item-wrapper">
							//                   <button class="btn-removeaction"><span class="icon-remove"></span></button>
							//                   <span class="id"></span><div class="item-row"> <label>选择操作</label><select class="actionname">
							//                           <option value="1">发送邮件</option><option value="2">打开网页</option></select></div><div class="item-row"><label>脚本类型</label>
							//                       <select class="actiontype"> <option value="2">groovy</option><option value="1">2</option>
							//                       </select></div> <div class="item-row"><label>脚本内容</label><textarea rows="5" class="scriptcontent"></textarea>
							//                   </div>
							//               </div>`);
							// 		actionWrapper.append(div);
							// 	}
							// }
							var divs = $('.action-item-wrapper');
							for (var i = 0; i < divs.length; i++) {
								$('.id', divs[i]).prop('data-actionid', actions[i].id);
								$('.actionname', divs[i]).val(actions[i].actionname);
								$('.actiontype', divs[i]).val(actions[i].actiontype);
								$('.scriptcontent', divs[i]).val(actions[i].scriptcontent);
								$('.btn-removeaction', divs[i]).click(_this.removeTriggerAction);
							}
						}
					}
				});
				this.triggerShow = true;
			}
		},

		deleteTrigger: function deleteTrigger() {
			var _this = this;
			if (this.triggerInfo.selectedTrigger.length > 0) {
				var promise = Vac.confirm('#vac-confirm', '.okConfirm', '.cancelConfirm');
				console.log(promise);
				promise.then(function () {
					$.ajax({
						url: address + 'trigerController/delete',
						data: 'id=' + _this.triggerInfo.selectedTrigger[0],
						type: 'post',
						dataType: 'json',
						success: function success(data, statusText) {
							if (data.success === true) {
								Vac.alert(data.msg);
								_this.getTriggers();
							} else {
								Vac.alert('删除失败' + data.msg);
							}
						}
					});
				}, function () {});
			} else {
				Vac.alert('请选择要删除的触发器！');
			}
		},
		addTriggerCondition: function addTriggerCondition() {

			var _this = this;
			var tr = $('<tr><td><select class="objectname"><option value="1">\u7528\u4F8B\u7F16\u53F7</option>\n                                    <option value="2">\u6D4B\u8BD5\u7CFB\u7EDF\u540D\u79F0</option>\n                                    <option value="3">\u529F\u80FD\u70B9\u540D\u79F0</option></select> </td><td><select class="matchtype"><option value="1">\n\t\t\t\t\t\t\t\t\t\t\u7B49\u4E8E</option></select></td><td><input type="text" name="" style="width:100%;height: 100%;border: none;" class="value">\n                            \t\t\t</td><td><button class="btn btn-default">\u5220\u9664</button>\n                            \t\t\t</td></tr>');
			$('.btn-default', tr).click(_this.removeTriggerCondition);
			$('#conditionsBody').append(tr);
			tr = null;
		},
		removeTriggerCondition: function removeTriggerCondition(event) {
			// event.target.click(null);
			var deleteTr = event.target.parentNode.parentNode;
			console.log(deleteTr);
			deleteTr.parentNode.removeChild(deleteTr);
			deleteTr = null;
		},
		addTriggerAction: function addTriggerAction() {
			var _this = this;
			var div = $('\n\t\t\t\t\t<div class="action-item-wrapper"><button class="btn-removeaction"><span style="z-index:-1;" class="icon-remove"></span></button>\n\t\t\t\t\t<div class="item-row"><label>\u9009\u62E9\u64CD\u4F5C</label><select class="actionname">\n\t\t\t\t\t<option value="1">\u6267\u884C\u811A\u672C</option><option value="2">groovy\u7C7B\u578B</option></select></div><div class="item-row"><label>\u811A\u672C\u7C7B\u578B</label>\n\t\t\t\t\t<select class="actiontype"> <option value="2">groovy</option><option value="1">2</option>\n\t\t\t\t\t</select></div><div class="item-row"><label>\u811A\u672C\u5185\u5BB9</label><textarea rows="5" class="scriptcontent" cols=""></textarea>\n\t\t\t\t\t</div></div>\n\t\t\t\t');
			$('.btn-removeaction span', div).click(_this.removeTriggerAction);
			$('.trigger-action-wrapper').append(div);
			div = null;
		},
		removeTriggerAction: function removeTriggerAction(event) {
			var deleteDiv = event.target.parentNode.parentNode;
			deleteDiv.parentNode.removeChild(deleteDiv);
		},
		saveTrigger: function saveTrigger() {
			var _this = this;
			switch (this.saveTriggerType) {
				case 1:
					save1();
					break;
				case 2:
					save2();
					break;
				case 3:
					save3();
					break;
			}
			// 新增保存
			function save1() {
				var data = {
					sceneid: _this.sceneid,
					name: _this.editTriggerData.name,
					desc: _this.editTriggerData.desc,
					occasions: _this.editTriggerData.occasions,
					Conditionrelate: _this.editTriggerData.Conditionrelate
				};
				var obj = getDataInTable(1);
				data.conditions = obj.conditions;
				data.actions = obj.actions;
				// console.log(data);
				$.ajax({
					url: address + 'trigerController/insert',
					data: data,
					type: 'post',
					dataType: 'json',
					success: function success(data, statusText) {
						if (data.success) {
							Vac.alert(data.msg);
							this.triggerShow = false;
							_this.getTriggers();
							_this.triggerShow = false;
						} else {
							Vac.alert(data.msg);
						}
					}
				});
			}
			// 简单修改保存
			function save3() {}

			// 修改保存
			function save2() {
				console.log(_this.triggerInfo.selectedTrigger[0]);
				var data = {
					triggerId: _this.triggerInfo.selectedTrigger[0],
					name: _this.editTriggerData.name,
					desc: _this.editTriggerData.desc,
					occasions: '[' + _this.editTriggerData.occasions + ']',
					Condition_relate: _this.editTriggerData.Conditionrelate,
					modifyType: 2
				};

				var obj = getDataInTable(2);
				data.conditions = obj.conditions;
				data.actions = obj.actions;
				console.log(data);
				$.ajax({
					url: address + 'trigerController/update',
					data: data,
					type: 'post',
					dataType: 'json',
					success: function success(data, statusText) {
						if (data.success) {
							Vac.alert(data.msg);
							this.triggerShow = false;
							_this.getTriggers();
							_this.triggerShow = false;
						} else {
							Vac.alert(data.msg);
						}
					}
				});
			}

			// 获取table中的字段
			function getDataInTable(type) {
				var conditions = [];
				var actions = [];
				var trs = document.querySelectorAll('#conditionsBody tr');
				for (var i = 0, len = trs.length; i < len; i++) {
					var obj = {};
					obj.objectName = trs[i].querySelector('.objectname').value;
					obj.matchType = trs[i].querySelector('.matchtype').value;
					obj.value = trs[i].querySelector('.value').value;
					conditions.push(JSON.stringify(obj));
				}
				var divs = document.querySelectorAll('.action-item-wrapper');
				for (var i = 0, len = divs.length; i < len; i++) {
					var obj = {};
					if (type == 2) {
						if (_this.editTriggerData.actions[i].id !== undefined) {
							obj.id = divs[i].querySelector('.id').innerHTML;
						}
						obj.trigerid = _this.triggerInfo.selectedTrigger[0];
					}
					obj.actionname = divs[i].querySelector('.actionname').value;
					obj.actiontype = divs[i].querySelector('.actiontype').value;
					obj.scriptcontent = divs[i].querySelector('.scriptcontent').value;
					actions.push(JSON.stringify(obj));
				}
				return {
					conditions: '[' + conditions.toString() + ']',
					actions: '[' + actions + ']'
				};
			}
		},
		saveTriggerState: function saveTriggerState() {
			var _this = this;
			var trs = document.querySelectorAll('#triggers tr');
			var dataArray = [];
			for (var i = 0; i < trs.length; i++) {
				var item = {};
				item.id = trs[i].querySelector('input').value;
				// console.log(item.id)
				item.state = trs[i].querySelector('select').value;
				dataArray.push(JSON.stringify(item));
			}
			$.ajax({
				url: address + 'trigerController/updatestate',
				data: 'states=' + '[' + dataArray.toString() + ']',
				type: 'post',
				dataType: 'json',
				success: function success(data, statusText) {
					if (data.success === true) {
						Vac.alert('保存成功！');
						_this.getTriggers();
					} else {
						Vac.alert('保存失败');
					}
				}
			});
		},
		// 点击触发器的checkbox调用方法控制只能选择一个
		changeSelectedTrigger: function changeSelectedTrigger() {
			if (this.triggerInfo.selectedTrigger.length > 1) {
				this.triggerInfo.selectedTrigger.shift();
			}
		},
		saveStrategy: function saveStrategy() {
			console.log('he');
			var _this = this;
			_this.exe_strategy.sceneId = _this.sceneid;
			$.ajax({
				url: address + 'sceneController/set',
				data: _this.exe_strategy,
				dataType: 'json',
				type: 'post',
				success: function success(data) {
					Vac.alert(data.msg);
					_this.getCases();
				},
				error: function error() {
					Vac.alert('设置失败！');
				}
			});
		},
		hideAlert: function hideAlert() {
			this.alertShow = false;
		},
		removeCases: function removeCases() {
			var _this = this;
			if (!this.selectedCases.length) {
				Vac.alert('请选择要移除的用例！');
				return;
			}
			Vac.confirm('', '', '', '确认要移除所选用例吗？').then(function () {
				var data = {
					sceneid: _this.sceneid,
					caseidList: '[' + _this.selectedCases.toString() + ']'
				};
				$.ajax({
					url: address + 'testexecutioninstanceController/deletetestcaseinscene',
					data: data,
					type: 'post',
					dataType: 'json',
					success: function success(data, statusText) {
						if (data.success === true) {
							Vac.alert("删除成功！");
							_this.selectedCases = [];
							_this.getCases();
						} else {
							Vac.alert('删除失败！');
						}
					},
					error: function error() {
						Vac.alert('移除失败，请重新尝试！');
					}
				});
			});
		},
		// 执行时间规划
		getExecuteTime: function getExecuteTime() {},
		saveExecuteTime: function saveExecuteTime() {
			var data = {
				sceneid: this.sceneid,
				caseIds: '[' + this.selectedCases + ']',
				executeTime: this.executeTime,
				executeDateFlag: this.executeDateFlag,
				combineGroupName: '',
				orderNumber: 1,
				runTotalNumber: 2
			};
			$.ajax({
				url: address + 'testexecutioninstanceController/settextexecutioninstance',
				data: data,
				type: 'post',
				dataType: 'json',
				success: function success(data, statusText) {
					if (data.success === true) {
						Vac.alert('保存成功！' + data.msg);
					} else {
						Vac.alert('保存失败！');
					}
				},
				error: function error() {
					Vac.alert('保存失败！');
				}
			});
		},

		openPool: function openPool(type) {
			var _this = this;
			if (type == 2) {
				if (_this.selectedPool.length == 0) {
					return;
				}
				_this.editPoolType = 2;
				_this.dataPoolTitle = '设置';
				var data = {
					poolname: '场景数据池',
					poolobjid: '2',
					dataname: _this.selectedPool[0]
				};
				$.ajax({
					url: address + 'dataPoolController/selectByCondition',
					data: data,
					type: 'post',
					dataType: 'json',
					success: function success(data, statusText) {
						if (data.obj instanceof Array) {
							var _data$obj$ = data.obj[0];
							// _this.poolData = data.obj[0];

							_this.poolData.poolname = _data$obj$.poolname;
							_this.poolData.poolobjid = _data$obj$.poolobjid;
							_this.poolData.dataname = _data$obj$.dataname;
							_this.poolData.datavalue = _data$obj$.datavalue;
							_this.poolData.datadesc = _data$obj$.datadesc;

							_this.selectedPoolId = data.obj[0].id;
						}
					},
					error: function error() {
						Vac.alert('获取场景数据池失败！');
					}
				});
			} else {
				_this.editPoolType = 1;
				_this.dataPoolTitle = '新增';
				_this.poolData.poolname = '';
				_this.poolData.poolobjid = '';
				_this.poolData.dataname = '';
				_this.poolData.datavalue = '';
				_this.poolData.datadesc = '';
			}
			$('#editDataPool').modal('show');
		},
		getDataPool: function getDataPool() {
			var _this = this;
			var data = {
				poolname: '场景数据池',
				poolobjid: '2',
				dataname: ''
			};
			$.ajax({
				url: address + 'dataPoolController/selectByCondition',
				type: 'post',
				dataType: 'json',
				data: data,
				success: function success(data, statusText) {
					if (data.obj instanceof Array) {
						_this.poolDatas = data.obj;
					}
				},
				error: function error() {
					Vac.alert('获取场景数据池失败！');
				}
			});
		},
		saveDataPool: function saveDataPool() {
			var _this = this;
			var data = {};
			var _this$poolData = _this.poolData;
			data.poolname = _this$poolData.poolname;
			data.poolobjid = _this$poolData.poolobjid;
			data.dataname = _this$poolData.dataname;
			data.datavalue = _this$poolData.datavalue;
			data.datadesc = _this$poolData.datadesc;

			if (_this.editPoolType == 2) {
				data.id = _this.selectedPoolId;
			}
			var url = _this.editPoolType === 1 ? 'dataPoolController/insert' : 'dataPoolController/update';
			$.ajax({
				url: address + url,
				data: data,
				type: 'post',
				dataType: 'json',
				success: function success(data, statusText) {
					if (data.success === true) {
						$('#editDataPool').modal('hide');
					}
					Vac.alert(data.msg);
					_this.getDataPool();
				},
				error: function error() {
					Vac.alert('保存失败，请重新尝试！');
				}
			});
		},
		removeDatapool: function removeDatapool() {
			var _this = this;
			if (_this.selectedPool.length > 0) {
				var data = {
					poolname: '场景数据池',
					poolobjid: '2',
					dataname: _this.selectedPool[0]
				};
				$.ajax({
					url: address + 'dataPoolController/selectByCondition',
					data: data,
					type: 'post',
					dataType: 'json',
					success: function success(data, statusText) {
						if (data.obj instanceof Array) {
							var _data$obj$2 = data.obj[0];
							// _this.poolData = data.obj[0];

							_this.poolData.poolname = _data$obj$2.poolname;
							_this.poolData.poolobjid = _data$obj$2.poolobjid;
							_this.poolData.dataname = _data$obj$2.dataname;
							_this.poolData.datavalue = _data$obj$2.datavalue;
							_this.poolData.datadesc = _data$obj$2.datadesc;

							_this.selectedPoolId = data.obj[0].id;

							var promise = Vac.confirm('#vac-confirm', '.okConfirm', '.cancelConfirm');
							promise.then(function () {
								$.ajax({
									url: address + 'dataPoolController/delete',
									data: 'id=' + _this.selectedPoolId,
									type: 'post',
									dataType: 'json',
									success: function success(data, statusText) {
										Vac.alert(data.msg);
										_this.getDataPool();
										_this.selectedPool.shift();
									},
									error: function error() {
										Vac.alert('移除数据池数据失败！');
									}
								});
							}, function () {});
						}
					}
				});
			} else {
				Vac.alert('请选择要删除的数据！');
			}
		},
		debug: function debug() {
			if (this.exeScope == '' || this.debugRound == '') {
				Vac.alert('请输入调试轮次与执行范围！');
				return;
			}
			// 若选择部分执行，则需要选中实例
			if (this.exeScope == 2 && this.selectedCases.length == 0 && this.checkedFlowNodes.length == 0) {
				Vac.alert('请选择要执行的部分实例！');
				return;
			}
			this.isDebugInfoShow = true;
			// 删除选中的案例中节点案例,并生成要发送的数据
			var sendData = [];
			var flowCases = [].concat(_toConsumableArray(this.flowNodeIds.keys()));
			console.log(flowCases);
			var set = new Set(this.selectedCases);
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = set[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var caseId = _step2.value;

					if (flowCases.includes(caseId)) {
						set.delete(caseId);
					} else {
						var obj = {
							id: caseId,
							idtype: 1
						};
						sendData.push(obj);
					}
				}
				// 把选中的节点id也放到sendData中
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.checkedFlowNodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var flowId = _step3.value;

					var _obj = {
						id: flowId,
						idtype: 2
					};
					sendData.push(_obj);
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			var _this = this;
			console.log(_typeof(_this.exeScope));
			var data = {
				debuground: _this.debugRound,
				sceneId: _this.sceneid,
				exeScope: _this.exeScope,
				selectState: +_this.exeScope === 1 ? "" : JSON.stringify(sendData)
			};

			$.ajax({
				url: address + 'executeController/scenedubug',
				data: data,
				type: 'post',
				dataType: 'json',
				success: function success(data, textStatux) {}
			});
		}
	}
});