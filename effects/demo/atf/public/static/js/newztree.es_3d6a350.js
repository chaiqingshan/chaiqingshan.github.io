'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// editDataVue 保存一个selectedScript属性，用于设置是否显示下方的表格
// 关于是否保存过：
// mainVue 保存一个变量，
$(document).ready(function () {
    var mainVue = new Vue({
        el: '#main',
        data: {
            autId: '',
            autIds: [],
            transId: '',
            transIds: [],
            templateList: [],
            checkedTemplate: [],
            lastCheckedTemplate: null,
            script_id: '',
            // ids: '',
            // 新增模板绑定数据
            newTemplate: {
                name: '',
                description: ''
            },
            scriptIsChanged: false,
            scriptLength: 0
        },
        ready: function ready() {
            var _this = this;
            _this.getAutandTrans();
            $('#addtemplateModal').on('hidden.bs.modal', function (e) {
                _this.newTemplate = {
                    name: '',
                    description: ''
                };
            });
        },
        computed: {},
        methods: {
            //初始化获取测试系统和功能点
            getAutandTrans: function getAutandTrans() {
                $.ajax({
                    // async: false,
                    url: address + "autController/selectAll",
                    type: "POST",
                    success: function success(data) {
                        var autList = data.obj;
                        var str = "";
                        for (var i = 0; i < autList.length; i++) {

                            str += " <option value='" + autList[i].id + "' >" + autList[i].autName + "</option> ";
                        }

                        $('#autSelect').html(str);
                        mainVue.autId = sessionStorage.getItem("autId");
                        $("#autSelect").val(mainVue.autId);
                        $.ajax({
                            url: address + 'transactController/showalltransact',
                            data: { 'autlistselect': mainVue.autId },
                            type: "POST",
                            success: function success(data) {
                                var transactList = data.o;
                                var str = "";
                                for (var i = 0; i < transactList.length; i++) {

                                    str += " <option value='" + transactList[i].id + "'>" + transactList[i].transname + "</option> ";
                                }
                                $('#transactSelect').html(str);
                                mainVue.transId = sessionStorage.getItem("transactId");
                                $("#transactSelect").val(mainVue.transId);
                                mainVue.getScriptTemplate();
                            }
                        });
                    }
                });
            },
            //获取测试系统
            autSelect: function autSelect() {
                $.ajax({
                    async: true,
                    url: address + "autController/selectAll",
                    type: "POST",
                    success: function success(data) {
                        var autList = data.obj;
                        var str = "";
                        for (var i = 0; i < autList.length; i++) {

                            str += " <option value='" + autList[i].id + "' >" + autList[i].autName + "</option> ";
                        }

                        $('#autSelect').html(str);
                    }
                });
            },
            //功能点
            transactSelect: function transactSelect() {
                var val = $('#autSelect').val();
                var _this = this;
                // var val = sessionStorage.getItem('autId');
                // console.log(this.autId);
                $.ajax({
                    async: true,
                    url: address + 'transactController/showalltransact',
                    data: { 'autlistselect': val },
                    type: "POST",
                    success: function success(data) {
                        // console.log(data.o)
                        var transactList = data.o;
                        var str = "";
                        for (var i = 0; i < transactList.length; i++) {

                            str += " <option value='" + transactList[i].id + "'>" + transactList[i].transname + "</option> ";
                        }
                        $('#transactSelect').html(str);
                        _this.transId = $('#transactSelect').val();
                        _this.getScriptTemplate();
                    }
                });
            },
            //  值
            setval: function setval() {
                this.autId = sessionStorage.getItem("autId");
                this.transId = sessionStorage.getItem("transactId");
                $("#autSelect").val(this.autId);
                $("#transactSelect").val(this.transId);
            },
            getScriptTemplate: function getScriptTemplate() {
                var _this = this;
                if (_this.scriptIsChanged) {
                    var promise = Vac.confirm('#vac-confirm', '.okConfirm', '.cancelConfirm', "编辑后的基础脚本未保存，是否保存？");
                    promise.then(function () {
                        editDataVue.tableSave();
                        getTemplate();
                        _this.scriptIsChanged = false;
                    }, function () {
                        getTemplate();
                        _this.scriptIsChanged = false;
                    });
                } else {
                    getTemplate();
                }
                function getTemplate() {
                    $.ajax({
                        url: address + 'scripttemplateController/showallscripttemplate',
                        data: { 'transactid': _this.transId },
                        type: "POST",
                        success: function success(data) {
                            _this.templateList = data.o;
                            _this.checkedTemplate = [];
                            editDataVue.selectedScript = 0;
                        }
                    });
                }
            },
            change: function change(event) {
                var value = +event.target.value;
                var array = this.checkedTemplate.slice(0);
                var _this = this;
                var index = $(event.target).val();
                if (event.target.checked) {
                    if (this.scriptIsChanged) {
                        var promise = Vac.confirm('#vac-confirm', '.okConfirm', '.cancelConfirm', "编辑后的基础脚本未保存，是否保存？");
                        promise.then(function () {
                            editDataVue.tableSave();
                            // this.checkedTemplate = this.checkedTemplate.slice(0, -1)
                            // event.preventDefault()
                            // return
                            _this.scriptIsChanged = false;
                            _this.checkedTemplate = [+value];
                            process(value);
                            event.preventDefault();
                        }, function () {
                            _this.scriptIsChanged = false;
                            _this.checkedTemplate = [+value];
                            process(value);
                            event.preventDefault();
                        });
                    } else {
                        this.checkedTemplate = [value];
                        process(value);
                    }
                } else {
                    // event.preventDefault()
                    if (this.scriptIsChanged) {
                        var promise = Vac.confirm('#vac-confirm', '.okConfirm', '.cancelConfirm', "编辑后的基础脚本未保存，是否保存？");
                        promise.then(function () {
                            editDataVue.tableSave();
                            // this.checkedTemplate = this.checkedTemplate.slice(0)
                            // this.checkedTemplate = [+value]
                            // return
                            _this.scriptIsChanged = false;
                            _this.checkedTemplate = [];
                            editDataVue.selectedScript = 0;
                            event.target.checked = false;
                        }, function () {
                            _this.scriptIsChanged = false;
                            _this.checkedTemplate = [];
                            editDataVue.selectedScript = 0;
                            event.target.checked = false;
                        });
                    } else {
                        _this.checkedTemplate = [];
                        editDataVue.selectedScript = 0;
                        // $(`input[value='${index}']`).prop('checked', false);
                    }
                }
                // 查询模板脚本
                function process(value) {
                    var length = _this.checkedTemplate.length;
                    // if(length > 1) {
                    //     _this.checkedTemplate.shift()
                    // }
                    editDataVue.selectedScript = 1;
                    if (length > 0) {
                        var templateId = +value;
                        _this.script_id = _this.templateList[templateId].id;
                        var data = {
                            aut_id: _this.autId,
                            script_id: _this.templateList[templateId].id
                        };
                        _this.showScripttemplateTableArgs = {
                            aut_id: _this.autId,
                            script_id: _this.templateList[templateId].id
                        };
                        editDataVue.operationRows = [];
                        $.ajax({
                            url: address + 'scripttemplateController/showScripttemplateTable',
                            data: data,
                            type: 'post',
                            dataType: 'json',
                            success: function success(data) {
                                // _this.scriptIsChanged = false
                                editDataVue.operationRows = [];
                                if (data.success === true) {
                                    // {id:Symbol(), functions: [], operation: {element:'', ui: '',parameters:[{Name:'', Value: ''}]}}
                                    _this.scriptLength = data.o.data.length;

                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                        for (var _iterator = data.o.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                            var operationRow = _step.value;

                                            var row = {
                                                id: null,
                                                functions: [],
                                                operation: {
                                                    element: '',
                                                    ui: '',
                                                    classType: ''
                                                },
                                                parameters: []
                                            };
                                            row.id = Symbol();
                                            row.functions.push({ name: operationRow.function, parameterlist: "" });
                                            row.operation.element = operationRow.operator[2];
                                            row.operation.ui = operationRow.operator[0];
                                            row.operation.classType = operationRow.operator[1];
                                            var _iteratorNormalCompletion2 = true;
                                            var _didIteratorError2 = false;
                                            var _iteratorError2 = undefined;

                                            try {
                                                for (var _iterator2 = operationRow.arguments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                                    var para = _step2.value;

                                                    row.parameters.push({
                                                        Name: para.name,
                                                        Value: para.value
                                                    });
                                                }
                                                // 插入到operationRows中
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

                                            editDataVue.operationRows.push(row);
                                            // editDataVue.operationRows = [row]
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
                                } else {
                                    Vac.alert(data.msg);
                                }
                            }
                        });
                    }
                }
            },
            showScripttemplateTable: function showScripttemplateTable(args) {
                var _this = this;
                $.ajax({
                    url: address + 'scripttemplateController/showScripttemplateTable',
                    data: args,
                    type: 'post',
                    dataType: 'json',
                    success: function success(data) {
                        // _this.scriptIsChanged = false
                        editDataVue.operationRows = [];
                        if (data.success === true) {
                            // {id:Symbol(), functions: [], operation: {element:'', ui: '',parameters:[{Name:'', Value: ''}]}}
                            _this.scriptLength = data.o.data.length;

                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = data.o.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var operationRow = _step3.value;

                                    var row = {
                                        id: null,
                                        functions: [],
                                        operation: {
                                            element: '',
                                            ui: '',
                                            classType: ''
                                        },
                                        parameters: []
                                    };
                                    row.id = Symbol();
                                    row.functions.push({ name: operationRow.function });
                                    row.operation.element = operationRow.operator[2];
                                    row.operation.ui = operationRow.operator[0];
                                    row.operation.classType = operationRow.operator[1];
                                    var _iteratorNormalCompletion4 = true;
                                    var _didIteratorError4 = false;
                                    var _iteratorError4 = undefined;

                                    try {
                                        for (var _iterator4 = operationRow.arguments[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                            var para = _step4.value;

                                            row.parameters.push({
                                                Name: para.name,
                                                Value: para.value
                                            });
                                        }
                                        // 插入到operationRows中
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

                                    editDataVue.operationRows.push(row);
                                    // editDataVue.operationRows = [row]
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
                        } else {
                            Vac.alert(data.msg);
                        }
                    }
                });
            },
            saveTemplate: function saveTemplate() {
                var _this = this;
                _this.newTemplate.transId = _this.transId;
                $.ajax({
                    url: address + 'scripttemplateController/insert',
                    data: _this.newTemplate,
                    type: 'post',
                    dataType: 'json',
                    success: function success(data) {
                        Vac.alert('添加成功！');
                        $('#addtemplateModal').modal('hide');
                        _this.getScriptTemplate();
                    },
                    error: function error() {
                        Vac.alert('添加失败！');
                    }
                });
            },
            deleteTemplate: function deleteTemplate() {
                var _this = this;
                if (!_this.checkedTemplate.length) {
                    Vac.alert('请选择要删除的模板！');
                    return;
                }
                var templateId = this.checkedTemplate[0];
                _this.script_id = _this.templateList[templateId].id;
                $.ajax({
                    url: address + 'scripttemplateController/delete',
                    data: { 'id': _this.script_id },
                    type: 'post',
                    dataType: 'json',
                    success: function success(data) {
                        if (data) {
                            Vac.alert('删除成功！');
                            _this.getScriptTemplate();
                        }
                    },
                    error: function error() {
                        Vac.alert('删除失败！');
                    }
                });
            }
        }
    });

    var editDataVue = new Vue({
        el: '#table2',
        data: {
            // 保存table中每一行的数据 [{id:Symbol(), functions: {{name: '',  parameterlist: ''}], operation: {element:'', ui: '',parameters:[]}}],
            operationRows: [], //[{id:Symbol(), functions: [], operation: {element:'1', ui: '2', parameters: [{Name: 'name1', Value: ''}]}}],
            // parameterVue: null,
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
                classType: '', // 保存元素类型
                element: '', // 保存点击的元素
                function: '', // 保存点击的函数集中的项
                target: null, // 保存点击编辑的target，据此可以获得parent tr
                index: 0 // 保存每一行的index
            },
            selectedScript: 0
        },
        ready: function ready() {
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
                            _this.operationRows.unshift(_this.operationRows.splice(start, 1)[0]);
                        } else {
                            _this.operationRows.splice(target, 0, _this.operationRows.splice(start, 1)[0]);
                        }
                        _this.setChanged();
                    }
                });
                // $("#sortable").disableSelection();
            });
            // $('#edit-parameter-modal').on('hidden.bs.modal', function() {

            // })
            $('.2').addClass('open');
            $('.2 .arrow').addClass('open');
            $('.2-ul').css({ display: 'block' });
            $('.2-0').css({ color: '#ff6c60' });
        },
        methods: {
            setChanged: function setChanged() {
                mainVue.scriptIsChanged = true;
            },
            addRow: function addRow() {
                var s = { id: Symbol(), operation: { element: '', ui: '', classType: '' }, functions: [], parameters: [] };
                this.operationRows.push(s);
                this.setChanged();
            },
            insertRow: function insertRow(index) {
                this.setChanged();
                this.operationRows.splice(+index + 1, 0, { id: Symbol(), operation: { element: '', ui: '', classType: '' }, functions: [], parameters: [] });
            },
            deleteRow: function deleteRow(index) {
                var _this2 = this;

                var pro = Vac.confirm('', '', '', '确认要删除吗？');
                pro.then(function () {
                    _this2.setChanged();
                    _this2.operationRows.splice(index, 1);
                }, function () {});
            },
            // remove the row who is checked when 
            removeRow: function removeRow(event) {
                var _this3 = this;

                var parent = $(event.target).closest('.operation-wrapper');
                var trs = parent.find("tbody input[type='checkbox']:checked").closest('tr');
                if (!trs.length) return;
                Vac.confirm('', '', '', '确认要删除选中项吗？').then(function () {
                    var arr = [];
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = trs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var tr = _step5.value;

                            arr.push(+tr.getAttribute('data-index'));
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

                    _this3.operationRows = _this3.operationRows.filter(function (item, index) {
                        return !arr.includes(index);
                    });
                    mainVue.scriptIsChanged = true;
                });
            },
            moveUp: function moveUp(event) {
                this.setChanged();
                var _this = this;
                var operationRows = this.operationRows;
                var trs = $(event.target).closest('.operation-wrapper').find('input[type=\'checkbox\']:checked').closest('tr');
                $.each(trs, function (index, row) {
                    var originIndex = row.getAttribute('data-index');
                    originIndex >= 1 && operationRows.splice(originIndex - 1, 0, operationRows.splice(originIndex, 1)[0]);
                });
                mainVue.scriptIsChanged = true;
            },
            moveDown: function moveDown(event) {
                console.log(JSON.parse('[{"Name":"\u8F93\u5165\u503C1","Type":"","Desc":"","ParameterizeColumn":"{element}"},{"Name":"\u8F93\u5165\u503C2","Type":"","Desc":"","ParameterizeColumn":"{element}"}]'));
                var _this = this;
                var operationRows = this.operationRows;
                var trs = $(event.target).closest('.operation-wrapper').find('input[type=\'checkbox\']:checked').closest('tr');
                for (var i = trs.length - 1; i >= 0; i--) {
                    var originIndex = trs[i].getAttribute('data-index');
                    operationRows.splice(+originIndex + 1, 0, operationRows.splice(+originIndex, 1)[0]);
                }
                this.setChanged();
            },
            // 更改方法时改变参数
            changeFunction: function changeFunction(target, index) {
                var me = this;
                var selectedIndex = target.selectedIndex;
                var option = target.options[selectedIndex];
                var selectedFunction = option.value;
                var parameters = option.getAttribute('data-parameters');
                parameters = JSON.parse(parameters);
                var newRow = this.operationRows[index];
                newRow.selectedFunc = selectedFunction;
                newRow.parameters = [];
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = parameters[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var param = _step6.value;

                        newRow.parameters.push({ Name: param.name, Value: '' });
                    }
                    // console.log(this.operationRows)
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
            },
            // 遍历表格，保存脚本内容
            generateScriptString: function generateScriptString(arr) {
                var sendDataArray = [];
                var trs = Array.from(document.querySelectorAll('#sortable tr.before-operation-row '));
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = trs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var tr = _step7.value;

                        var UI = tr.querySelector('.operation-ui').innerHTML.replace(/^\"+|\"+$/g, "\"");
                        var element = tr.querySelector('.operation-element').innerHTML.replace(/^\"+|\"+$/g, "\"");
                        var classType = tr.querySelector('.operation-element').getAttribute('data-classtype');
                        var method = tr.querySelector('.functions-select').value;
                        if (!UI && !method) {
                            continue;
                        }
                        // 获取参数列表
                        var paramTrs = Array.from(tr.querySelectorAll('.parameters .param-row'));
                        var paramValues = [];
                        var type = 1; // record the type  --  1: normal  2: canshuhua biaozhu
                        var _iteratorNormalCompletion8 = true;
                        var _didIteratorError8 = false;
                        var _iteratorError8 = undefined;

                        try {
                            for (var _iterator8 = paramTrs[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                var paramRow = _step8.value;

                                var paramName = paramRow.querySelector('.param-name');
                                if (paramName.innerHTML.includes('参数化标注')) {
                                    type = 2;
                                }
                                var paramTr = paramRow.querySelector('.param-value');
                                if (paramTr.innerHTML.startsWith('Data.TableColumn')) {
                                    paramValues.push('' + paramTr.innerHTML);
                                } else {
                                    // paramValues.push(`"${paramTr.innerHTML}"`);
                                    paramValues.push('""');
                                }
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

                        if (paramValues.length === 0) {
                            paramValues = ["\"\""];
                        }
                        var parameterString = paramValues.toString();
                        var string;
                        if (type === 1) {
                            if (UI == '' && classType == '' && element == '') {
                                string = method + '(' + parameterString + ');\n';
                                // string = `${method}();\n`;
                            } else {
                                string = 'UI("' + UI + '").' + classType + '("' + element + '").' + method + '(' + parameterString + ');\n';
                                // string = `UI("${UI}").${classType}("${element}").${method}();\n`;
                            }
                        } else {
                            if (UI == '' && classType == '' && element == '') {
                                string = method + '();#' + parameterString + '\n';
                            } else {
                                string = 'UI("' + UI + '").' + classType + '("' + element + '").' + method + '();#' + parameterString + '\n';
                                // string = `UI("${UI}").${classType}("${element}").${method}();#${parameterString}\n`;
                            }
                        }
                        sendDataArray.push(string);
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

                return sendDataArray.join('');
            },
            //保存 
            tableSave: function tableSave() {
                //UI("denglu").webedit("username").set(1,"123");
                var sendData = this.generateScriptString();
                // Vac.alert('这是生成的脚本代码:\n' + sendData)
                // UI(""登录页面"").webedit("webedit").set("3");UI(""登录页面"").webedit("webedit").set("444");UI("welcome to the system").webedit("webedit").set("333")
                // return
                $.ajax({
                    url: address + 'scripttemplateController/scripttemplateSave',
                    type: 'post',
                    data: {
                        'script_id': mainVue.script_id,
                        'content': sendData
                    },
                    success: function success(data) {
                        if (data.success) {
                            $('#success').modal();
                            mainVue.scriptIsChanged = false;
                        } else {
                            $('#fail').modal();
                        }
                    },
                    error: function error() {
                        $('#fail').modal();
                    }
                });
            },
            //参数化
            para: function para() {
                var sendData = this.generateScriptString();
                $.ajax({
                    url: address + 'scripttemplateController/showscripttemplateTableSave',
                    type: 'post',
                    data: {
                        'autId': mainVue.autId,
                        'script_id': mainVue.script_id,
                        'content': sendData
                    },
                    success: function success(data) {
                        Vac.alert(data.msg);
                        mainVue.showScripttemplateTable(mainVue.showScripttemplateTableArgs);
                    },
                    error: function error() {
                        Vac.alert('参数化失败，请求未成功');
                    }
                });
            },
            // 显示UI和元素 、函数集
            showUiAndElement: function showUiAndElement(event, type) {
                this.uiOrFunctions.target = event.target;
                this.uiOrFunctions.changed = false;
                // 请求Ui和Elment
                this.getUIAndFunctions(1);
                $('#ui-ele-modal').modal('show');
            },
            showUIModal: function showUIModal() {
                this.getUIAndFunctions(2);
                $('#ui-ele-modal2').modal('show');
            },
            getUIAndFunctions: function getUIAndFunctions(type) {
                var str = +type === 1 ? '' : 2;
                var setting = +type === 1 ? this.zTreeSettings : this.zTreeSettings2;
                $.ajax({
                    url: address + 'elementlibraryController/showUIandElementforScript',
                    data: 'transid=' + mainVue.transId,
                    type: 'post',
                    dataType: 'json',
                    success: function success(data, statusText) {
                        if (data && data.success === true && data.obj instanceof Array) {
                            var tree = $.fn.zTree.init($('#ui-element-ul' + str), setting.uiAndElement, data.obj);
                            tree.expandAll(true);
                            // var da = [{"id":1,"parentid":0,"name":"ui-chai"},{"id":2,"parentid":1,"name":"ele-chai", "classType": 'webedit'}]
                            // $.fn.zTree.init($('#ui-element-ul'+str), setting.uiAndElement, da);
                        }
                    }
                });
                // 请求函数集
                $.ajax({
                    url: address + 'autController/selectFunctionSet',
                    data: { 'id': mainVue.autId },
                    type: 'post',
                    dataType: 'json',
                    success: function success(data, statusText) {
                        if (data.obj) {
                            $.fn.zTree.init($('#functions-ul' + str), setting.functions, data.obj);
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
                    var o = {};
                    o.name = treeNode.mname;
                    o.parameterlist = treeNode.arguments;
                    this.uiOrFunctions.function = o;
                }
                this.uiOrFunctions.changed = true; // 已经在模态框中点击了树节点
            },
            // 编辑参数方法，出现模态框，进行函数的编辑
            editParameter: function editParameter(event, type) {
                var _this = this;
                // 保存当前点击行，行索引值以及当前需要操作的table所绑定的数组
                var target = event.target;
                target.style.visibility = 'hidden';
                var parent = $(target).parent()[0];
                $('.param-table', parent).css({ 'display': 'table' });
                $('.param-show', parent).css({ 'display': 'none' });
                var paramV = $('.param-value', parent)[0];
                paramV && paramV.focus();
                var range = document.createRange();
                var sel = window.getSelection();
                paramV && range.setStart(paramV.childNodes[0], paramV.innerHTML.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            },
            cancelEditParam: function cancelEditParam(event) {
                var table = $(event.target).parents('.param-table');
                $('.edit-param', table.parents('tr')).css({ 'visibility': 'visible' });
                table.css({ display: 'none' });
                $('.param-show', table.parents('tr')).css({ 'display': 'block' });
            },
            saveParam: function saveParam(event) {
                var _this4 = this;

                var target = $(event.target);
                var tbody = target.parents('.param-table');
                var trs = [].concat(_toConsumableArray($('.param-row', tbody)));
                var parentRow = target.parents('table').parents('tr');
                var valueShows = $('.param-value-show', parentRow);
                console.log(valueShows);
                this.operationRows[parentRow.attr('data-index')].parameters.length = 0;
                trs.forEach(function (row, index) {
                    var data = {};
                    data.Name = row.querySelector('.param-name').innerHTML;
                    data.Value = row.querySelector('.param-value').innerHTML;
                    valueShows[index].innerHTML = data.Value;
                    _this4.operationRows[parentRow.attr('data-index')].parameters.push(data);
                });
                this.cancelEditParam(event);
                // 已经修改过
                mainVue.scriptIsChanged = true;
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
                // 已经修改过
                mainVue.scriptIsChanged = true;
                var _this = this;
                if (!editDataVue.uiOrFunctions.changed) {
                    return; // 没有点击树结构，则返回
                }
                // 保存当前点击行，行索引值以及当前需要操作的table所绑定的数组
                var parentRow = $(editDataVue.uiOrFunctions.target).parents('tr');
                var index = parentRow.attr('data-index');
                var operationRows = editDataVue.operationRows;

                if (editDataVue.uiOrFunctions.type === 'ui') {
                    // 点击了ui 与 元素后, 更新operation
                    operationRows[index].operation = {
                        ui: editDataVue.uiOrFunctions.ui,
                        element: editDataVue.uiOrFunctions.element,
                        classType: editDataVue.uiOrFunctions.classType
                    };
                    operationRows[index].functions = [];
                    operationRows[index].parameters = [];
                    operationRows[index].selectedFunc = '';

                    // 使用splice方法，通过改变数组项的id更新绑定的数组，
                    _this.updateRow(operationRows, index);

                    // 发送ajax请求函数的数据
                    var data = {
                        id: mainVue.autId, // autid
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
                    // parameters: [{"name":"11","valueclass":"11","parameterizedcolumn":"","defaultvalue":"","description":""}]
                    var parametersArray = JSON.parse(operationRows[index].functions[0].parameterlist);

                    operationRows[index].parameters = [];
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = parametersArray[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var param = _step9.value;

                            operationRows[index].parameters.push({
                                Name: param.name,
                                Value: ''
                            });
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

                    _this.updateRow(operationRows, index);
                }
                $('#ui-ele-modal').modal('hide');
                // editDataVue.uiOrFunctions.changed = false;
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
                        var _iteratorNormalCompletion10 = true;
                        var _didIteratorError10 = false;
                        var _iteratorError10 = undefined;

                        try {
                            for (var _iterator10 = data.ommethod[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                var m = _step10.value;

                                var o = {};
                                o.name = m.mname;
                                o.parameterlist = m.arguments;
                                functions.push(o);
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
                    if (data.acrmethod) {
                        var _iteratorNormalCompletion11 = true;
                        var _didIteratorError11 = false;
                        var _iteratorError11 = undefined;

                        try {
                            for (var _iterator11 = data.acrmethod[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                var _m = _step11.value;

                                var o = {};
                                o.name = _m.methodname;
                                o.parameterlist = _m.arguments;
                                functions.push(o);
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
                    }

                    if (functions.length) {
                        var paras = JSON.parse('' + functions[0].parameterlist);
                        var _iteratorNormalCompletion12 = true;
                        var _didIteratorError12 = false;
                        var _iteratorError12 = undefined;

                        try {
                            for (var _iterator12 = paras[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                                var para = _step12.value;

                                parameterlist.push({ Name: para.name, Value: "" });
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
                // 已经修改过
                mainVue.scriptIsChanged = true;
                var uiTree = $.fn.zTree.getZTreeObj("ui-element-ul2");
                var functionTree = $.fn.zTree.getZTreeObj("functions-ul2");
                var uiNodes = uiTree.getCheckedNodes(true);

                var functionNodes = functionTree ? functionTree.getCheckedNodes(true) : [];
                var _iteratorNormalCompletion13 = true;
                var _didIteratorError13 = false;
                var _iteratorError13 = undefined;

                try {
                    var _loop = function _loop() {
                        node = _step13.value;

                        if (node.isParent) {
                            return 'continue';
                        }
                        var newRow = {}; // {id:Symbol(), functions: [], operation: {element:'', ui: ''},parameters:[{Name: '', Value: ''}]}}
                        newRow.id = Symbol();
                        newRow.operation = {
                            ui: node.getParentNode().name,
                            element: node.name,
                            classType: node.classType
                        };
                        newRow.functions = [];
                        $.ajax({
                            url: address + 'autController/selectMethod',
                            data: { id: mainVue.autId, classname: newRow.operation.classType },
                            type: 'post',
                            dataType: 'json',
                            success: function success(data, statusText) {
                                var _modalVue$setFunction = modalVue.setFunctionAndParameter(data),
                                    functions = _modalVue$setFunction.functions,
                                    parameterlist = _modalVue$setFunction.parameterlist;

                                newRow.functions = functions;
                                newRow.selectedFunc = functions.length ? functions[0].name : '';
                                newRow.parameters = parameterlist;
                                editDataVue.operationRows.push(newRow);
                            }
                        });
                    };

                    for (var _iterator13 = uiNodes[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                        var node;

                        var _ret = _loop();

                        if (_ret === 'continue') continue;
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

                if (functionNodes && functionNodes.length) {
                    var _iteratorNormalCompletion14 = true;
                    var _didIteratorError14 = false;
                    var _iteratorError14 = undefined;

                    try {
                        for (var _iterator14 = functionNodes[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                            var node = _step14.value;

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
                                var _iteratorNormalCompletion15 = true;
                                var _didIteratorError15 = false;
                                var _iteratorError15 = undefined;

                                try {
                                    for (var _iterator15 = parameters[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                                        var param = _step15.value;

                                        newRow.parameters.push({ Name: param.name, Value: '' });
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
                            } catch (e) {
                                newRow.parameters = [];
                            }

                            editDataVue.operationRows.push(newRow);
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
                }
                $('#ui-ele-modal2').modal('hide');
            },
            updateRow: function updateRow(rows, index) {}
        }
    });
});