'use strict';

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
		var inputs = event.target.parentNode.parentNode.parentNode.getElementsByClassName('check-case');
		let inputValue = []
		if(flag) {
			for(var input of inputs) {
				(!this.checkedFlowNodes.includes(+input.value))
				? (this.checkedFlowNodes.push(+input.value))
				: 1 
			}
			 // = [...this.checkedFlowNodes, ...inputValue]
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
	checkAllInScene (event) {
		var flag = event.target.checked
		var inputs = Array.from(event.target.parentNode.parentNode.querySelectorAll('input[type=checkbox]'))
		for(let input of inputs) {
			input.checked = flag
			flag === true 
				? Vac.pushNoRepeat(this.selectedSceneCases, input.value) 
				: this.selectedSceneCases.indexOf(input.value) >= 0 
					? this.selectedSceneCases.splice(this.selectedSceneCases.indexOf(input.value), 1)
					: 1
		}
		this.setBackground()
	},
	checkAllFlowNodes (event) {
		var _this = this
		let flag = event.target.checked
		let caseLibDiv = event.target.parentNode.parentNode.parentNode;
		let caseListDiv = caseLibDiv.parentNode.parentNode
		var inputs = Array.from(caseLibDiv.querySelectorAll('.check-case'))
		if( flag === true ) {
			// get all the flownodes in this flowcase
			for(let input of inputs) {
				Vac.pushNoRepeat(this.selectedSceneCases, input.value)
			}
			// get all the check-flownodes and if all the check-flownodes' value is in the selectedSceneCases,
			// then set the checkall-inscene true
			let checkFlowNodesInputs = Array.from(caseListDiv.querySelectorAll('.check-flownodes'))
			if(checkFlowNodesInputs.every((input) => { return this.selectedSceneCases.includes(input.value)})) {
				caseListDiv.querySelector('.checkall-inscene').checked = true
				_this.checkallSceneIds.push(+caseListDiv.querySelector('.checkall-inscene').value)
			}
			
		} else {
			for (let input of inputs) {
				this.selectedSceneCases.includes(input.value)
					? this.selectedSceneCases.splice(this.selectedSceneCases.indexOf(input.value), 1)
					: 1
			}
			let value = caseListDiv.querySelector('.checkall-inscene').value
			caseListDiv.querySelector('.checkall-inscene').checked = false
			let set = new Set(_this.checkallSceneIds)
			set.has(+value) ? set.delete(+value) : 1
			_this.checkallSceneIds = [...set]
		}

		caseLibDiv = null
		inputs = null
		caseListDiv = null
		this.setBackground()
	},
	checkFlowNode (event) {
		var _this = this
		let flag = event.target.checked
		let caseDiv = event.target.parentNode.parentNode
		let caseListDiv = caseDiv.parentNode.parentNode
		let caseId = caseDiv.parentNode.querySelector('.check-flownodes').value
		if(flag) {
			let inputs = [...caseDiv.querySelectorAll('.check-case')]
			if(inputs.every((input) => {return this.selectedSceneCases.includes(input.value)})) {
				Vac.pushNoRepeat(this.selectedSceneCases, caseId)
				let caseInputs = [...caseListDiv.querySelectorAll('.check-flownodes')]
				if(caseInputs.every((input) => {return this.selectedSceneCases.includes(input.value)})) {
					caseListDiv.querySelector('.checkall-inscene').checked = true
					_this.checkallSceneIds.push(+caseListDiv.querySelector('.checkall-inscene').value)
				} else {
					caseListDiv.querySelector('.checkall-inscene').checked = false
					let value = caseListDiv.querySelector('.checkall-inscene').value
					let set = new Set(_this.checkallSceneIds)
					set.has(+value) ? set.delete(+value) : 1
					_this.checkallSceneIds = [...set]
				}
			} else {
				if(this.selectedSceneCases.includes(caseId)){
					this.selectedSceneCases.splice(this.selectedSceneCases.indexOf(caseId), 1)
				}
				caseListDiv.querySelector('.checkall-inscene').checked = false
				let value = caseListDiv.querySelector('.checkall-inscene').value
				let set = new Set(_this.checkallSceneIds)
				set.has(+value) ? set.delete(+value) : 1
				_this.checkallSceneIds = [...set]
			}
			inputs = null
		} else {
			if(this.selectedSceneCases.includes(caseId)){
				this.selectedSceneCases.splice(this.selectedSceneCases.indexOf(caseId), 1)
			}
			caseListDiv.querySelector('.checkall-inscene').checked = false
			let value = caseListDiv.querySelector('.checkall-inscene').value
			let set = new Set(_this.checkallSceneIds)
			set.has(+value) ? set.delete(+value) : 1
			_this.checkallSceneIds = [...set]
		}
		caseListDiv = null
		caseDiv = null
		// console.log(_this.checkallSceneIds)
		this.setBackground()
	},
	setSelect (event){
		var _this = this;
		var target  = event.target;
		if(target.classList.contains('handle1') || target.classList.contains('handle')) {
			return
		}
		let container = document.querySelector('.main-content2')
		var fileNodes = document.querySelectorAll(".case .check-case");
		var startX = event.offsetX + Vac.getOffsetTo(event.target, container).offsetLeft
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
		container.appendChild(selDiv);
		selDiv.style.left = startX + "px";
		selDiv.style.top = startY + 'px';
		var _x = null;
		var _y = null;
		var moveAfterX = null;
		var moveAfterY = null;
		event.stopPropagation();
		event.preventDefault();
		var selectedRange = [];
		var moveFunction = mouseMoveFunction;
		container.addEventListener('mousemove', moveFunction, false);
		container.addEventListener('mouseup', (event) => {
			// this.isSelect = true;
			if (selDiv){
				container.removeChild(selDiv);
			}
			container.removeEventListener('mousemove', moveFunction, false);
			selDiv = null;
			
			for(let sceneid of _this.sceneIds) {
				if(_this.sceneCaseMap.get(sceneid).every( (value) => { 
					return _this.selectedSceneCases.includes(value)
				})) {
					Vac.pushNoRepeat(_this.checkallSceneIds, sceneid)
				} else {
					if(_this.checkallSceneIds.includes(sceneid)) {
						let set = new Set(_this.checkallSceneIds)
						set.delete(sceneid)
						_this.checkallSceneIds = [...set]
					}
				}
			}
			for (let caseId of _this.sceneCaseIds) {
				if(_this.flowNodesMap.get(caseId).every((value) => {
					return _this.selectedSceneCases.includes(value)
				})) {
					Vac.pushNoRepeat(_this.selectedSceneCases, caseId)
				} else {
					if(_this.selectedSceneCases.includes(caseId)) {
						let set = new Set(_this.selectedSceneCases)
						set.delete(caseId)
						_this.selectedSceneCases = [...set]
					}
				}
			}
		}, false);
		

		function mouseMoveFunction(event){
			if(selDiv.style.display == 'none'){
				selDiv.style.display = "block";
			}
			moveAfterX = event.pageX;
			moveAfterY = event.pageY;
			// 获取鼠标移动后的位置
			_x = startX - moveBeforeX + moveAfterX;
			_y = startY - moveBeforeY + moveAfterY;

			selDiv.style.left = Math.min(_x, startX) + "px";
			selDiv.style.top = Math.min(_y, startY) + "px";
			selDiv.style.width = Math.abs(_x - startX) + "px";
			selDiv.style.height  = Math.abs(_y - startY) + "px";

			var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
			var _r = selDiv.offsetWidth + _l, _b = selDiv.offsetHeight + _t;
			
			for(var i=0; i < fileNodes.length; i++){
				var inputLeft = Vac.getOffsetTo(fileNodes[i], container).offsetLeft;
				var inputTop = Vac.getOffsetTo(fileNodes[i], container).offsetTop;
				var inputRight = inputLeft + fileNodes[i].offsetWidth;
				var inputBottom = inputTop + fileNodes[i].offsetHeight;
				if (inputBottom < _b && inputTop > _t && inputLeft > _l && inputRight < _r) {
					// selectedRange.push(fileNodes[i]);
					Vac.pushNoRepeat(selectedRange, fileNodes[i]);
				}
			}
			for(var i=0; i<selectedRange.length; i++){
				var inputLeft = Vac.getOffsetTo(selectedRange[i], container).offsetLeft;
				var inputTop = Vac.getOffsetTo(selectedRange[i], container).offsetTop;
				var inputRight =  inputLeft + selectedRange[i].offsetWidth;
				var inputBottom = inputTop + selectedRange[i].offsetHeight;
				let value = selectedRange[i].value
				if( inputRight > _l && inputBottom > _t && inputLeft < _r && inputTop < _b) {
					if ($(selectedRange[i]).hasClass('single-case-incaselib')) {
						Vac.pushNoRepeat(_this.selectedCases, +value)
					} else if($(selectedRange[i]).hasClass('flow-node-incaselib')){
						Vac.pushNoRepeat(_this.checkedFlowNodes, +value)
					} else {
						Vac.pushNoRepeat(_this.selectedSceneCases, value)
					}
				} else {
					if ($(selectedRange[i]).hasClass('single-case-incaselib')) {
						let set = new Set(_this.selectedCases)
						set.delete(+value)
						_this.selectedCases = [...set]
					} else if($(selectedRange[i]).hasClass('flow-node-incaselib')){
						let set = new Set(_this.checkedFlowNodes)
						set.delete(+value)
						_this.checkedFlowNodes = [...set]
					} else {
						let set = new Set(_this.selectedSceneCases)
						set.delete(value)
						_this.selectedSceneCases = [...set]
					}
				}
				_this.setBackground()
			}
			event.stopPropagation();
			event.preventDefault();
		}
	},
	setSelectListener (){
		// document.querySelector('.main-content2').addEventListener('mousedown',Vac.throttle(this.setSelect, 1000, this),false);
		document.querySelector('.main-content2').addEventListener('mousedown',this.setSelect, false);
		// 防止点击用例框时也进行选取
		
		// var caseLibs = Array.from(document.querySelectorAll('.case-lib'))
		// console.log(caseLibs)
		// for(let caseLib of caseLibs) {
		// 	console.log(caseLib)
		// 	caseLib.addEventListener('mousedown', function(event){
		// 		console.log(event.target)
				
		// 	})
		// }
	}
};
var vBody = new Vue({
	el: '#v-body',
	data: {
		// tooltipMessage:'',
		caselibIds: [],
		caselibId: 3, // caselibId 
		executionround: '', // 执行轮次 
		recordflag: 2, // 记录单
		exeScope: null, // 执行范围
		selectState: '', // 选择状态

		// save the value obtained from back end and will set to the selects' options
		testphases: [],
		testrounds: [],
		// save the values which is selected by users and will be send to the back end
		testphaseValue: null,
		testroundValue: null,

		// the cases and scenes obtained from back end
		testCaseList: [],
		testSceneList: [],
		// save the value of input in the scene list
		checkallSceneIds: [],
		sceneIds: [], // save all sceneids		[2,3,4]
		sceneCaseMap: new Map(), // save the cases and flownodes in scene { sceneId: [caseid, flownodeid...]}
		sceneCaseIds: [], // only save the caseids in the form of 'sceneid-caseid' in scene ["29-27"]
		flowNodesMap: new Map(), // save the nodes in flowCase { caseId: [flownode, flownode...]}


		// get all the scenes when user click addScene
		allscenes: null,

		/***************** save data in scene list ************************/
		// selected Scene which is checked
		selectedScenes: [],
		selectedSceneCases: [],
		// selectedFlowNodes: [],

		/***************** save data in case list ************************/
		checkall: false,
		// save the selected cases in caselist
		selectedCases: [],
		// save the checked flow nodes in caselist
		checkedFlowNodes: [],
		// save the all case ids in caselist
		caseIds: [],
		// save the all flowNode ids in caselist
		flowNodeIds: new Map(),

		// Scenes in add-scene modal
		selectedScene: [], // 3, 1, 2, [1,2], [3],[{"sceneId":1,"testcaseList":[1,2]}]
		exeImgs: {
			0: '/assets/images/waiting.png',
			1: '/assets/images/success.png',
			2: '/assets/images/failed.png',
			3: '/assets/images/warn.png',
			4: '/assets/images/running.gif'
		},
		// 批量执行相关
		hasStartExecute: false,
		batchExecuteNo: null,
		executeResult: 'fail',
		queryResultFun: null,
		queryInterval: 1000,
		reQueryInterval: 2,
		queryNums: 0,

		// save the string : 展开 and 收起
		expandString: '展开',
		unexpandString: '收起'

	},
	created: function created() {
		var _this = this;
		// get testphases
		var getPhasePro = new Promise(function (resolve, reject) {
			$.ajax({
				url: address + 'testphaseController/selectAll',
				data: '',
				type: 'GET',
				dataType: 'json',
				success: function success(data, statusTest) {
					if (data.success == true) {
						_this.testphases = data.obj;
						if (_this.testphases[0]) {
							_this.testphaseValue = _this.testphases[0].phasename;
							resolve();
						}
					} else {
						Vac.alert('查询用例失败！');
					}
				},
				error: function error() {
					Vac.alert('查询用例出错！');
				}
			});
		});
		var getRoundPro = new Promise(function (resolve, reject) {
			$.ajax({
				url: address + 'testroundController/selectAll',
				data: '',
				type: 'get',
				dataType: 'json',
				success: function success(data, statusText) {
					if (data.success == true) {
						_this.testrounds = data.obj;
						if (_this.testrounds[0]) {
							_this.testroundValue = _this.testrounds[0].id;
							resolve();
						} else {
							Vac.alert('查询用例失败！');
						}
					}
				},
				error: function error() {
					Vac.alert('查询用例出错！');
				}
			});
		});
		var getCaseId = new Promise(function (resolve, reject) {
			_this.caselibId = sessionStorage.getItem('caselibid');
			resolve();
		});

		Promise.all([getPhasePro, getRoundPro, getCaseId]).then(function () {
			_this.getCases();
		}).catch(function () {
			console.log("测试计划及测试轮次数据不全");
		});
		// init the modal 
		$('#add-modal').on('hidden.bs.modal', function (e) {
			var scenes = _this.selectedScene;
			for (var i = 0, len = scenes.length; i < len; i++) {
				scenes.shift();
			}
		});
		// let result = Vac.isAncestor(document.querySelector('html'), document.querySelector('body'))
		// console.log(result)
	},
	ready: function ready() {
		// console.log("ready")
		this.setSelectListener();
		this.setDraggable();

		$('.3').addClass('open');
		$('.3 .arrow').addClass('open');
		$('.3-ul').css({ display: 'block' });
		$('.3-6').css({ color: '#ff6c60' });
	},
	// updated: function(){
	// 	console.log("updated")
	// 	this.setSelectListener()
	// },
	watch: {
		"selectedCases": function selectedCases(value, oldVal) {
			this.checkall = value.length === this.caseIds.length;
			this.setBackground();
		},
		"checkedFlowNodes": function checkedFlowNodes(value, oldVal) {
			var _this2 = this;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.flowNodeIds.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					if (this.flowNodeIds.get(key).every(function (value) {
						return _this2.checkedFlowNodes.includes(value);
					})) {
						Vac.pushNoRepeat(this.selectedCases, +key);
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
		hideAlert: function hideAlert() {
			this.alertShow = false;
		},
		executeAll: function executeAll() {
			// 20180117154254295845
			// 20180117153441839537
			var _this = this;
			var data = {
				executionround: this.executionround,
				recordflag: this.recordflag,
				exeScope: this.exeScope,
				selectState: this.selectState,
				caselibId: this.caselibId,
				testPhase: this.testphaseValue,
				testRound: this.testroundValue
			};
			$.ajax({
				url: address + 'executeController/t1',
				data: data,
				type: 'post',
				dataType: 'json',
				success: function success(data, statusText) {
					if (data.success === true) {
						_this.startQueryResult(data.msg);
					} else {
						Vac.alert('执行失败！');
					}
				},
				error: function error() {
					Vac.alert('执行失败！');
				}
			});
			// 2,2,3,q,2,1,''
		},
		startQueryResult: function startQueryResult(batchExecuteNo) {
			var me = this;
			this.batchExecuteNo = batchExecuteNo;
			this.hasStartExecute = true;
			this.queryResultFun = setTimeout(queryAction, this.queryInterval);

			function queryAction() {
				$.ajax({
					url: address + 'testrecordController/selectByBatchExecuteNo',
					type: 'post',
					data: { batchExecuteNo: batchExecuteNo },
					success: function success(data) {
						if (data.success) {
							me.setResultIcon(data.obj);
							if (data.finished) {
								// 执行完毕
								me.hasStartExecute = false;
								me.batchExecuteNo = null;
								me.queryResultFun = null;
								Vac.alert('执行完毕！');
							} else {
								// 未执行完毕
								me.queryResultFun = setTimeout(queryAction, me.queryInterval);
							}
						} else {
							Vac.alert('查询出错！请点击重新查询！');
							// me.queryResultFun = setTimeout(queryAction, me.reQueryInterval);
						}
					},
					error: function error() {
						Vac.alert('网络错误！请点击重新查询！');
						// Vac.alert('查询执行结果失败，将在'+ me.reQueryInterval + '毫秒后继续查询');
						// me.queryResultFun = setTimeout(queryAction, me.reQueryInterval);
					}
				});
			}
		},
		reQuery: function reQuery() {
			this.batchExecuteNo && this.startQueryResult(this.batchExecuteNo);
		},
		setResultIcon: function setResultIcon(data) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var d = _step2.value;

					if (d.sourcechannel === 'PE4') {
						if (d.flownodeid) {
							document.querySelector('#img-' + d.flownodeid).src = this.exeImgs[d.resultstatus];
						} else {
							document.querySelector('#img-' + d.caseid).src = this.exeImgs[d.resultstatus];
						}
					} else {
						if (d.flownodeid) {
							document.querySelector('#img-' + d.sceneId + '-' + d.caseid + '-' + d.flownodeid).src = this.exeImgs[d.resultstatus];
						} else {
							document.querySelector('#img-' + d.sceneId + '-' + d.caseid).src = this.exeImgs[d.resultstatus];
						}
					}
				}
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
		},
		addScene: function addScene() {
			var _this = this;

			$.ajax({
				url: address + 'sceneController/selectBycaseLibId',
				data: 'caseLibId=' + this.caselibId,
				dataType: 'json',
				type: 'post',
				success: function success(data, statusText) {
					if (data.success == true) {
						_this.allscenes = data.obj;
						$('#add-modal').modal('show');
					}
				}
			});
			$('#add-modal').modal("show");
		},
		removeSceneAndCase: function removeSceneAndCase() {
			var _this3 = this;

			var _this = this;
			var sceneList = this.selectedScenes.length === 0 ? '' : JSON.stringify(this.selectedScenes);
			var testcaseList = this.selectedCases.length === 0 ? '' : JSON.stringify(this.selectedCases);
			var sceneCaseList = new Array();
			var o = {};
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.selectedSceneCases[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var sceneCase = _step3.value;

					var arr = sceneCase.split('-');
					if (arr.length !== 2) {
						continue;
					}
					o[arr[0]] ? o[arr[0]].push(+arr[1]) : o[arr[0]] = [+arr[1]];
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

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = Object.keys(o)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var key = _step4.value;

					sceneCaseList.push({
						sceneId: +key,
						testcaseList: o[key].length === 0 ? '' : o[key]
					});
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			sceneCaseList = sceneCaseList.length === 0 ? '' : JSON.stringify(sceneCaseList);
			// 
			if (!sceneCaseList.length && !sceneList.length && !testcaseList.length) {
				Vac.alert('请至少选择一项进行删除');
				return;
			}
			Vac.confirm('', '', '', '确认要移除场景和用例吗？').then(function () {

				var data = {
					removeFlag: 1,
					caselibId: _this3.caselibId,
					testPhase: _this3.testphaseValue,
					testRound: _this3.testroundValue,
					sceneList: sceneList,
					testcaseList: testcaseList,
					sceneCaseList: sceneCaseList
				};
				$.ajax({
					url: address + 'testexecutioninstanceController/delete',
					data: data,
					type: 'post',
					dataType: 'json',
					success: function success(data, statusText) {
						if (data.success) {
							$('#add-modal').modal('hide');
							Vac.alert('移除成功');
							_this.getCases();
						} else {
							Vac.alert("移除失败");
						}
					}
				});
			}, function () {});
		},
		sendSceneData: function sendSceneData() {
			var _this = this;
			var data = {
				caselibId: this.caselibId,
				testPhase: this.testphaseValue,
				testRound: this.testroundValue,
				testcaseList: '', // 暂时为空   [1,2]
				sceneList: '[' + this.selectedScene.toString() + ']', // [3]
				scenecaseList: '' //  暂时为空 [{"sceneId":1,"testcaseList":[1,2]}]
			};
			// send data and display the modal 
			$.ajax({
				url: address + 'testexecutioninstanceController/insert',
				// url: 'api/testexecution.json',
				data: data,
				type: 'post',
				dataType: 'json',
				success: function success(data, statusText) {
					if (data.success) {
						$('#add-modal').modal('hide');
						Vac.alert('添加成功');
						_this.getCases();
						// _this.alertShow = true;
						// _this.tooltipMessage = '添加成功';
					} else {
						Vac.alert("添加失败");
					}
				},
				error: function error() {
					Vac.alert("添加失败");
				}
			});
		},
		selectAll: function selectAll(event) {
			var _this4 = this;

			if (event.target.checked) {
				this.allscenes.forEach(function (scene) {
					if (!_this4.selectedScene.includes(scene.sceneId)) {
						_this4.selectedScene.push(scene.sceneId);
					}
				});
			} else {
				this.allscenes.forEach(function (scene) {
					_this4.selectedScene.pop();
				});
			}
		},
		setDraggable: function setDraggable() {
			$('#sortable_caselist').sortable({
				handle: '.handle'
			});
			$("#sortable_caselist").disableSelection();

			$('.sortable_scene_caselist').sortable({
				handle: '.handle1'
			});
			$('.sortable_scene_caselist').disableSelection();
			$('#testround-main').disableSelection();
		},
		getCases: function getCases() {
			var data = {
				caselibId: this.caselibId,
				testPhase: this.testphaseValue,
				testRound: this.testroundValue,
				roundFlag: 2,
				scopeFlag: 1
			};
			var _this = this;
			$.ajax({
				url: address + 'testexecutioninstanceController/textexecutioninstancequery',
				type: 'post',
				data: data,
				dataType: 'json',
				success: function success(data, statusText) {
					_this.testCaseList = data.testCaseList;
					_this.testSceneList = data.testSceneList;

					if (!(data.testCaseList && data.testCaseList.length)) {
						// Vac.alert('未查询到相关的用例信息！')
					}
					if (!(data.testSceneList && data.testSceneList.length)) {
						// Vac.alert('未查询到相关的场景信息！')
					}
					_this.caseIds.length = 0;
					_this.flowNodeIds.clear();
					_this.testCaseList.forEach(function (value) {
						Vac.pushNoRepeat(_this.caseIds, value.caseId);
						if (value.caseCompositeType == 2) {
							var arr = [];
							var _iteratorNormalCompletion5 = true;
							var _didIteratorError5 = false;
							var _iteratorError5 = undefined;

							try {
								for (var _iterator5 = value.flowNodes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
									var flowNode = _step5.value;

									arr.push(+flowNode.flowNodeId);
								}
							} catch (err) {
								_didIteratorError5 = true;
								_iteratorError5 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion5 && _iterator5.return) {
										_iterator5.return();
									}
								} finally {
									if (_didIteratorError5) {
										throw _iteratorError5;
									}
								}
							}

							_this.flowNodeIds.set(+value.caseId, arr);
						}
					});

					_this.sceneIds.length = [];
					_this.sceneCaseMap.clear();
					_this.flowNodesMap.clear();
					if (_this.testSceneList) {
						for (var j = 0; j < _this.testSceneList.length; j++) {
							var scene = _this.testSceneList[j];
							// sceneIds save the id of scene  [4,5,6]
							_this.sceneIds.push(scene.sceneId);
							var caselist = [];
							for (var i = 0; i < scene.testCaseList.length; i++) {
								var c = scene.testCaseList[i];
								// caselist save the caseid in the form of  'sceneId-caseId' ['3-45','3-56']
								caselist.push(scene.sceneId + '-' + c.caseId);

								if (c.caseCompositeType == 2) {
									_this.sceneCaseIds.push(scene.sceneId + '-' + c.caseId);
									var flowNodes = [];
									var _iteratorNormalCompletion6 = true;
									var _didIteratorError6 = false;
									var _iteratorError6 = undefined;

									try {
										for (var _iterator6 = c.flowNodes[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
											var flowNode = _step6.value;

											// caselist also save the flowNodeId in flowCase in the form of 
											//  'sceneId-caseId-flowNodeId' ['3-45-34','3-56-55']
											caselist.push(scene.sceneId + '-' + c.caseId + '-' + flowNode.flowNodeId);
											flowNodes.push(scene.sceneId + '-' + c.caseId + '-' + flowNode.flowNodeId);
										}
										// flowNodesMap save the map of caseId between flowNodes in the following form
										// {
										//  	'sceneId-caseId':  [ sceneId-caseId-flowNodeId,  sceneId-caseId-flowNodeId ]
										// }
									} catch (err) {
										_didIteratorError6 = true;
										_iteratorError6 = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion6 && _iterator6.return) {
												_iterator6.return();
											}
										} finally {
											if (_didIteratorError6) {
												throw _iteratorError6;
											}
										}
									}

									_this.flowNodesMap.set(scene.sceneId + '-' + c.caseId, flowNodes);
								}
							}
							// sceneCaseMap save the map of sceneId between flowNodeId and caseId in the following form
							// {
							//  	'sceneId':  [ sceneId-caseId, sceneId-caseId-flowNodeId ]
							// }
							_this.sceneCaseMap.set(scene.sceneId, caselist);
						}
					}
					Vue.nextTick(function () {
						_this.setDraggable();
					});
				}
			});
		},
		hideCaseList: function hideCaseList(event) {
			var _this = this;
			var el = $('.case-list', $(event.currentTarget).parent())[0];
			var curHeight = el.offsetHeight;
			el.style.height = curHeight + 'px';
			if ($(event.currentTarget).find('span').html() == _this.unexpandString) {
				// unexpandString 收起
				$(event.currentTarget).find('i').removeClass('icon-caret-down').addClass('icon-caret-right');
				el.style.height = '0px';
				$(event.currentTarget).find('span').html(_this.expandString);
			} else {
				$(event.currentTarget).find('i').removeClass('icon-caret-right').addClass('icon-caret-down');
				el.style.height = 'auto';
				var curHeight = el.offsetHeight; // 展开
				el.style.height = '0px';
				window.requestAnimationFrame(function () {
					el.style.height = curHeight + 'px';
				});
				$(event.currentTarget).find('span').html(_this.unexpandString);
			}
			event.stopPropagation();
		},
		changeCase: function changeCase(id, type) {
			var _this5 = this;

			var arr = void 0;
			switch (type) {
				case 1:
					arr = this.selectedCases;
					break;
				case 2:
					arr = this.checkedFlowNodes;
					break;
				case 3:
					arr = this.selectedSceneCases;
					break;
			}
			console.log(id);
			var index = arr.findIndex(function (value) {
				return value === id;
			});
			index !== -1 ? arr.splice(index, 1) : arr.push(id);
			// 如果选中的是flowNode
			// console.log('sceneCaseIds' + this.sceneCaseIds)
			// console.log('flowNodesMap'+ this.flowNodesMap)
			// console.log('sceneCaseMap'+ this.sceneCaseMap.keys())
			var idArr = (id + '').split('-');
			if (idArr.length === 3) {
				var sceneCaseId = idArr.slice(0, 2).join('-');
				var caseList = this.flowNodesMap.get(sceneCaseId);
				if (caseList.every(function (value) {
					return _this5.selectedSceneCases.includes(value);
				})) {
					Vac.pushNoRepeat(this.selectedSceneCases, sceneCaseId);
				} else {
					var set = new Set(this.selectedSceneCases);
					set.delete(sceneCaseId);
					this.selectedSceneCases = [].concat(_toConsumableArray(set));
				}
			}
			if (type === 3) {
				var sceneId = idArr[0];
				var caseIds = this.sceneCaseMap.get(+sceneId);
				if (caseIds.every(function (value) {
					return _this5.selectedSceneCases.includes(value);
				})) {
					this.checkallSceneIds.push(+sceneId);
				} else {
					var _set = new Set(this.checkallSceneIds);
					_set.delete(+sceneId);
					this.checkallSceneIds = [].concat(_toConsumableArray(_set));
				}
			}
			this.setBackground(this.selectedSceneCases);
		},
		viewCase: function viewCase(sceneId, caseid, sourcechannel) {
			var o = {
				sceneId: sceneId, caseid: caseid,
				testPhase: this.testphaseValue,
				testRound: this.testroundValue,
				// executeround: this.executionround,
				sourcechannel: sourcechannel,
				recorderStatus: '2'
			};
			var args = encodeURIComponent(JSON.stringify(o));
			window.open('case-operation.html?activeName=exec-record&viewcaseargs=' + args, 'case_record');
		},
		setBackground: checkFunction.setBackground,
		checkChanged: checkFunction.checkChanged,
		checkallToggle: checkFunction.checkallToggle,
		checkallBox: checkFunction.checkallBox,

		checkAllInScene: checkFunction.checkAllInScene,
		checkAllFlowNodes: checkFunction.checkAllFlowNodes,
		checkFlowNode: checkFunction.checkFlowNode,
		setSelect: checkFunction.setSelect,
		setSelectListener: checkFunction.setSelectListener
	}
});