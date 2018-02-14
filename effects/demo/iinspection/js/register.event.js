
//by zqq 2017.9.7
//登录注册按钮点击切换
$('#login-btn').click(function () {
    $('#login-box').show();
    $('#register-box').hide();
    $('#login-btn').addClass('text-deco');
    $('#register-btn').removeClass('text-deco');
});
$('#register-btn').click(function () {
    $('#login-box').hide();
    $('#register-box').show();
    $('#register-btn').addClass('text-deco');
    $('#login-btn').removeClass('text-deco');
});

/*
注册登录逻辑
*/
//注册
 var MyValidator = function() {
 var handleSubmit = function() {
 $('#register-box').validate({
   errorElement : 'spans',
 //errorClass : 'help-block',
 focusInvalid : false,
 rules : {
 registerId : {
 required : true
 },
 registerPassword : {
 required : true
 },
 reginsterPwdComfirm : {
 required : true,
 equalTo: "#password-register"
 }
 },
 messages : {
 registerId : {
 required : "请输入警员编号"
 },
 registerPassword: {
 required : "请输入密码"
 },
 reginsterPwdComfirm:{
 required : "请再次输入密码",
 equalTo:'两次输入的密码不一致'
 }
 },
	onfocusout : false,
	onkeyup : false,
	onclick : false,
	focusCleanup : true,
 highlight : function(element) {
 $(element).closest('.form-group').addClass('has-error');
 },

 success : function(label) {
 label.closest('.form-group').removeClass('has-error');
 label.remove();
 },
	
 errorPlacement : function(error, element) {
 //element.parent('div').append(error);
 error.appendTo(element.siblings("label"));
 },
showErrors :function(errorMap,errorList){ 
	$('#' + errorMap[0]).parent().addClass('has-error');
	this.defaultShowErrors();
	//$(element).closest('.form-group').addClass('has-error');
	//console.log(errorList[0].message) 
},
 submitHandler : function(form) {
	 
 form.submit();
 }
 });

 $('#register-box input').keypress(function(e) {
 if (e.which == 13) {
 if ($('#register-box').validate().form()) {
 $('#register-box').submit();
 }
 return false;
 }
 });
 }
 return {
 init : function() {
 handleSubmit();
 }
 };
 }();

 //登录
var MyValidatorLogin = function() {
    var handleSubmit = function() {
        $('#login-box').validate({
            //errorElement : 'span',
            //errorClass : 'help-block',
            focusInvalid : false,
            rules : {
               LoginId : {
                    required : true,
                },
                LoginPwd : {
                    required : true
                }
            },
			onfocusout : false,
			onkeyup : false,
			onclick : false,
			focusCleanup : true,
            messages : {
                LoginId : {
                    required : "请输入警员编号"
                },
                LoginPwd: {
                    required : "请输入密码"
                }
            },

            highlight : function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },

            success : function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement : function(error, element) {
                //element.parent('div').append(error);
                error.appendTo(element.siblings("label"));
            },

            submitHandler : function(form) {
                form.submit();
            }
        });

        $('#login-box input').keypress(function(e) {
            if (e.which == 13) {
                if ($('#login-box').validate().form()) {
                    $('#login-box').submit();
                }
                return false;
            }
        });
    }
    return {
        init : function() {
            handleSubmit();
        }
    };

}();

