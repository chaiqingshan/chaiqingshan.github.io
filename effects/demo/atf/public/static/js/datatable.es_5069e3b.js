'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// 查看脚本
// document.getElementById('viewScript').onclick = function () {
var tooltipwindow;
function viewScript(event) {
	var testcaseId = event.target.getAttribute('data-id');
	var data = { testcaseId: testcaseId
	};

	$.ajax({
		url: address + 'antlr/getTestcaseScript',
		data: data,
		type: 'post',
		dataType: 'json',
		success: function success(data, statusText) {
			tooltipwindow.flag = false;
			if (!data.success) {
				Vac.alert(data.msg || '查询失败');
				return;
			}
			tooltipwindow.data = data.obj;
		},
		error: function error(XMLHttpRequest, textStatus, errorThrown) {
			Vac.alert('\u67E5\u8BE2\u51FA\u9519\uFF01\n \u9519\u8BEF\u4FE1\u606F\uFF1A' + textStatus);
		}
	});
}
$(document).ready(function () {
	$('.3').addClass('open');
	$('.3 .arrow').addClass('open');
	$('.3-ul').css({ display: 'block' });
	$('.3-3').css({ color: '#ff6c60' });
	// var submenuHeight = document.querySelector('#submenu').offsetHeight;
	// document.querySelector('#submenu').children[0].style.height = submenuHeight / 2 + 'px';
	// document.querySelector('#submenu').children[1].style.height = submenuHeight / 2 + 'px';
	var transid = '',
	    autId = '';
	tooltipwindow = new Vue({
		el: '#tooltipwindow',
		data: {
			flag: true,
			data: [],
			scriptSelected: false,
			testPoint: '',
			executor: 79,
			caselibId: 14,
			autId: 33,
			transId: 80,
			scriptId: 1193
		},
		methods: {
			toggle: function toggle() {
				this.flag = !this.flag;
			}
		}
	});
	(function () {
		var editDataVue = new Vue({
			el: '#editData',
			data: {
				dataType: 4,
				isShow: false,
				insertTitle: null,
				insertType: null,
				isInsertDivShow: true, //
				selection: null,
				autId: null,
				transactId: null,
				beforeOperationRows: [],
				afterOperationRows: [],
				parameterVue: null,
				beforeStr: '',
				afterStr: '',
				// ztree的设置项
				zTreeSettings: {
					uiAndElement: {
						callback: {},
						data: {
							simpleData: {
								enable: true,
								idKey: 'id',
								pIdKey: 'parentid',
								rootPId: 0
							}
						}
					},
					functions: {
						callback: {},
						data: {
							key: {
								name: "mname"
							},
							simpleData: {
								enable: true,
								idKey: 'methodid',
								pIdKey: 'parentid',
								rootPId: 0
							}
						}
					}
				},
				zTreeSettings2: {
					uiAndElement: {
						callback: {},
						data: {
							simpleData: {
								enable: true,
								idKey: 'id',
								pIdKey: 'parentid',
								rootPId: 0
							}
						},
						check: {
							enable: true,
							hkStyle: "checkbox",
							chkboxType: { "Y": "ps", "N": "ps" }
						}
					},
					functions: {
						callback: {},
						data: {
							key: {
								name: "mname"
							},
							simpleData: {
								enable: true,
								idKey: 'methodid',
								pIdKey: 'parentid',
								rootPId: 0
							}
						},
						check: {
							enable: true,
							hkStyle: "checkbox",
							chkboxType: { "Y": "ps", "N": "ps" }
						}
					}
				},
				uiOrFunctions: {
					changed: false, // 模态框出现后是否点击过，如果点击过，在模态框点击保存时才会进行更改
					type: 'ui', // 保存最后点击的是UI还是函数集，据此来确定不同的后续执行行为
					ui: '', // 保存点击的ui
					element: '', // 保存点击的元素
					classType: '', // 保存点击的元素类型
					function: '', // 保存点击的函数集中的项
					target: null, // 保存点击编辑的target，据此可以获得parent tr
					table: 1 // 保存当前操作的是前置操作还是后置操作
				}
			},
			created: function created() {},
			ready: function ready() {
				this.autId = sessionStorage.getItem('autId');
				this.transactId = sessionStorage.getItem('transactId');
				var _this = this;
				this.zTreeSettings.uiAndElement.callback.onClick = this.zTreeOnClick;
				this.zTreeSettings.functions.callback.onClick = this.zTreeOnClick;
				// 设置table可以拖拽行
				$(function () {
					$("#sortable").sortable({
						stop: function stop(event, ui) {
							if (+(ui.item[0].rowIndex - 1) === +ui.item[0].getAttribute('data-index')) {
								return;
							}
							// 拖拽停止后，改变绑定的数组中元素的顺序
							var target = ui.item[0].rowIndex - 1;
							console.log(target);
							var start = ui.item[0].getAttribute('data-index');
							// console.log(`target: ${target} -- start: ${start}--end: ${end}`)
							if (target < 0) {
								_this.beforeOperationRows.unshift(_this.beforeOperationRows.splice(start, 1)[0]);
							} else {
								_this.beforeOperationRows.splice(target, 0, _this.beforeOperationRows.splice(start, 1)[0]);
							}
						}
					});
					$("#sortable").disableSelection();
					$("#sortable2").sortable({
						stop: function stop(event, ui) {
							if (+(ui.item[0].rowIndex - 1) === +ui.item[0].getAttribute('data-index')) {
								return;
							}
							// 拖拽停止后，改变绑定的数组中元素的顺序
							var target = ui.item[0].rowIndex - 1;
							var start = ui.item[0].getAttribute('data-index');
							// console.log(`target: ${target} -- start: ${start}--end: ${end}`)
							if (target < 0) {
								_this.afterOperationRows.unshift(_this.afterOperationRows.splice(start, 1)[0]);
							} else {
								_this.afterOperationRows.splice(target, 0, _this.afterOperationRows.splice(start, 1)[0]);
							}
						}
					});
					$("#sortable2").disableSelection();
				});
			},
			methods: {
				hide: function hide() {
					this.isShow = false;insertDivVue.isShow = false;
				},
				show: function show(selection) {
					this.selection = selection;
					this.isShow = true;
					this.beforeOperationRows = [];
					this.afterOperationRows = [];
					document.getElementById("input1").value = '';
					document.getElementById("input4").value = '';
					var cellData = $.trim(handsontable.getDataAtCell(this.selection.start.row, this.selection.start.col));

					this.beforeOperationRows = [];
					this.afterOperationRows = [];
					if (cellData.includes('@before')) {
						var beforeStr = cellData.slice(cellData.indexOf('@before\n') + 7, cellData.indexOf('@value'));
						var beforeArr = beforeStr.split(';\n');
						this.parseScript(beforeArr, this.beforeOperationRows, 1);
					}
					if (cellData.includes('@after')) {
						var afterStr = cellData.slice(cellData.indexOf('@after\n') + 6);
						var afterArr = afterStr.split(';\n');
						this.parseScript(afterArr, this.afterOperationRows, 2);
					}
					var valueStr;
					if (cellData.includes('@value')) {
						var endIndex = cellData.includes('@after') ? cellData.indexOf('@after') : cellData.length;
						valueStr = cellData.slice(cellData.indexOf('@value') + 6, endIndex).replace(/^\s$/g, '');
					} else {
						valueStr = cellData;
					}
					if (valueStr.replace(/^\s$/g, '') == '') {
						editDataVue.dataType = 3;
					} else if (valueStr.replace(/^\s$/g, '') == 'nil') {
						editDataVue.dataType = 2;
					} else if (valueStr.includes('{expr=')) {
						editDataVue.dataType = 4;
						var str = valueStr.split('{expr=')[1];
						var value = str.slice(0, str.indexOf('}'));
						$('#input4').val(value);
					} else {
						editDataVue.dataType = 1;
						$('#input1').val(valueStr);
					}
					// if(cellData.startsWith('@before')) {
					// 	// 表达式
					// 	editDataVue.dataType = 4;
					// 	var beforeStr = cellData.slice(cellData.indexOf('@before\n') + 7, cellData.indexOf('@value'));
					// 	var valueStr = cellData.slice(cellData.indexOf('@value') + 5, cellData.indexOf('@after'));
					// 	var afterStr = cellData.slice(cellData.indexOf('@after\n') + 6);
					// 	// 前置操作
					// 	// var beforeArr = beforeStr.includes('UI("') ? beforeStr.slice(beforeStr.indexOf('UI("')).split(';') : [];
					// 	var beforeArr = beforeStr.split(';\n');
					// 	console.log('beforeArr-->'+beforeArr.length)
					// 	this.parseScript(beforeArr, this.beforeOperationRows, 1)

					// 	var afterArr = afterStr.split(';\n');
					// 	console.log('afterArr-->'+afterArr.length)
					// 	this.parseScript(afterArr, this.afterOperationRows, 2);

					// 	let str = valueStr.split('{expr=')[1]
					// 	var value = str.slice(0, str.indexOf('}'));
					// 	$('#input4').val(value);
					// } else if( cellData != '' && cellData != 'nil'){
					// 	editDataVue.dataType = 1;
					// 	$('#input1').val(cellData);
					// } else if( cellData == 'nil') {
					// 	editDataVue.dataType = 2;
					// } else {
					// 	editDataVue.dataType = 3;
					// }
				},
				parseScript: function parseScript(strArray, operationRows, type) {
					var length = type === 1 ? strArray.length - 1 : strArray.length;
					if (strArray.length) {
						for (var i = 0; i < length; i++) {
							if (!strArray[i].length) return;
							// @before\nUI('aa').WebElement('bb').click('a','b','c');UI('a2').WebElement('b2').click('a','b','c');\n@value\n{expr= }\n@after\nUI('aa').WebElement('bb').click('a','b','c');UI('a2').WebElement('b2').click('a','b','c');
							if (strArray[i].includes('UI(')) {
								var script = strArray[i].split(').');
								var operation = {};
								var arr = script[1].split('(');
								// UI('aa'  --> aa
								operation.ui = script[0].slice(script[0].indexOf('UI(') + 4, -1);
								// WebElement('bb' --> WebElement  &  bb
								operation.classType = arr[0];
								operation.element = arr[1].slice(1, -1);
								// click('a','b','c') --> click
								var functions = [];
								functions.push({ name: script[2].slice(0, script[2].indexOf('(')), parameterlist: '' });
								// click('a','b','c') --> 'a','b','c' --> ['a', 'b', 'c'] --> parameters: [{ Name: 'para1', Value: 'a' }]
								var paraArr = script[2].slice(script[2].indexOf('(') + 1, -1).split(',');
								var parameters = [];
								for (var j = 0; j < paraArr.length; j++) {
									var o = {};
									o.Name = 'para' + (j + 1);
									o.Value = paraArr[j].slice(1, -1);
									parameters.push(o);
								}
							} else {
								var operation = {};
								operation.ui = '';
								operation.classType = '';
								operation.element = '';
								var index = strArray[i].indexOf('(');
								var functions = [{ name: strArray[i].slice(0, index), parameterlist: '' }];
								var paraStr = strArray[i].slice(index + 1, -1);
								var parameters = [];
								var paraArr = paraStr.split(',');
								for (var _j = 0; _j < paraArr.length; _j++) {
									var o = {};
									o.Name = 'para' + (_j + 1);
									o.Value = paraArr[_j].slice(1, -1);
									parameters.push(o);
								}
							}

							operationRows.push({
								id: Symbol(),
								operation: operation,
								functions: functions,
								parameters: parameters
							});
						}
					}
				},
				insert: function insert(type, title) {
					insertDivVue.show(type, title);
				},
				saveEditData: function saveEditData() {
					var inputValue = ['', '', ''];
					var inputStr = document.getElementById("input" + this.dataType).value;
					var beforeStr = this.saveOperation(null, 1);
					var afterStr = this.saveOperation(null, 2);
					if (beforeStr.length) {
						inputValue[0] = '@before\n' + beforeStr + '\n';
						inputValue[1] = '@value\n';
					}
					if (afterStr.length) {
						inputValue[2] = '@after\n' + afterStr;
						inputValue[1] = '@value\n';
					}
					if (this.dataType == 1) {
						inputValue[1] += inputStr + '\n';
					} else if (this.dataType == 2) {
						inputValue[1] += 'nil\n';
					} else if (this.dataType == 3) {
						inputValue[1] += '\n';
					} else {
						inputValue[1] += '{expr=' + inputStr + '}\n';
					}
					inputValue = inputValue.join('');
					handsontable.setDataAtCell(this.selection.start.row, this.selection.start.col, inputValue);
					handsontable.render();
				},
				addRow: function addRow(type) {
					var s = { id: Symbol(), operation: { element: '', ui: '', classType: '' }, functions: [], parameters: [] };
					type === 1 ? this.beforeOperationRows.push(s) : this.afterOperationRows.push(s);
				},
				insertRow: function insertRow(index, type) {
					var s = { id: Symbol(), operation: { element: '', ui: '', classType: '' }, functions: [], parameters: [] };
					type === 1 ? this.beforeOperationRows.splice(+index + 1, 0, s) : this.afterOperationRows.splice(+index + 1, 0, s);
				},
				deleteRow: function deleteRow(index, type) {
					var operationRows = type === 1 ? this.beforeOperationRows : this.afterOperationRows;
					var pro = Vac.confirm('', '', '', '确认要删除吗？');
					pro.then(function () {
						operationRows.splice(index, 1);
					}, function () {});
				},
				// 显示UI和元素 、函数集
				showUiAndElement: function showUiAndElement(event, type) {
					var _this = this;
					this.uiOrFunctions.target = event.target;
					this.uiOrFunctions.changed = false;
					this.uiOrFunctions.table = type;
					// var dataT = {
					// 	transid: transid
					// }
					// 请求Ui和Elment
					this.getUIAndFunctions(1);

					$('#ui-ele-modal').modal('show');
				},
				showUiAndElement2: function showUiAndElement2(event, type) {
					this.uiOrFunctions.table = type;
					this.getUIAndFunctions(2);
					$('#ui-ele-modal2').modal('show');
				},
				getUIAndFunctions: function getUIAndFunctions(type) {
					var str = +type === 1 ? '' : 2;
					var setting = +type === 1 ? this.zTreeSettings : this.zTreeSettings2;
					$.ajax({
						url: address + 'elementlibraryController/showUIandElementforScript',
						data: 'transid=' + transid,
						type: 'post',
						dataType: 'json',
						success: function success(data, statusText) {
							if (data && data.success === true && data.obj instanceof Array) {
								var ztreeUI = $.fn.zTree.init($('#ui-element-ul' + str), setting.uiAndElement, data.obj);
								ztreeUI.expandAll(true);
								// var da = [{ "id": 1, "parentid": 0, "name": "ui-chai" }, { "id": 2, "parentid": 1, "name": "ele-chai", "classType": 'webedit' }]
							}
						}
					});
					// 请求函数集
					// var autId = $("#autSelect").val();
					$.ajax({
						url: address + 'autController/selectFunctionSet',
						data: { 'id': sessionStorage.getItem('autId') },
						type: 'post',
						dataType: 'json',
						success: function success(data, statusText) {
							if (data.success && data.obj) {
								var ztreeFunc = $.fn.zTree.init($('#functions-ul' + str), setting.functions, data.obj);
								ztreeFunc.expandAll(true);
							} else {
								// Vac.alert('');
							}
						}
					});
				},
				// 确定ztree的点击事件
				zTreeOnClick: function zTreeOnClick(event, treeId, treeNode) {
					if (treeNode.isParent) {
						return; // 如果点击了父节点，则返回
					}
					// 判断树结构是ui还是函数集
					if (treeId === 'ui-element-ul') {
						var parent = treeNode.getParentNode();
						if (!parent) {
							return; // 没有父元素，则返回
						}
						this.uiOrFunctions.type = 'ui';
						this.uiOrFunctions.element = treeNode.name;
						this.uiOrFunctions.ui = parent.name;
						this.uiOrFunctions.classType = treeNode.classType;
					} else {
						this.uiOrFunctions.type = 'function';
						// 获取节点的全部内容
						this.uiOrFunctions.function = { name: treeNode.mname, parameterlist: treeNode.arguments };
					}
					this.uiOrFunctions.changed = true; // 已经在模态框中点击了树节点
				},
				// 编辑参数方法，出现模态框，进行函数的编辑
				editParameter: function editParameter(event, type) {
					// var _this = this
					// // 保存当前点击行，行索引值以及当前需要操作的table所绑定的数组
					// var parentRow = $(event.target).parents('tr')
					// var index = parentRow.attr('data-index');
					// var operationRows = type === 1 ? _this.beforeOperationRows : _this.afterOperationRows;
					var _this = this;
					// 保存当前点击行，行索引值以及当前需要操作的table所绑定的数组
					var target = event.target;
					target.style.visibility = 'hidden';
					var parent = $(target).parent()[0];
					$('.param-table', parent).css({ 'display': 'table' });
					$('.param-show', parent).css({ 'display': 'none' });
					var paramV = $('.param-value', parent)[0];
					if (!paramV) {
						return;
					}
					paramV.focus();
					var range = document.createRange();
					var sel = window.getSelection();
					range.setStart(paramV.childNodes[0], paramV.innerHTML.length);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				},
				cancelEditParam: function cancelEditParam(event, type) {
					var operationRows = type === 1 ? this.beforeOperationRows : this.afterOperationRows;
					var table = $(event.target).parents('.param-table');
					// var index = table.parents('tr').attr('data-index')
					$('.edit-param', table.parents('tr')).css({ 'visibility': 'visible' });
					$('.param-show', table.parents('tr')).css({ 'display': 'block' });
					table.css({ display: 'none' });
					// this.updateRow(operationRows, index)
				},
				saveParam: function saveParam(event, type) {
					// var tbody = $(event.target).parent().parent().parent()
					var operationRows = type === 1 ? this.beforeOperationRows : this.afterOperationRows;
					var target = $(event.target);
					var tbody = target.parents('.param-table');
					var trs = [].concat(_toConsumableArray($('.param-row', tbody)));
					var parentRow = target.parents('table').parents('tr');
					var valueShows = $('.param-value-show', parentRow);
					operationRows[parentRow.attr('data-index')].parameters.length = 0;
					trs.forEach(function (row, index) {
						// parameters:[{Name:'', Value: ''}]
						// console.log(row.querySelector('.param-value').innerHTML)
						var data = {};
						data.Name = row.querySelector('.param-name').innerHTML;
						data.Value = row.querySelector('.param-value').innerHTML;
						valueShows[index].innerHTML = data.Value;
						operationRows[parentRow.attr('data-index')].parameters.push(data);
					});
					this.cancelEditParam(event, type);
				},
				// remove the row who is checked when 
				removeRow: function removeRow(event, type) {
					var _this2 = this;

					var parent = $(event.target).closest('.operation-wrapper');
					var trs = parent.find("tbody input[type='checkbox']:checked").closest('tr');
					if (!trs.length) return;
					Vac.confirm('', '', '', '确认要删除选中项吗？').then(function () {
						var arr = [];
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = trs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var tr = _step.value;

								arr.push(+tr.getAttribute('data-index'));
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

						if (type === 1) {
							_this2.beforeOperationRows = _this2.beforeOperationRows.filter(function (item, index) {
								return !arr.includes(index);
							});
						} else {
							_this2.afterOperationRows = _this2.afterOperationRows.filter(function (item, index) {
								return !arr.includes(index);
							});
						}
					});
				},
				moveUp: function moveUp(event, type) {
					var _this = this;
					var operationRows = type === 1 ? this.beforeOperationRows : this.afterOperationRows;
					var trs = $(event.target).closest('.operation-wrapper').find('input[type=\'checkbox\']:checked').closest('tr');
					$.each(trs, function (index, row) {
						var originIndex = row.getAttribute('data-index');
						originIndex >= 1 && operationRows.splice(originIndex - 1, 0, operationRows.splice(originIndex, 1)[0]);
					});
				},
				moveDown: function moveDown(event, type) {
					var _this = this;
					var operationRows = type === 1 ? this.beforeOperationRows : this.afterOperationRows;
					var trs = $(event.target).closest('.operation-wrapper').find('input[type=\'checkbox\']:checked').closest('tr');
					for (var i = trs.length - 1; i >= 0; i--) {
						var originIndex = trs[i].getAttribute('data-index');
						operationRows.splice(+originIndex + 1, 0, operationRows.splice(+originIndex, 1)[0]);
					}
				},
				// 更改方法时改变参数
				changeFunction: function changeFunction(target, index, type) {
					var operationRows = type === 1 ? this.beforeOperationRows : this.afterOperationRows;
					var me = this;
					var selectedIndex = target.selectedIndex;
					var option = target.options[selectedIndex];
					var selectedFunction = option.value;
					var parameters = option.getAttribute('data-parameters');
					parameters = JSON.parse(parameters);
					var newRow = this.operationRows[index];
					newRow.selectedFunc = selectedFunction;
					newRow.parameters = [];
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = parameters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var param = _step2.value;

							newRow.parameters.push({ Name: param.name, Value: '' });
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
				saveOperation: function saveOperation(event, type) {
					var str = type === 1 ? 'before' : 'after';
					var str2 = type === 1 ? '' : '2';
					var sendDataArray = [];
					var trs = Array.from(document.querySelectorAll('#sortable' + str2 + ' tr.' + str + '-operation-row'));
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = trs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var tr = _step3.value;

							// 
							var UI = tr.querySelector('.operation-ui').innerHTML.replace(/^\"+|\"+$/g, "\"");
							var element = tr.querySelector('.operation-element').innerHTML.replace(/^\"+|\"+$/g, "\"");
							var classType = tr.querySelector('.operation-element').getAttribute('data-classtype');
							var method = tr.querySelector('.functions-select').value;
							if (!UI && !method) {
								continue;
							}
							// 获取参数列表
							var paramTrs = Array.from(tr.querySelectorAll('.parameters .param-value'));
							var paramValues = [];
							var _iteratorNormalCompletion4 = true;
							var _didIteratorError4 = false;
							var _iteratorError4 = undefined;

							try {
								for (var _iterator4 = paramTrs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
									var paramTr = _step4.value;

									if (paramTr.innerHTML.startsWith('Data.TableColumn')) {
										paramValues.push('' + paramTr.innerHTML);
									} else {
										paramValues.push('"' + paramTr.innerHTML + '"');
									}
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

							if (paramValues.length === 0) {
								paramValues = ["\"\""];
							}
							var parameterString = paramValues.toString();
							var string = '';
							if (UI == '' && classType == '' && element == '') {
								string = method + '(' + paramValues + ')';
							} else {
								string = 'UI("' + UI + '").' + classType + '("' + element + '").' + method + '(' + paramValues + ')';
							}
							sendDataArray.push(string);
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

					var sendData = sendDataArray.join(';\n');
					sendData = sendData.length === 0 ? '' : sendData + ';';
					return sendData;
				},
				updateRow: function updateRow(rows, index) {
					// 使用splice方法，通过改变数组项的id更新绑定的数组，
					var cache = rows[index];
					cache.id = Symbol();
					rows.splice(index, 1, cache);
				}
			}
		});
		var modalVue = new Vue({
			el: '#ui-ele-modal',
			data: {},
			methods: {
				// 在模态框中点击了保存按钮
				editRow: function editRow() {
					var _this = this;
					if (!editDataVue.uiOrFunctions.changed) {
						return; // 没有点击树结构，则返回
					}
					// 保存当前点击行，行索引值以及当前需要操作的table所绑定的数组
					var parentRow = $(editDataVue.uiOrFunctions.target).parents('tr');
					var index = parentRow.attr('data-index');
					var operationRows = editDataVue.uiOrFunctions.table === 1 ? editDataVue.beforeOperationRows : editDataVue.afterOperationRows;

					if (editDataVue.uiOrFunctions.type === 'ui') {
						// 点击了ui 与 元素后, 更新operation
						operationRows[index].operation = {
							ui: editDataVue.uiOrFunctions.ui,
							element: editDataVue.uiOrFunctions.element,
							classType: editDataVue.uiOrFunctions.classType
						};

						// 使用splice方法，通过改变数组项的id更新绑定的数组，
						_this.updateRow(operationRows, index);

						// 发送ajax请求函数的数据
						var data = {
							id: autId, // autid
							classname: editDataVue.uiOrFunctions.classType // classname
						};

						var getFunctions = new Promise(function (resolve, reject) {
							$.ajax({
								url: address + 'autController/selectMethod',
								data: data,
								type: 'post',
								dataType: 'json',
								success: function success(data, statusText) {
									var _this$setFunctionAndP = _this.setFunctionAndParameter(data),
									    functions = _this$setFunctionAndP.functions,
									    parameterlist = _this$setFunctionAndP.parameterlist;

									operationRows[index].parameters = parameterlist;
									operationRows[index].functions = functions;
									operationRows[index].selectedFunc = functions.length ? functions[0].name : '';
									_this.updateRow(operationRows, index);
									resolve();
								}
							});
						});
					} else {
						operationRows[index].functions = [editDataVue.uiOrFunctions.function];
						operationRows[index].operation = { ui: '', element: '', classType: '' };
						var parametersArray = JSON.parse(operationRows[index].functions[0].parameterlist);
						operationRows[index].parameters = [];
						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;

						try {
							for (var _iterator5 = parametersArray[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var param = _step5.value;

								operationRows[index].parameters.push({
									Name: param.name,
									Value: ''
								});
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
					}
					$('#ui-ele-modal').modal('hide');
				},
				updateRow: function updateRow(rows, index) {
					// 使用splice方法，通过改变数组项的id更新绑定的数组，
					var cache = rows[index];
					cache.id = Symbol();
					rows.splice(index, 1, cache);
				},
				setFunctionAndParameter: function setFunctionAndParameter(data) {
					// set functino for ui and element 
					var operationRows = editDataVue.operationRows;
					var _this = this;
					var functions = [];
					var parameterlist = [];
					try {
						if (data.ommethod) {
							var _iteratorNormalCompletion6 = true;
							var _didIteratorError6 = false;
							var _iteratorError6 = undefined;

							try {
								for (var _iterator6 = data.ommethod[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
									var m = _step6.value;

									var o = {};
									o.name = m.mname;
									o.parameterlist = m.arguments;
									functions.push(o);
								}
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
						}
						if (data.arcmethod) {
							var _iteratorNormalCompletion7 = true;
							var _didIteratorError7 = false;
							var _iteratorError7 = undefined;

							try {
								for (var _iterator7 = data.acrmethod[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
									var _m = _step7.value;

									var o = {};
									o.name = _m.methodname;
									o.parameterlist = _m.arguments;
									functions.push(o);
								}
							} catch (err) {
								_didIteratorError7 = true;
								_iteratorError7 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion7 && _iterator7.return) {
										_iterator7.return();
									}
								} finally {
									if (_didIteratorError7) {
										throw _iteratorError7;
									}
								}
							}
						}

						if (functions.length) {
							var paras = JSON.parse('' + functions[0].parameterlist);
							var _iteratorNormalCompletion8 = true;
							var _didIteratorError8 = false;
							var _iteratorError8 = undefined;

							try {
								for (var _iterator8 = paras[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
									var para = _step8.value;

									parameterlist.push({ Name: para.name, Value: "" });
								}
							} catch (err) {
								_didIteratorError8 = true;
								_iteratorError8 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion8 && _iterator8.return) {
										_iterator8.return();
									}
								} finally {
									if (_didIteratorError8) {
										throw _iteratorError8;
									}
								}
							}
						}
						return { functions: functions, parameterlist: parameterlist };
					} catch (e) {
						console.error(e);
					}
				}
			}
		});
		var modalVue2 = new Vue({
			el: '#ui-ele-modal2',
			data: {},
			methods: {
				// 在模态框中点击了保存按钮
				editRowMultiple: function editRowMultiple() {

					var uiTree = $.fn.zTree.getZTreeObj("ui-element-ul2");
					var functionTree = $.fn.zTree.getZTreeObj("functions-ul2");
					var uiNodes = uiTree.getCheckedNodes(true);
					var operationRows = editDataVue.uiOrFunctions.table === 1 ? editDataVue.beforeOperationRows : editDataVue.afterOperationRows;
					var functionNodes = functionTree && functionTree.getCheckedNodes(true);
					var _iteratorNormalCompletion9 = true;
					var _didIteratorError9 = false;
					var _iteratorError9 = undefined;

					try {
						var _loop = function _loop() {
							node = _step9.value;

							if (node.isParent) {
								return 'continue';
							}
							var newRow = {}; // {id:Symbol(), functions: [], operation: {element:'', ui: '',parameters:[{Name: '', Value: ''}]}}
							newRow.id = Symbol();
							newRow.operation = {
								element: node.getParentNode().name,
								ui: node.name,
								classType: node.classType
							};
							newRow.functions = [];
							$.ajax({
								url: address + 'autController/selectMethod',
								data: { id: autId, classname: newRow.operation.classType },
								type: 'post',
								dataType: 'json',
								success: function success(data, statusText) {
									var _modalVue$setFunction = modalVue.setFunctionAndParameter(data),
									    functions = _modalVue$setFunction.functions,
									    parameterlist = _modalVue$setFunction.parameterlist;

									newRow.functions = functions;
									newRow.parameters = parameterlist;
									newRow.selectedFunc = functions.length ? functions[0].name : '';
									operationRows.push(newRow);
								}
							});
						};

						for (var _iterator9 = uiNodes[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
							var node;

							var _ret = _loop();

							if (_ret === 'continue') continue;
						}
					} catch (err) {
						_didIteratorError9 = true;
						_iteratorError9 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion9 && _iterator9.return) {
								_iterator9.return();
							}
						} finally {
							if (_didIteratorError9) {
								throw _iteratorError9;
							}
						}
					}

					if (functionNodes) {
						var _iteratorNormalCompletion10 = true;
						var _didIteratorError10 = false;
						var _iteratorError10 = undefined;

						try {
							for (var _iterator10 = functionNodes[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
								var node = _step10.value;

								console.log(node);
								var newRow = {};
								newRow.id = Symbol();
								newRow.operation = {
									element: '',
									ui: '',
									classType: ''
								};
								newRow.functions = [];
								newRow.functions.push({ name: node.mname, parameterlist: node.arguments });

								newRow.parameters = [];
								try {
									var parameters = JSON.parse(node.arguments);
									var _iteratorNormalCompletion11 = true;
									var _didIteratorError11 = false;
									var _iteratorError11 = undefined;

									try {
										for (var _iterator11 = parameters[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
											var param = _step11.value;

											newRow.parameters.push(_extends({}, param, { Name: param.name, Value: '' }));
										}
									} catch (err) {
										_didIteratorError11 = true;
										_iteratorError11 = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion11 && _iterator11.return) {
												_iterator11.return();
											}
										} finally {
											if (_didIteratorError11) {
												throw _iteratorError11;
											}
										}
									}
								} catch (e) {
									newRow.parameters = [];
								}
								operationRows.push(newRow);
							}
						} catch (err) {
							_didIteratorError10 = true;
							_iteratorError10 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion10 && _iterator10.return) {
									_iterator10.return();
								}
							} finally {
								if (_didIteratorError10) {
									throw _iteratorError10;
								}
							}
						}
					}
					$('#ui-ele-modal2').modal('hide');
				},
				updateRow: function updateRow(rows, index) {}
			}
		});
		var insertDivVue = new Vue({
			el: '#insertDiv',
			data: {
				isShow: false,
				type: null,
				insertTitle: null,
				trData: ['参数1', '参数2', '参数3', '参数4'],
				dataPoolType: null,
				dataWritable: "",
				functionName: ""
			},
			created: function created() {},
			methods: {
				show: function show(type, title) {
					this.isShow = true;
					this.insertTitle = title;
					this.type = type;
				},
				hide: function hide() {
					this.isShow = false;
					// this.trData = [];
				},
				saveData: function saveData() {
					var finalString = '';
					if (this.type === 1) {
						var dataName = document.getElementById("dataName").value;
						switch (this.dataPoolType) {
							case 1:
								finalString = "var(\"" + dataName + "\")";break;
							case 2:
								finalString = "Data.Flow(\"" + dataName + "\")";break;
							case 3:
								finalString = "Data.Com(\"" + dataName + "\")";break;
							case 4:
								finalString = this.dataWritable === "readable" ? "Data.Scene(\"" + dataName + "\")" : "Data.SceneShare(\"" + dataName + "\")";break;
							case 5:
								finalString = this.dataWritable === "readable" ? "Data.Scene(\"" + dataName + "\")" : "Data.SceneShare(\"" + dataName + "\")";break;
							case 6:
								finalString = "Data.Env(\"" + dataName + "\")";break;
						}
					} else {
						var paramValuesTd = document.getElementsByClassName("td-param-value");
						var paramValues = [];
						finalString = this.functionName + "(";
						var _iteratorNormalCompletion12 = true;
						var _didIteratorError12 = false;
						var _iteratorError12 = undefined;

						try {
							for (var _iterator12 = paramValuesTd[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
								var td = _step12.value;

								finalString += td.innerHTML.trim() + ",";
							}
						} catch (err) {
							_didIteratorError12 = true;
							_iteratorError12 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion12 && _iterator12.return) {
									_iterator12.return();
								}
							} finally {
								if (_didIteratorError12) {
									throw _iteratorError12;
								}
							}
						}

						finalString = finalString.substring(0, finalString.length - 1) + ")";
					}
					var input = document.getElementById("input4");
					var pos = this.getCursortPosition(input);
					var s = input.value;
					input.value = s.substring(0, pos) + finalString + s.substring(pos);
				},
				getCursortPosition: function getCursortPosition(ctrl) {
					var CaretPos = 0; // IE Support
					if (document.selection) {
						ctrl.focus();
						var Sel = document.selection.createRange();
						Sel.moveStart('character', -ctrl.value.length);
						CaretPos = Sel.text.length;
					}
					// Firefox support
					else if (ctrl.selectionStart || ctrl.selectionStart == '0') CaretPos = ctrl.selectionStart;
					return CaretPos;
				}
			}
		});
		var setting = {
			callback: {
				onDblClick: zTreeOnDblClick
			}
		};
		var zTreeObj;
		var data = {
			testpoint: 6,
			executor: 6,
			caseLib_id: 6
		};
		var sub = new Vue({
			el: '#submenu',
			data: {
				flag: true,
				selectItems: [],
				// checkedItems: [{value: 1,name: '登陆'},{value: 2,name: '注册'}],
				checkedItems: [],
				// 保存点击后的复选框
				checkedArray: [],
				systemInfo: {
					executor: 63,
					caseLib_id: 1,
					testpoints: '',
					script_mode: '',
					execute_method: ''
				},
				testpointsMap: new Map(),
				testpointLength: 0
			},
			created: function created() {},
			ready: function ready() {
				var _this = this;
				var data = [{
					"name": "测试点",
					"value": 1
				}, {
					"name": "执行状态",
					"value": 2
				}];
				_this.selectItems = data;
				_this.getInfo();
			},
			watch: {
				checkedArray: function checkedArray(newVal, oldVal) {
					var _this = this;
					if (newVal.length > 1) {
						newVal.shift();
						return;
					}
					if (newVal.length == 0) {
						zTreeObj = $.fn.zTree.init($("#tree-wrapper"), setting, []);
						return;
					}
					_this.systemInfo.testpoints = JSON.stringify(newVal);
					var checkboxs = $('input[value=' + newVal[0] + ']');
					_this.systemInfo.script_mode = checkboxs[0].getAttribute('data-script-mode');
					_this.systemInfo.execute_method = checkboxs[0].getAttribute('data-execute-method');
					var data = {
						executor: _this.systemInfo.executor,
						caseLib_id: _this.systemInfo.caseLib_id,
						testpoints: _this.systemInfo.testpoints
					};
					$.ajax({
						url: address + "autController/selectTestCaseByCondition",
						type: "post",
						dataType: "json",
						data: data,
						success: function success(data, textStatus) {
							if (!data.success) {
								Vac.alert(data.msg);
								return;
							}
							var treeData = [];
							if (data.o.length == 0) {
								Vac.alert('返回结果为空！');
								return;
							}
							data.o.forEach(function (value) {
								// var testpointMapVal = ''+value.id;
								var item = {}; //解构第一层
								item.open = true;
								item.children = [];
								value.children.forEach(function (value1) {
									var subData = {}; //解构第二层
									subData.children = [];
									subData.open = true;
									subData.id = value1.transactid;
									subData.name = value1.name;

									value1.children.forEach(function (value2) {
										var ssubData = {}; //解构第二层
										ssubData.id = value2.scriptid;
										ssubData.name = value2.name;

										subData.children.push(ssubData);
										console.log(newVal.length + "-" + _this.testpointLength);
										if (newVal.length > _this.testpointLength) {
											var testpointMapVal = value.autid + '-' + value1.transactid + '-' + value2.scriptid;
											// testpointsMap的格式：
											// {
											// 	"登录": {"22-57-1167"}
											// }
											// 注： 键名是其所属的testpoint,键值是set，
											// 	set中的数据格式： "autid-transid-scriptid"
											if (_this.testpointsMap.has(newVal[newVal.length - 1])) {
												_this.testpointsMap.get(newVal[newVal.length - 1]).add(testpointMapVal);
											} else {
												_this.testpointsMap.set(newVal[newVal.length - 1], new Set());
												_this.testpointsMap.get(newVal[newVal.length - 1]).add(testpointMapVal);
											}
											console.log(_this.testpointsMap);
										}
										// 生成关于testpoint的Map
									});
									item.children.push(subData);
								});
								item.id = value.autid;
								item.name = value.name;

								treeData.push(item);
							});
							zTreeObj = $.fn.zTree.init($("#tree-wrapper"), setting, treeData);
							_this.testpointLength = newVal.length;
						},
						error: function error() {
							Vac.alert('查询数据失败！');
						}
					});
				}
			},
			methods: {
				getInfo: function getInfo() {
					var userId = sessionStorage.getItem('userId');
					var caseLib_id = sessionStorage.getItem('caselibid');
					if (caseLib_id == null || caseLib_id == '') {
						Vac.confirm('#vac-confirm', '.okConfirm', '.cancelConfirm', '请先选择测试项目！').then(function () {
							window.location.href = 'testProject.html';
						}, function () {
							return;
						});
					}
					this.systemInfo.executor = userId;
					this.systemInfo.caseLib_id = caseLib_id;
				},
				toggle: function toggle() {
					this.flag = !this.flag;
					document.querySelector('.wtHolder') && (document.querySelector('.wtHolder').style.width = 'auto');
				},
				// 使用了mock
				changeSelect: function changeSelect(event) {
					var _this = this;
					// console.log('hello');
					if (event.target.value == 1) {
						var data = {
							executor: _this.systemInfo.executor,
							caseLib_id: _this.systemInfo.caseLib_id
							// 假数据，为了能取到数据配置的
						};var mockdata = {
							executor: 63,
							caseLib_id: 1
						};
						$.ajax({
							url: address + "TestcaseController/selectTestPointByCondition",
							data: data,
							type: 'post',
							dataType: "json",
							success: function success(data, textStatus) {
								if (!data.success) {
									Vac.alert(data.msg);
									return;
								}
								_this.checkedItems = [];
								if (!data.o || data.o.length == 0) {
									Vac.alert('未查询到相关测试点！');
									return;
								}
								var _iteratorNormalCompletion13 = true;
								var _didIteratorError13 = false;
								var _iteratorError13 = undefined;

								try {
									for (var _iterator13 = data.o[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
										var value = _step13.value;

										var arrayItem = {};
										if (value != null) {
											arrayItem.value = value.testpoint;
											arrayItem.execute_method = value.executeMethod;
											arrayItem.script_mode = value.scriptMode;

											arrayItem.name = arrayItem.value;
											_this.checkedItems.push(arrayItem);
										}
									}
								} catch (err) {
									_didIteratorError13 = true;
									_iteratorError13 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion13 && _iterator13.return) {
											_iterator13.return();
										}
									} finally {
										if (_didIteratorError13) {
											throw _iteratorError13;
										}
									}
								}
							},
							error: function error(XMLHttpRequest, textStatus, errorThrown) {
								Vac.alert('查询测试点失败，失败信息：' + textStatus);
							}
						});
					} else {
						_this.checkedItems = [];
						_this.checkedArray = [];
					}
				},
				// 使用了mock
				changeChecked: function changeChecked(event) {
					var _this = this;
					// console.log(JSON.stringify(_this.checkedArray))
					// console.log('[' + _this.checkedArray.toString() + ']')
					// _this.systemInfo.testpoints = JSON.stringify(_this.checkedArray)
					_this.systemInfo.testpoints = JSON.stringify(_this.checkedArray);
					// 假数据
					var dataMock = {
						executor: 63,
						caseLib_id: 1,
						testpoints: JSON.stringify(["登录"])
					};
					$.ajax({
						url: address + "autController/selectTestCaseByCondition",
						type: "post",
						dataType: "json",
						data: _this.systemInfo,
						// data: dataMock,
						success: function success(data, textStatus) {
							if (data.success) {
								var treeData = [];
								if (data.o.length == 0) {
									Vac.alert('该测试点下未查询到相关数据！');
									return;
								}
								data.o.forEach(function (value) {
									var item = {}; //解构第一层
									item.open = true;
									item.children = [];
									value.children.forEach(function (value) {
										var subData = {}; //解构第二层
										subData.children = [];
										subData.open = true;
										subData.id = value.transactid;
										subData.name = value.name;

										value.children.forEach(function (value) {
											var ssubData = {};
											ssubData.id = value.scriptid;
											ssubData.name = value.name;

											subData.children.push(ssubData);
										});
										item.children.push(subData);
									});
									item.id = value.autid;
									item.name = value.name;

									treeData.push(item);
								});
								zTreeObj = $.fn.zTree.init($("#tree-wrapper"), setting, treeData);
							} else {
								Vac.alert(data.msg);
							}
						}
					});
				}
			}
		});

		// handsontable init
		var tableContainer = document.getElementById("handsontable");
		var handsontable = null;
		var dataSource = null;
		var changedData = [];
		var selectAllFlag = false;
		var rowSelectFlags = [];
		var string = "";
		var editableColStartIndex = 3;
		var editableColEndIndex = 5;
		var clipBoard = [];
		var clipBoardSize = {
			cols: 0,
			rows: 0
		};
		var searchResults = null;
		var currentResult = 0;
		// var undoTimes = 0;
		var contextMenuObj = {
			callback: function callback(key, options) {},
			items: {
				"row_above": {
					name: '复制',
					callback: copyCallback,
					disabled: function disabled() {
						return false;
					},
					hidden: function hidden() {
						return false;
					}
				},
				"row_below": {
					name: '剪切',
					callback: cutCallback,
					disabled: function disabled() {
						return false;
					},
					hidden: function hidden() {
						// [startRow, startCol, endRow, endCol]
						var selection = handsontable.getSelected();
						if (selection && selection[1] >= 7 && selection[0] == selection[2] && selection[1] == selection[3]) {
							return false;
						}
						return true;
					}
				},
				"col_left": {
					name: '粘贴',
					callback: pasteCallback,
					disabled: function disabled() {
						return clipBoard.length === 0 ? true : false;
					},
					hidden: function hidden() {
						// [startRow, startCol, endRow, endCol]
						var selection = handsontable.getSelected();
						if (selection && selection[1] >= 7 && selection[0] == selection[2] && selection[1] == selection[3]) {
							return false;
						}
						return true;
					}
				},
				"col_right": {
					name: '清除',
					callback: clearCallback,
					disabled: function disabled() {
						return false;
					},
					hidden: function hidden() {
						// [startRow, startCol, endRow, endCol]
						var selection = handsontable.getSelected();
						if (selection && selection[1] >= 7 && selection[0] == selection[2] && selection[1] == selection[3]) {
							return false;
						}
						return true;
					}
				},
				"remove_row": {
					name: '查找与替换',
					callback: searchCallback,
					disabled: function disabled() {
						return false;
					},
					hidden: function hidden() {
						return false;
					}
				},
				// "remove_col":{
				// 	name: '替换',
				// 	callback: replaceCallback,
				// 	disabled: function(){return false;},
				// 	hidden: function(){return false;}
				// },
				"make_read_only": {
					name: '编辑数据',
					callback: editCellData,
					disabled: function disabled() {},
					hidden: function hidden() {
						// [startRow, startCol, endRow, endCol]
						var selection = handsontable.getSelected();
						if (selection && selection[1] >= 7 && selection[0] == selection[2] && selection[1] == selection[3]) {
							return false;
						}
						return true;
					}
				}
			}
		};
		/// 2017-08-25 删除行号这一列
		var columnsHeaders = ["<input type='checkbox' class='header-checker' " + (selectAllFlag ? "checked='checked'" : "") + ">", // "行号",
		"案例编号", "测试点", "测试意图", "测试步骤", "预期结果", "检查点"];
		var columnsOptions = [{
			data: "testcaseId",
			renderer: function renderer(instance, td, row, col, prop, value, cellProperties) {
				td.style.textAlign = 'center';
				td.innerHTML = "<input type='checkbox' data-index='" + row + "' class='checker' " + (rowSelectFlags[row] ? "checked='checked'" : "") + ">" + '<button onclick="viewScript(event)" style="padding: 3px 5px;" class="btn btn-primary" data-id="' + value + '">查看脚本</button>';
				return td;
			},
			readOnly: true
		},
		// {	data:"",
		// 	renderer: function(instance, td, row, col, prop, value, cellProperties){
		// 		td.innerHTML = parseInt(row) + 1;
		// 			return td;
		// 	},
		// 	readOnly: true
		// },
		{ data: "casecode", readOnly: true }, { data: "testpoint", readOnly: true }, { data: "testdesign", readOnly: true }, { data: 'teststep', readOnly: true }, { data: 'expectresult', readOnly: true }, { data: 'checkpoint', readOnly: true }];
		var totalColumnsHeaders = [];
		var getColumnsOptions = function getColumnsOptions(tableHead) {
			//tableHead = [ ["[待删除]","商品"], ["[待删除]","t1"] ]
			var totalColumnsOptions = [];
			var dataKey = getDataKey(tableHead);
			console.log("getColumnsOptions中dataKey:" + dataKey);
			// dataKey = ["商品","t1"]
			dataKey.forEach(function (key) {
				if (key) {
					var option = {
						data: key,
						readOnly: false
					};
					totalColumnsOptions.push(option);
				}
			});
			totalColumnsOptions = columnsOptions.concat(totalColumnsOptions);
			return totalColumnsOptions;
		};
		var getTotalColHeaders = function getTotalColHeaders(data) {
			// console.log("const"+columnsHeaders);
			totalColumnsHeaders = [];
			// console.log("before"+totalColumnsHeaders);
			if (data && data.length) {
				data.forEach(function (value) {
					if (value.length > 0) {
						var header = value.join('<br>');
						totalColumnsHeaders.push(header);
						// console.log("every"+ totalColumnsHeaders);
					}
				});
			}
			totalColumnsHeaders = columnsHeaders.concat(totalColumnsHeaders);
		};
		// 得到数据的表头
		var getDataKey = function getDataKey(data) {
			//data = [ ["[待删除]","商品"], ["[待删除]","t1"] ]
			var dataKey = [];
			if (data) {
				data.forEach(function (value) {
					dataKey.push(value[1]);
				});
			}

			return dataKey;
		};
		function zTreeOnDblClick(event, treeId, treeNode) {
			if (treeNode && !treeNode.isParent) {
				autId = treeNode.getParentNode().getParentNode().id;
				transid = treeNode.getParentNode().id;
				var scriptId = treeNode.id;
				var data = {
					testpoint: sub.checkedArray[0],
					// script_mode: sub.systemInfo.script_mode,
					// execute_method: sub.systemInfo.execute_method,
					executor: sub.systemInfo.executor,
					caseLib_id: sub.systemInfo.caseLib_id,
					autId: autId,
					transId: transid,
					scriptId: scriptId
				};
				tooltipwindow.scriptSelected = true;
				tooltipwindow.testPoint = sub.checkedArray[0];
				tooltipwindow.executor = sub.systemInfo.executor;
				tooltipwindow.caselibId = sub.systemInfo.caseLib_id;
				tooltipwindow.autId = autId;
				tooltipwindow.transId = transid;
				tooltipwindow.scriptId = scriptId;
				$.ajax({
					url: address + "scripttemplateController/searchScripttemplateInf",
					data: data,
					type: "post",
					dataType: "json",
					success: function success(data) {
						if (data.success) {
							var dataKey = [];
							if (data.o.tableHead) {
								// [ ["[待删除]","商品"], ["[待删除]","t1"] ]
								dataKey = getDataKey(data.o.tableHead);
								console.log("dataKey:" + dataKey);
							}
							var destrutData = [];
							if (data.o.tableDatas) {
								if (data.o.tableDatas.length == 0) {
									Vac.alert('该脚本下未查询到相关数据！');
								}
								data.o.tableDatas.forEach(function (value) {
									var data = {};
									data.testcaseId = value.id;
									data.expectresult = value.expectresult;
									data.testpoint = value.testpoint;
									data.teststep = value.teststep;
									data.checkpoint = value.checkpoint;
									data.testdesign = value.testdesign;
									data.casecode = value.casecode;

									dataKey.forEach(function (key) {
										data[key] = value[key];
									});
									console.log(data);
									destrutData.push(data);
								});
							}
							// console.log(destrutData);
							dataSource = destrutData;
							// console.log(dataSource)
							rowSelectFlags.length = dataSource.length;
							getTotalColHeaders(data.o.tableHead);
							// console.log(totalColumnsHeaders);
							var totalColumnsOptions = getColumnsOptions(data.o.tableHead);
							// handsontable 配置与生成
							if (handsontable === null) {
								handsontable = new Handsontable(tableContainer, {
									data: dataSource,
									hiddenColumns: {
										columns: [2, 3],
										indicators: false
									},
									// 配置列表头
									columns: totalColumnsOptions,
									colHeaders: colHeadersRenderer,
									// colWidths: [50, 90, 90, 90, 90, 90, 90],
									// stretchH: 'all',
									rowHeaders: true,
									cells: function cells(row, col, prop) {
										var cellProperties = {};
										return cellProperties;
									},
									// 配置可以改变行的大小
									manualRowResize: true,
									multiSelect: true,
									outsideClickDeselects: true,
									// 配置contextMenu
									contextMenu: contextMenuObj,
									undo: true,
									copyPaste: true,
									allowInsertRow: false,
									allowInsertColumn: false,
									fillHandle: false,
									search: {
										searchResultClass: ''
									},
									afterRender: function afterRender() {
										if (searchResults && searchResults.length) {
											var trs = document.querySelectorAll('#handsontable tbody tr');
											searchResults.forEach(function (value, index) {
												var tds = trs[value.row].getElementsByTagName('td');
												if (index === currentResult) {
													tds[value.col].style.backgroundColor = "#f00";
												} else {
													tds[value.col].style.backgroundColor = "#0f0";
												}
											});
										}
										document.querySelectorAll(".handsontable table th")[0].style.display = "none";
									},
									afterChange: function afterChange(changes, source) {
										if (changes) {
											// console.log(changes)
											changes.forEach(function (value) {
												var data = {};
												// data.testcaseId = handsontable.getDataAtRowProp(value[0], 'casecode');
												data.testcaseId = dataSource[value[0]].testcaseId;
												data.tbHead = value[1];
												data.value = value[3];
												var changedIndex;
												changedData.forEach(function (value, index) {
													if (value.testcaseId == data.testcaseId && value.tbHead == data.tbHead) {
														changedIndex = index;
													}
												});
												if (changedIndex !== undefined) {
													changedData.splice(changedIndex, 1, data);
												} else {
													changedData.push(data);
												}
											});
										}
									}
								});
								// handsontable.updateSettings(contextMenuObj);
							} else {
								handsontable.updateSettings({
									data: dataSource,
									columns: totalColumnsOptions,
									colHeaders: colHeadersRenderer
								});
								handsontable.render();
							}
						} else {
							Vac.alert(data.msg);
						}
					},
					error: function error() {
						Vac.alert('获取数据失败，请确认该脚本中含有数据！');
					}
				}); //aj
			}
		}
		Handsontable.Dom.addEvent(tableContainer, 'mousedown', function (event) {
			if (event.target.nodeName == 'INPUT' && event.target.className == 'header-checker') {
				selectAllFlag = !event.target.checked;
				for (var i = 0; i < rowSelectFlags.length; i++) {
					rowSelectFlags[i] = selectAllFlag;
				}
				var inputs = document.querySelectorAll('#handsontable tbody tr td:first-child input');
				var trs = document.querySelectorAll('#handsontable tbody tr');
				if (selectAllFlag) {
					var _iteratorNormalCompletion14 = true;
					var _didIteratorError14 = false;
					var _iteratorError14 = undefined;

					try {
						for (var _iterator14 = trs[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
							var tr = _step14.value;

							tr.className = 'selected';
						}
					} catch (err) {
						_didIteratorError14 = true;
						_iteratorError14 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion14 && _iterator14.return) {
								_iterator14.return();
							}
						} finally {
							if (_didIteratorError14) {
								throw _iteratorError14;
							}
						}
					}

					var _iteratorNormalCompletion15 = true;
					var _didIteratorError15 = false;
					var _iteratorError15 = undefined;

					try {
						for (var _iterator15 = inputs[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
							var input = _step15.value;

							input.checked = true;
						}
					} catch (err) {
						_didIteratorError15 = true;
						_iteratorError15 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion15 && _iterator15.return) {
								_iterator15.return();
							}
						} finally {
							if (_didIteratorError15) {
								throw _iteratorError15;
							}
						}
					}
				} else {
					var _iteratorNormalCompletion16 = true;
					var _didIteratorError16 = false;
					var _iteratorError16 = undefined;

					try {
						for (var _iterator16 = trs[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
							var tr = _step16.value;

							tr.className = '';
						}
					} catch (err) {
						_didIteratorError16 = true;
						_iteratorError16 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion16 && _iterator16.return) {
								_iterator16.return();
							}
						} finally {
							if (_didIteratorError16) {
								throw _iteratorError16;
							}
						}
					}

					var _iteratorNormalCompletion17 = true;
					var _didIteratorError17 = false;
					var _iteratorError17 = undefined;

					try {
						for (var _iterator17 = inputs[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
							var input = _step17.value;

							input.checked = false;
						}
					} catch (err) {
						_didIteratorError17 = true;
						_iteratorError17 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion17 && _iterator17.return) {
								_iterator17.return();
							}
						} finally {
							if (_didIteratorError17) {
								throw _iteratorError17;
							}
						}
					}
				}
				// handsontable.render();
				event.stopPropagation();
			} else if (event.target.nodeName == 'INPUT' && event.target.className == 'checker') {
				var row = event.target.getAttribute('data-index');
				rowSelectFlags[row] = !event.target.checked;
				var inputs = document.querySelectorAll('#handsontable tbody tr td:first-child input');
				var trs = document.querySelectorAll('#handsontable tbody tr');
				if (rowSelectFlags[row]) {
					trs[row].className = 'selected';
				} else {
					trs[row].className = '';
				}
			} else {}
		});
		var searchBoxVue = new Vue({
			el: '#searchBox',
			data: {
				isShow: false,
				searOrRep: false,
				keyword: "",
				newword: '',
				searchResults: null,
				currentReult: 0
			},
			methods: {
				show: function show(searOrRep) {
					this.isShow = true;
					this.searOrRep = searOrRep;
				},
				hide: function hide() {
					this.isShow = false;
					searchResults = null;
					currentResult = 0;
					this.keyword = "";
					handsontable.search.query(this.keyword);
					handsontable.render();
				},
				showSearch: function showSearch() {
					this.searOrRep = false;
				},
				showReplace: function showReplace() {
					this.searOrRep = true;
				},
				search: function search() {
					searchResults = handsontable.search.query(this.keyword);
					currentResult = 0;
					// this.renderResults();
					handsontable.render();
				},
				findNext: function findNext() {
					currentResult += 1;
					if (currentResult >= searchResults.length) {
						currentResult = 0;
					}
					this.renderResults();
					this.scrollViewportTo(searchResults);
				},
				replace: function replace() {
					handsontable.setDataAtCell(searchResults[currentResult].row, searchResults[currentResult].col, this.newword);
					searchResults = handsontable.search.query(this.keyword);
					handsontable.render();
					if (currentResult >= searchResults.length) {
						currentResult = 0;
					}
					this.renderResults();
				},
				replaceAll: function replaceAll() {
					var _this3 = this;

					this.search();
					if (searchResults && searchResults.length) {
						var newData = [];
						searchResults.forEach(function (value) {
							var data = [value.row, value.col, _this3.newword];
							newData.push(data);
						});
						handsontable.setDataAtCell(newData);
						handsontable.render();
					}
				},
				scrollViewportTo: function scrollViewportTo(result) {
					if (result && result.length) {
						handsontable.scrollViewportTo(result[currentResult]['row'], result[currentResult]['col']);
					}
				},
				renderResults: function renderResults() {
					if (searchResults && searchResults.length) {
						var trs = document.querySelectorAll('#handsontable tbody tr');
						searchResults.forEach(function (value, index) {
							var tds = trs[value.row].getElementsByTagName('td');
							if (index === currentResult) {
								tds[value.col].style.backgroundColor = "#f00";
							} else {
								tds[value.col].style.backgroundColor = "#0f0";
							}
						});
					}
				}
			},
			computed: {}
		});
		//window resize
		window.onresize = function () {
			if (handsontable !== null) {
				handsontable.render();
			}
			try {
				var submenuHeight = document.querySelector('#submenu').offsetHeight;
				document.querySelector('#submenu').children[0].style.height = submenuHeight / 2 + 'px';
				document.querySelector('#submenu').children[1].style.height = submenuHeight / 2 + 'px';
			} catch (e) {}
		};
		//保存按钮
		document.getElementById('saveAll').onclick = function () {
			var data = { data: changedData };
			console.log(encodeURIComponent(JSON.stringify(data)));
			$.ajax({
				url: address + 'scripttemplateController/scripttemplateInf',
				data: "jsonStr=" + encodeURIComponent(JSON.stringify(data), 'utf-8'),
				dataType: 'json',
				type: 'post',
				success: function success(data, textStatus) {
					if (data.success === true) {
						Vac.alert('保存成功');
					}
				}
			});
		};
		// 查看脚本
		//双击单元格，跳出编辑数据框
		document.querySelectorAll('.dbclick').onDblClick = function () {
			// console.log('niah');
		};
		//渲染第0列的内容
		function colHeadersRenderer(col) {
			if (parseInt(col) === 0) {
				return "<input type='checkbox' class='header-checker' " + (selectAllFlag ? "checked='checked'" : "") + ">";
			} else {
				return totalColumnsHeaders[col];
			}
		};
		//渲染第一列的内容 end
		//渲染平常列
		function renderNormalCol(instance, td, row, col, prop, value, cellProperties) {
			// if (row % 2) {
			// 	// td.style.backgroundColor = "#eeee11";
			// } else {
			// 	// td.style.backgroundColor = "#ffff00";
			// }
			// if (rowSelectFlags[row] === true) {
			// 	// td.style.backgroundColor = "#1ABDE6";
			// } else {
			// 	// td.style.backgroundColor = "#fff";
			// }
			// if (td.isSearchResult) {
			// 	// td.style.backgroundColor = "#fff";
			// 	// console.log("result");
			// }
			td.innerHTML = value;
			return td;
		};
		//渲染平常列 end

		//复制功能函数
		function copyCallback(key, selection) {
			var trueIndexArray = [];
			rowSelectFlags.forEach(function (flag, index) {
				if (flag) {
					trueIndexArray.push(index);
				}
			});
			// 先清空剪切板
			while (clipBoard.length > 0) {
				clipBoard.pop();
			}
			//选择所有被选中的单元格
			var i = 0;
			for (i = selection.start.row; i <= selection.end.row; i++) {
				var j = 0;
				for (j = selection.start.col; j <= selection.end.col; j++) {
					var _data = [i - selection.start.row, j - selection.start.col, handsontable.getDataAtCell(i, j)];
					clipBoard.push(_data);
				}
			}
			clipBoardSize.cols = selection.end.col - selection.start.col + 1;
			clipBoardSize.rows = selection.end.row - selection.start.row + 1;
		}
		//复制功能函数 end
		//粘贴功能函数
		// the data of the clipboard : [[row,col,value],[row,col,value]]
		// the data of selection: { start: { col: 1, row: 3 }, end: { col: 2, row: 4 }}
		function pasteCallback(key, selection) {
			if (clipBoard.length > 0) {
				var cols = selection.end.col - selection.start.col + 1;
				var rows = selection.end.row - selection.start.row + 1;
				if (cols <= clipBoardSize.cols && rows <= clipBoardSize.rows) {
					var clipBoardData = clipBoard.map(function (array) {
						var arrayData = [];
						arrayData[0] = parseInt(array[0]) + parseInt(selection.start.row);
						arrayData[1] = parseInt(array[1]) + parseInt(selection.start.col);
						arrayData[2] = array[2];
						return arrayData;
					});
					setCellsData(clipBoardData);
				} else if (cols > clipBoardSize.cols && rows <= clipBoardSize.rows) {
					var int = Math.floor(cols / clipBoardSize.cols);
					var i = 0;
					for (i = 0; i < int; i++) {
						var clipBoardData = clipBoard.map(function (array) {
							var arrayData = [];
							arrayData[0] = parseInt(array[0]) + parseInt(selection.start.row);
							arrayData[1] = parseInt(array[1]) + parseInt(selection.start.col) + i * clipBoardSize.cols;
							arrayData[2] = array[2];
							return arrayData;
						});
						setCellsData(clipBoardData);
					}
				} else if (cols <= clipBoardSize.cols && rows > clipBoardSize.rows) {
					var int = Math.floor(rows / clipBoardSize.rows);
					var i = 0;
					for (i = 0; i < int; i++) {
						var clipBoardData = clipBoard.map(function (array) {
							var arrayData = [];
							arrayData[0] = parseInt(array[0]) + parseInt(selection.start.row) + i * clipBoardSize.rows;
							arrayData[1] = parseInt(array[1]) + parseInt(selection.start.col);
							arrayData[2] = array[2];
							return arrayData;
						});
						setCellsData(clipBoardData);
					}
				} else {
					var rowInt = Math.floor(rows / clipBoardSize.rows);
					var colInt = Math.floor(cols / clipBoardSize.cols);
					var i = 0,
					    j = 0;
					for (i = 0; i < rowInt; i++) {
						for (j = 0; j < colInt; j++) {
							var clipBoardData = clipBoard.map(function (array) {
								var arrayData = [];
								arrayData[0] = parseInt(array[0]) + parseInt(selection.start.row) + i * clipBoardSize.rows;
								arrayData[1] = parseInt(array[1]) + parseInt(selection.start.col) + j * clipBoardSize.cols;
								arrayData[2] = array[2];
								return arrayData;
							});
							setCellsData(clipBoardData);
						}
					}
				}
			}
		}
		//粘贴功能函数 end
		//剪切功能函数
		function cutCallback(key, selection) {
			var trueIndexArray = [];
			rowSelectFlags.forEach(function (flag, index) {
				if (flag) {
					trueIndexArray.push(index);
				}
			});
			// 先清空剪切板
			while (clipBoard.length > 0) {
				clipBoard.pop();
			}
			//选择所有被选中的单元格
			//将所有选中单元格复制到剪切板,同时清空选中单元格的内容
			var clipBoardData = [];
			var i = 0;
			for (i = selection.start.row; i <= selection.end.row; i++) {
				var j = 0;
				for (j = selection.start.col; j <= selection.end.col; j++) {
					var _data2 = [i - selection.start.row, j - selection.start.col, handsontable.getDataAtCell(i, j)];
					var nullData = [i, j, ""];
					clipBoard.push(_data2);
					clipBoardData.push(nullData);
				}
			}
			handsontable.setDataAtCell(clipBoardData);
		}
		//剪切功能函数 end
		// 清除功能函数
		function clearCallback(key, selection) {
			var trueIndexArray = [];
			rowSelectFlags.forEach(function (flag, index) {
				if (flag) {
					trueIndexArray.push(index);
				}
			});
			//选择所有被选中的单元格
			//将所有选中单元格复制到剪切板,同时清空选中单元格的内容
			var clipBoardData = [];
			var i = 0;
			for (i = selection.start.row; i <= selection.end.row; i++) {
				var j = 0;
				for (j = selection.start.col; j <= selection.end.col; j++) {
					var nullData = [i, j, ""];
					// clipBoard.push(data);
					clipBoardData.push(nullData);
				}
			}
			handsontable.setDataAtCell(clipBoardData);
		}
		//清除功能函数 end
		// //搜索功能函数
		function searchCallback(key, selection) {
			searchBoxVue.show(false);
		}
		// //搜索功能函数 end
		// //搜索功能函数
		function replaceCallback(key, selection) {
			searchBoxVue.show(true);
		}
		// //搜索功能函数 end
		//编辑单元格数据
		function editCellData(key, selection) {
			var header = handsontable.getColHeader(selection.start.col);
			var testcaseId = dataSource[selection.start.row].testcaseId;
			editDataVue.show(selection);
		}
		// 编辑单元格数据
		// 设置单元格数据，保证设置的数据不超过最大行，最大列

		// parameter: [[row,col,value],[row,col,value]]
		function setCellsData(arrayData) {
			var maxCol = handsontable.countCols() - 1;
			var maxRow = handsontable.countRows() - 1;
			arrayData = arrayData.filter(function (value) {
				if (value[0] <= maxRow && value[1] <= maxCol) {
					return true;
				} else {
					return false;
				}
			});
			handsontable.setDataAtCell(arrayData);
		}
	})();

	var editDiv = document.querySelector('#editData');
	var header = document.querySelector('#editData>header');
	Vac.startDrag(header, editDiv);
	Vac.startDrag(document.querySelector('#searchBox>header'), document.querySelector('#searchBox'));
	Vac.startDrag(document.querySelector('#insertDiv>header'), document.querySelector('#insertDiv'));
});